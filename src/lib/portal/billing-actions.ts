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
      created_by: gate.userId,
    })
    .select("id")
    .single();

  if (insert.error || !insert.data) {
    return safeDbError(insert.error, "The invoice could not be saved.");
  }

  const invoiceId = insert.data.id as string;
  let notice = `Invoice ${number} saved as a draft.`;

  if (parsed.value.charge_now) {
    const charged = await chargeSavedMethod({
      clientId,
      amount: parsed.value.amount,
      description: parsed.value.title,
      externalReference: `invoice_${invoiceId}`,
      paymentMethodId: parsed.value.payment_method_id,
      periodLabel: parsed.value.period_label,
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

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/invoices");
  revalidatePath("/admin/payments");
  revalidatePath("/portal");
  redirect(`/admin/clients/${clientId}#invoices`);
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
  });

  if (!charged.ok) {
    await supabase
      .from("invoices")
      .update({ status: "failed", mp_order_id: charged.orderId ?? null })
      .eq("id", invoiceId);
    revalidatePath(`/admin/clients/${clientId}`);
    revalidatePath("/admin/invoices");
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

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/invoices");
  revalidatePath("/admin/payments");
  revalidatePath("/portal");
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
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/invoices");
  revalidatePath("/portal");
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
