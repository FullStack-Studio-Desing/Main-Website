"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSchemaError } from "@/lib/portal/errors";
import { todayISO } from "@/lib/portal/format";
import { requireAdmin, requireClient } from "@/lib/portal/session";
import type { ActionState } from "@/lib/portal/types";
import { isUuid, parseInvoice } from "@/lib/portal/validators";
import {
  createTokenFromSavedCard,
  deleteCustomerCard,
  findOrCreateMpCustomer,
  saveCardToCustomer,
} from "@/server/billing/customers";
import { sendInvoiceEmail } from "@/server/billing/invoice-mail";
import { mpConfigured } from "@/server/billing/mp";
import { createCardCharge } from "@/server/billing/orders";

function gateAdminError(session: Awaited<ReturnType<typeof requireAdmin>>): ActionState {
  if (session.kind === "unconfigured") return { error: "Supabase is not connected yet." };
  if (session.kind === "schema") return { error: "Run the portal SQL migration, then try again." };
  if (session.kind === "needs-promotion") {
    return { error: "This account is not an admin yet." };
  }
  return { error: "The portal is not ready yet." };
}

async function adminGate(): Promise<{ userId: string } | { error: string }> {
  const session = await requireAdmin();
  if (session.kind !== "ready") {
    const state = gateAdminError(session);
    return { error: state?.error ?? "The portal is not ready yet." };
  }
  return { userId: session.userId };
}

function safeDbError(error: { code?: string; message?: string } | null, fallback: string): ActionState {
  if (!error) return { error: fallback };
  console.error("[billing]", error.message ?? fallback);
  if (isSchemaError(error)) {
    return { error: "Run the CRM billing SQL migration, then try again." };
  }
  return { error: fallback };
}

function nextInvoiceNumber() {
  const stamp = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replace(/-/g, "");
  return `INV-${stamp}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

function payUrlFor(token: unknown) {
  return typeof token === "string" && /^[a-f0-9]{32,64}$/.test(token)
    ? `${siteOrigin()}/pay/${token}`
    : null;
}

function revalidateInvoicePaths(clientId: string, invoiceId?: string) {
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/invoices");
  if (invoiceId) revalidatePath(`/admin/invoices/${invoiceId}`);
  revalidatePath("/admin/payments");
  revalidatePath("/portal");
}

/** Optional project link, parsed here so validators.ts stays untouched. */
async function resolveProjectId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  clientId: string,
  formData: FormData,
): Promise<{ value: string | null } | { error: string }> {
  const raw = String(formData.get("project_id") ?? "").trim();
  if (!raw) return { value: null };
  if (!isUuid(raw)) return { error: "Choose a valid project." };
  const project = await supabase
    .from("projects")
    .select("id")
    .eq("id", raw)
    .eq("client_id", clientId)
    .maybeSingle();
  if (project.error || !project.data) {
    return { error: "That project does not belong to this client." };
  }
  return { value: raw };
}

async function loadDefaultPaymentMethod(clientId: string, preferredId?: string | null) {
  const supabase = await createClient();
  if (preferredId && isUuid(preferredId)) {
    const preferred = await supabase
      .from("payment_methods")
      .select("*")
      .eq("id", preferredId)
      .eq("client_id", clientId)
      .eq("status", "active")
      .maybeSingle();
    if (preferred.data) return preferred.data;
  }
  const fallback = await supabase
    .from("payment_methods")
    .select("*")
    .eq("client_id", clientId)
    .eq("status", "active")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return fallback.data ?? null;
}

async function chargeSavedMethod(input: {
  clientId: string;
  amount: number;
  description: string;
  externalReference: string;
  paymentMethodId?: string | null;
  periodLabel?: string | null;
  invoiceId?: string | null;
  projectId?: string | null;
}) {
  if (!mpConfigured()) {
    return {
      ok: false as const,
      message: "Add MP_ACCESS_TOKEN and MP_PUBLIC_KEY in .env.local.",
      orderId: undefined as string | undefined,
    };
  }

  const supabase = await createClient();
  const clientRes = await supabase
    .from("clients")
    .select("email, contact_name, mp_customer_id, tax_id_type, tax_id_number")
    .eq("id", input.clientId)
    .maybeSingle();
  if (clientRes.error || !clientRes.data) {
    return {
      ok: false as const,
      message: "That client could not be found.",
      orderId: undefined as string | undefined,
    };
  }

  const method = await loadDefaultPaymentMethod(input.clientId, input.paymentMethodId);
  if (!method) {
    return {
      ok: false as const,
      message: "This client has no card on file. Ask them to add one in the portal first.",
      orderId: undefined as string | undefined,
    };
  }

  const tokenized = await createTokenFromSavedCard({ cardId: method.mp_card_id });
  if (!tokenized.ok) {
    return { ok: false as const, message: tokenized.message, orderId: undefined as string | undefined };
  }

  const brand = typeof method.brand === "string" && method.brand ? method.brand : "visa";
  const outcome = await createCardCharge({
    amount: input.amount,
    description: input.description,
    externalReference: input.externalReference,
    token: tokenized.token,
    paymentMethodId: brand,
    email: clientRes.data.email,
    customerId: method.mp_customer_id,
    identificationType: (clientRes.data.tax_id_type as "RFC" | "CURP" | null) ?? null,
    identificationNumber: clientRes.data.tax_id_number,
    idempotencyKey: randomUUID(),
  });

  if (!outcome.ok) {
    return { ok: false as const, message: outcome.message, orderId: outcome.id };
  }

  const paidOn = todayISO();
  const paymentInsert = await supabase
    .from("payments")
    .insert({
      client_id: input.clientId,
      amount: input.amount,
      currency: "USD",
      status: outcome.status === "processed" ? "paid" : "pending",
      paid_on: outcome.status === "processed" ? paidOn : null,
      period_label: input.periodLabel ?? null,
      method: "Mercado Pago",
      reference: outcome.id || null,
      notes: outcome.message,
      mp_order_id: outcome.id || null,
      charge_currency: outcome.charge?.currency ?? null,
      charge_amount: outcome.charge?.amount ?? null,
      fx_rate: outcome.charge?.rate ?? null,
      ...(input.invoiceId ? { invoice_id: input.invoiceId } : {}),
      ...(input.projectId ? { project_id: input.projectId } : {}),
    })
    .select("id")
    .single();

  if (paymentInsert.error || !paymentInsert.data) {
    return {
      ok: false as const,
      message: "Mercado Pago charged, but the payment row could not be saved.",
      orderId: outcome.id,
    };
  }

  return {
    ok: true as const,
    status: outcome.status,
    orderId: outcome.id,
    paymentId: paymentInsert.data.id as string,
    message: outcome.message,
    methodId: method.id as string,
  };
}

export async function createInvoice(
  clientId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const gate = await adminGate();
  if ("error" in gate) return gate;
  if (!isUuid(clientId)) return { error: "That client could not be found." };

  const parsed = parseInvoice(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const clientRes = await supabase
    .from("clients")
    .select("id, email, company_name")
    .eq("id", clientId)
    .maybeSingle();
  if (clientRes.error) return safeDbError(clientRes.error, "The invoice could not be saved.");
  if (!clientRes.data) return { error: "That client could not be found." };

  const project = await resolveProjectId(supabase, clientId, formData);
  if ("error" in project) return project;

  const number = nextInvoiceNumber();
  const insert = await supabase
    .from("invoices")
    .insert({
      client_id: clientId,
      payment_method_id: parsed.value.payment_method_id,
      number,
      title: parsed.value.title,
      description: parsed.value.description,
      amount: parsed.value.amount,
      currency: parsed.value.currency,
      billing_type: parsed.value.billing_type,
      status: "draft",
      period_label: parsed.value.period_label,
      due_on: parsed.value.due_on,
      next_charge_on: parsed.value.next_charge_on,
      ...(project.value ? { project_id: project.value } : {}),
      created_by: gate.userId,
    })
    .select("id, public_token")
    .single();

  if (insert.error || !insert.data) {
    return safeDbError(insert.error, "The invoice could not be saved.");
  }

  const invoiceId = insert.data.id as string;
  const payUrl = payUrlFor(insert.data.public_token);
  let notice = `Invoice ${number} saved as a draft.`;

  if (parsed.value.charge_now) {
    const charged = await chargeSavedMethod({
      clientId,
      amount: parsed.value.amount,
      description: parsed.value.title,
      externalReference: `invoice_${invoiceId}`,
      paymentMethodId: parsed.value.payment_method_id,
      periodLabel: parsed.value.period_label,
      invoiceId,
      projectId: project.value,
    });

    if (!charged.ok) {
      await supabase
        .from("invoices")
        .update({
          status: "failed",
          sent_at: new Date().toISOString(),
          mp_order_id: charged.orderId ?? null,
        })
        .eq("id", invoiceId);
      revalidatePath(`/admin/clients/${clientId}`);
      revalidatePath("/admin/invoices");
      return { error: charged.message };
    }

    await supabase
      .from("invoices")
      .update({
        status: charged.status === "processed" ? "paid" : "sent",
        sent_at: new Date().toISOString(),
        paid_at: charged.status === "processed" ? new Date().toISOString() : null,
        mp_order_id: charged.orderId,
        payment_id: charged.paymentId,
        payment_method_id: charged.methodId,
      })
      .eq("id", invoiceId);

    if (charged.paymentId) {
      await supabase.from("payments").update({ invoice_id: invoiceId }).eq("id", charged.paymentId);
    }

    notice =
      charged.status === "processed"
        ? `Invoice ${number} charged on the card on file.`
        : `Invoice ${number} sent. Mercado Pago is still confirming the charge.`;

    if (parsed.value.send_email) {
      await sendInvoiceEmail({
        to: clientRes.data.email,
        companyName: clientRes.data.company_name,
        invoiceNumber: number,
        title: parsed.value.title,
        amount: parsed.value.amount,
        billingType: parsed.value.billing_type,
        portalUrl: `${siteOrigin()}/portal`,
        payUrl,
        dueOn: parsed.value.due_on,
        charged: charged.status === "processed",
      });
    }
  } else if (parsed.value.send_email) {
    const mailed = await sendInvoiceEmail({
      to: clientRes.data.email,
      companyName: clientRes.data.company_name,
      invoiceNumber: number,
      title: parsed.value.title,
      amount: parsed.value.amount,
      billingType: parsed.value.billing_type,
      portalUrl: `${siteOrigin()}/portal`,
      payUrl,
      dueOn: parsed.value.due_on,
      charged: false,
    });
    await supabase
      .from("invoices")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);
    notice = mailed.ok
      ? `Invoice ${number} emailed to ${clientRes.data.email}.`
      : `Invoice ${number} marked sent, but email failed: ${mailed.message}`;
  }

  revalidateInvoicePaths(clientId, invoiceId);
  redirect(`/admin/invoices/${invoiceId}?notice=${encodeURIComponent(notice)}`);
}

export async function createInvoiceGlobal(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const clientId = String(formData.get("client_id") ?? "").trim();
  if (!isUuid(clientId)) return { error: "Choose a client for this invoice." };
  return createInvoice(clientId, _prev, formData);
}

export async function chargeInvoice(
  clientId: string,
  invoiceId: string,
  _formData?: FormData,
): Promise<ActionState> {
  const gate = await adminGate();
  if ("error" in gate) return gate;
  if (!isUuid(clientId) || !isUuid(invoiceId)) return { error: "That invoice could not be found." };

  const supabase = await createClient();
  const invoiceRes = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .eq("client_id", clientId)
    .maybeSingle();
  if (invoiceRes.error) return safeDbError(invoiceRes.error, "The invoice could not be charged.");
  if (!invoiceRes.data) return { error: "That invoice could not be found." };
  if (invoiceRes.data.status === "paid") return { notice: "This invoice is already paid." };
  if (invoiceRes.data.status === "void") return { error: "This invoice was voided." };

  const charged = await chargeSavedMethod({
    clientId,
    amount: Number(invoiceRes.data.amount),
    description: invoiceRes.data.title,
    externalReference: `invoice_${invoiceId}`,
    paymentMethodId: invoiceRes.data.payment_method_id,
    periodLabel: invoiceRes.data.period_label,
    invoiceId,
    projectId: (invoiceRes.data.project_id as string | null | undefined) ?? null,
  });

  if (!charged.ok) {
    await supabase
      .from("invoices")
      .update({ status: "failed", mp_order_id: charged.orderId ?? null })
      .eq("id", invoiceId);
    revalidateInvoicePaths(clientId, invoiceId);
    return { error: charged.message };
  }

  await supabase
    .from("invoices")
    .update({
      status: charged.status === "processed" ? "paid" : "sent",
      sent_at: invoiceRes.data.sent_at ?? new Date().toISOString(),
      paid_at: charged.status === "processed" ? new Date().toISOString() : null,
      mp_order_id: charged.orderId,
      payment_id: charged.paymentId,
      payment_method_id: charged.methodId,
    })
    .eq("id", invoiceId);

  if (charged.paymentId) {
    await supabase.from("payments").update({ invoice_id: invoiceId }).eq("id", charged.paymentId);
  }

  revalidateInvoicePaths(clientId, invoiceId);
  return {
    notice:
      charged.status === "processed"
        ? "Card on file charged successfully."
        : "Charge submitted. Waiting on Mercado Pago confirmation.",
  };
}

export async function voidInvoice(clientId: string, invoiceId: string, _formData?: FormData) {
  const gate = await adminGate();
  if ("error" in gate || !isUuid(clientId) || !isUuid(invoiceId)) return;
  const supabase = await createClient();
  await supabase
    .from("invoices")
    .update({ status: "void" })
    .eq("id", invoiceId)
    .eq("client_id", clientId)
    .neq("status", "paid");
  revalidateInvoicePaths(clientId, invoiceId);
}

/** Mark a draft as sent (or resend an open invoice) and email the pay link. */
export async function sendInvoice(
  clientId: string,
  invoiceId: string,
  _formData?: FormData,
): Promise<ActionState> {
  const gate = await adminGate();
  if ("error" in gate) return gate;
  if (!isUuid(clientId) || !isUuid(invoiceId)) return { error: "That invoice could not be found." };

  const supabase = await createClient();
  const [invoiceRes, clientRes] = await Promise.all([
    supabase.from("invoices").select("*").eq("id", invoiceId).eq("client_id", clientId).maybeSingle(),
    supabase.from("clients").select("email, company_name").eq("id", clientId).maybeSingle(),
  ]);
  if (invoiceRes.error) return safeDbError(invoiceRes.error, "The invoice could not be sent.");
  if (!invoiceRes.data || !clientRes.data) return { error: "That invoice could not be found." };
  const invoice = invoiceRes.data;
  if (invoice.status === "paid") return { error: "This invoice is already paid." };
  if (invoice.status === "void") return { error: "This invoice was voided." };

  if (invoice.status === "draft" || !invoice.sent_at) {
    const updated = await supabase
      .from("invoices")
      .update({
        status: invoice.status === "draft" ? "sent" : invoice.status,
        sent_at: invoice.sent_at ?? new Date().toISOString(),
      })
      .eq("id", invoiceId);
    if (updated.error) return safeDbError(updated.error, "The invoice could not be sent.");
  }

  const mailed = await sendInvoiceEmail({
    to: clientRes.data.email,
    companyName: clientRes.data.company_name,
    invoiceNumber: invoice.number,
    title: invoice.title,
    amount: Number(invoice.amount),
    billingType: invoice.billing_type,
    portalUrl: `${siteOrigin()}/portal`,
    payUrl: payUrlFor(invoice.public_token),
    dueOn: invoice.due_on,
    charged: false,
  });

  revalidateInvoicePaths(clientId, invoiceId);
  return mailed.ok
    ? { notice: `Invoice ${invoice.number} emailed to ${clientRes.data.email}.` }
    : { error: `Invoice marked sent, but email failed: ${mailed.message}` };
}

const MANUAL_METHODS = ["Bank transfer", "Zelle", "Cash", "Check", "Wire", "Other"] as const;

/** Record an off-platform payment (bank transfer, Zelle, cash) and close the invoice. */
export async function markInvoicePaidManually(
  clientId: string,
  invoiceId: string,
  method: string,
  reference: string,
  paidOn?: string,
): Promise<ActionState> {
  const gate = await adminGate();
  if ("error" in gate) return gate;
  if (!isUuid(clientId) || !isUuid(invoiceId)) return { error: "That invoice could not be found." };

  const methodLabel = method.trim().slice(0, 40);
  if (!methodLabel) return { error: "Choose how the client paid." };
  const referenceLabel = reference.trim().slice(0, 120) || null;
  const paidDate = paidOn && /^\d{4}-\d{2}-\d{2}$/.test(paidOn) ? paidOn : todayISO();

  const supabase = await createClient();
  const invoiceRes = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .eq("client_id", clientId)
    .maybeSingle();
  if (invoiceRes.error) return safeDbError(invoiceRes.error, "The payment could not be recorded.");
  if (!invoiceRes.data) return { error: "That invoice could not be found." };
  const invoice = invoiceRes.data;
  if (invoice.status === "paid") return { notice: "This invoice is already paid." };
  if (invoice.status === "void") return { error: "This invoice was voided." };

  const inserted = await supabase
    .from("payments")
    .insert({
      client_id: clientId,
      invoice_id: invoiceId,
      ...(invoice.project_id ? { project_id: invoice.project_id } : {}),
      amount: Number(invoice.amount),
      currency: invoice.currency ?? "USD",
      status: "paid",
      paid_on: paidDate,
      period_label: invoice.period_label ?? null,
      method: methodLabel,
      reference: referenceLabel,
      notes: `Recorded manually for ${invoice.number}.`,
    })
    .select("id")
    .single();
  if (inserted.error || !inserted.data) {
    return safeDbError(inserted.error, "The payment could not be recorded.");
  }

  const updated = await supabase
    .from("invoices")
    .update({
      status: "paid",
      paid_at: new Date(`${paidDate}T12:00:00Z`).toISOString(),
      sent_at: invoice.sent_at ?? new Date().toISOString(),
      payment_id: inserted.data.id,
    })
    .eq("id", invoiceId);
  if (updated.error) return safeDbError(updated.error, "Payment saved, but the invoice was not updated.");

  revalidateInvoicePaths(clientId, invoiceId);
  return { notice: `Invoice ${invoice.number} marked paid (${methodLabel}).` };
}

/** Form wrapper for the "Mark paid" dialog. */
export async function markInvoicePaidManuallyForm(
  clientId: string,
  invoiceId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const method = String(formData.get("method") ?? "").trim();
  const other = String(formData.get("method_other") ?? "").trim();
  const label = method === "Other" ? other || "Other" : method;
  if (!(MANUAL_METHODS as readonly string[]).includes(method)) {
    return { error: "Choose how the client paid." };
  }
  return markInvoicePaidManually(
    clientId,
    invoiceId,
    label,
    String(formData.get("reference") ?? ""),
    String(formData.get("paid_on") ?? ""),
  );
}

/** Void that reports back, for the invoice detail page. */
export async function voidInvoiceWithResult(clientId: string, invoiceId: string): Promise<ActionState> {
  const gate = await adminGate();
  if ("error" in gate) return gate;
  if (!isUuid(clientId) || !isUuid(invoiceId)) return { error: "That invoice could not be found." };
  const supabase = await createClient();
  const updated = await supabase
    .from("invoices")
    .update({ status: "void" })
    .eq("id", invoiceId)
    .eq("client_id", clientId)
    .neq("status", "paid")
    .select("id");
  if (updated.error) return safeDbError(updated.error, "The invoice could not be voided.");
  revalidateInvoicePaths(clientId, invoiceId);
  if (!updated.data?.length) return { error: "Paid invoices cannot be voided." };
  return { notice: "Invoice voided. The pay link no longer accepts payments." };
}

export async function removePaymentMethod(
  clientId: string,
  methodId: string,
  _formData?: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const clientSession = await requireClient();
  const isAdmin = admin.kind === "ready";
  const isOwner =
    clientSession.kind === "ready" && clientSession.profile.client_id === clientId;
  if (!isAdmin && !isOwner) return { error: "You cannot change this payment method." };
  if (!isUuid(clientId) || !isUuid(methodId)) return { error: "That card could not be found." };

  const supabase = await createClient();
  const methodRes = await supabase
    .from("payment_methods")
    .select("*")
    .eq("id", methodId)
    .eq("client_id", clientId)
    .eq("status", "active")
    .maybeSingle();
  if (methodRes.error) return safeDbError(methodRes.error, "The card could not be removed.");
  if (!methodRes.data) return { error: "That card could not be found." };

  if (mpConfigured()) {
    await deleteCustomerCard({
      customerId: methodRes.data.mp_customer_id,
      cardId: methodRes.data.mp_card_id,
    });
  }

  const updated = await supabase
    .from("payment_methods")
    .update({ status: "removed", is_default: false })
    .eq("id", methodId)
    .eq("client_id", clientId);
  if (updated.error) return safeDbError(updated.error, "The card could not be removed.");

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/portal");
  return { notice: "Card removed." };
}

export async function savePortalPaymentMethod(input: {
  token: string;
  paymentMethodId: string;
  holderName?: string;
  identificationType?: "RFC" | "CURP";
  identificationNumber?: string;
}): Promise<ActionState> {
  const session = await requireClient();
  if (session.kind !== "ready" || !session.profile.client_id) {
    return { error: "Sign in to the client portal first." };
  }
  if (!mpConfigured()) {
    return { error: "Mercado Pago is not configured yet." };
  }
  if (!hasServiceRole()) {
    return { error: "Add SUPABASE_SERVICE_ROLE_KEY before saving cards on file." };
  }

  const token = input.token.trim();
  const paymentMethodId = input.paymentMethodId.trim();
  if (!/^[a-zA-Z0-9]{16,64}$/.test(token) || /^\d{13,19}$/.test(token)) {
    return { error: "The card could not be encrypted. Check the card fields and try again." };
  }
  if (!/^[a-z0-9_]{2,20}$/i.test(paymentMethodId)) {
    return { error: "That card brand is not supported." };
  }

  const clientId = session.profile.client_id;
  const admin = createAdminClient();
  const clientRes = await admin
    .from("clients")
    .select("id, email, contact_name, mp_customer_id, tax_id_type, tax_id_number")
    .eq("id", clientId)
    .maybeSingle();
  if (clientRes.error || !clientRes.data) {
    return { error: "Your company record could not be loaded." };
  }

  const [firstName, ...rest] = String(clientRes.data.contact_name ?? "").trim().split(/\s+/);
  const identificationType =
    input.identificationType ??
    ((clientRes.data.tax_id_type as "RFC" | "CURP" | null) || undefined);
  const identificationNumber =
    input.identificationNumber?.toUpperCase() ??
    (clientRes.data.tax_id_number as string | null) ??
    undefined;

  let customerId = clientRes.data.mp_customer_id as string | null;
  if (!customerId) {
    const created = await findOrCreateMpCustomer({
      email: clientRes.data.email,
      firstName: firstName || undefined,
      lastName: rest.join(" ") || undefined,
      identificationType,
      identificationNumber,
    });
    if (!created.ok) return { error: created.message };
    customerId = created.id;
    await admin.from("clients").update({ mp_customer_id: customerId }).eq("id", clientId);
  }

  if (identificationType && identificationNumber) {
    await admin
      .from("clients")
      .update({
        tax_id_type: identificationType,
        tax_id_number: identificationNumber,
      })
      .eq("id", clientId);
  }

  const saved = await saveCardToCustomer({ customerId, token });
  if (!saved.ok) return { error: saved.message };

  await admin
    .from("payment_methods")
    .update({ is_default: false })
    .eq("client_id", clientId)
    .eq("status", "active");

  const inserted = await admin.from("payment_methods").insert({
    client_id: clientId,
    mp_customer_id: customerId,
    mp_card_id: saved.card.id,
    brand: saved.card.brand ?? paymentMethodId,
    last_four: saved.card.lastFour,
    exp_month: saved.card.expMonth,
    exp_year: saved.card.expYear,
    holder_name: input.holderName?.trim() || saved.card.holderName,
    is_default: true,
    status: "active",
  });

  if (inserted.error) {
    return safeDbError(inserted.error, "The card was saved in Mercado Pago, but not in the CRM.");
  }

  revalidatePath("/portal");
  revalidatePath(`/admin/clients/${clientId}`);
  return { notice: "Card saved on file with Mercado Pago." };
}
