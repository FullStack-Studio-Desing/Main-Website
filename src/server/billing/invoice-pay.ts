import "server-only";
import { revalidatePath } from "next/cache";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { todayISO } from "@/lib/portal/format";
import type { InvoiceBillingType, InvoiceStatus } from "@/lib/portal/types";
import { notifyPaidOrder } from "@/server/billing/notify";
import { createCardCharge, interpretOrder, type OrderOutcome } from "@/server/billing/orders";
import { accountCurrency } from "@/server/billing/fx";
import { formatUsd } from "@/server/billing/plans";

/** Tokens are 18 random bytes as hex (36 chars); accept 32–64 to be safe. */
const TOKEN_RE = /^[a-f0-9]{32,64}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isPayToken(value: unknown): value is string {
  return typeof value === "string" && TOKEN_RE.test(value);
}

/** What the public pay page is allowed to see. No internal ids. */
export type PublicInvoice = {
  number: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  billingType: InvoiceBillingType;
  status: InvoiceStatus;
  dueOn: string | null;
  periodLabel: string | null;
  issuedOn: string;
  paidAt: string | null;
  companyName: string;
  contactName: string | null;
  email: string;
  payable: boolean;
};

type InvoiceRow = {
  id: string;
  client_id: string;
  project_id: string | null;
  payment_id: string | null;
  number: string;
  title: string;
  description: string | null;
  amount: number | string;
  currency: string;
  billing_type: string;
  status: string;
  period_label: string | null;
  due_on: string | null;
  mp_order_id: string | null;
  public_token: string;
  sent_at: string | null;
  paid_at: string | null;
  created_at: string;
};

type ClientRow = {
  company_name: string;
  contact_name: string | null;
  email: string;
  tax_id_type: string | null;
  tax_id_number: string | null;
};

const INVOICE_COLUMNS =
  "id, client_id, project_id, payment_id, number, title, description, amount, currency, billing_type, status, period_label, due_on, mp_order_id, public_token, sent_at, paid_at, created_at";

export function isPayableStatus(status: string) {
  return status === "sent" || status === "failed";
}

/** Paid, or paid and then (partly) refunded: never moved back by a late order event. */
function isSettledStatus(status: string) {
  return status === "paid" || status === "refunded" || status === "partially_refunded";
}

async function loadRow(
  column: "public_token" | "id",
  value: string,
): Promise<{ invoice: InvoiceRow; client: ClientRow } | null> {
  if (!hasServiceRole()) return null;
  const admin = createAdminClient();
  const invoiceRes = await admin.from("invoices").select(INVOICE_COLUMNS).eq(column, value).maybeSingle();
  if (invoiceRes.error) {
    console.error("[invoice-pay] invoice read failed", invoiceRes.error.message);
    return null;
  }
  if (!invoiceRes.data) return null;
  const invoice = invoiceRes.data as InvoiceRow;
  const clientRes = await admin
    .from("clients")
    .select("company_name, contact_name, email, tax_id_type, tax_id_number")
    .eq("id", invoice.client_id)
    .maybeSingle();
  if (clientRes.error || !clientRes.data) return null;
  return { invoice, client: clientRes.data as ClientRow };
}

export async function loadInvoiceByToken(token: string): Promise<PublicInvoice | null> {
  if (!isPayToken(token)) return null;
  const loaded = await loadRow("public_token", token);
  if (!loaded) return null;
  const { invoice, client } = loaded;
  return {
    number: invoice.number,
    title: invoice.title,
    description: invoice.description,
    amount: Number(invoice.amount),
    currency: invoice.currency,
    billingType: invoice.billing_type as InvoiceBillingType,
    status: invoice.status as InvoiceStatus,
    dueOn: invoice.due_on,
    periodLabel: invoice.period_label,
    issuedOn: invoice.sent_at ?? invoice.created_at,
    paidAt: invoice.paid_at,
    companyName: client.company_name,
    contactName: client.contact_name,
    email: client.email,
    payable: isPayableStatus(invoice.status),
  };
}

export type PayResult =
  | { ok: true; status: "processed" | "pending"; message: string; challengeUrl?: string }
  | { ok: false; status: "rejected" | "error" | "unavailable"; message: string };

export async function payInvoiceByToken(input: {
  token: string;
  cardToken: string;
  paymentMethodId: string;
  idempotencyKey: string;
}): Promise<PayResult> {
  if (!isPayToken(input.token)) {
    return { ok: false, status: "unavailable", message: "This invoice link is not valid." };
  }
  const loaded = await loadRow("public_token", input.token);
  if (!loaded) {
    return { ok: false, status: "unavailable", message: "This invoice could not be found." };
  }
  const { invoice, client } = loaded;

  if (isSettledStatus(invoice.status)) {
    return { ok: true, status: "processed", message: "This invoice is already paid. Thank you." };
  }
  if (!isPayableStatus(invoice.status)) {
    return { ok: false, status: "unavailable", message: "This invoice is not open for payment." };
  }

  // A charge still waiting on 3DS or settlement blocks a second one for 30 minutes,
  // so a payer who reopens the link cannot be charged twice.
  const pending = await createAdminClient()
    .from("payments")
    .select("id")
    .eq("invoice_id", invoice.id)
    .eq("status", "pending")
    .gte("created_at", new Date(Date.now() - 30 * 60 * 1000).toISOString())
    .limit(1)
    .maybeSingle();
  if (pending.data) {
    return {
      ok: false,
      status: "unavailable",
      message: "A payment for this invoice is still being confirmed. Check back in a few minutes.",
    };
  }

  // Amount always comes from the database, never from the browser.
  const amount = Number(invoice.amount);
  const taxType = client.tax_id_type === "RFC" || client.tax_id_type === "CURP" ? client.tax_id_type : null;
  const outcome = await createCardCharge({
    amount,
    description: `${invoice.number} · ${invoice.title}`.slice(0, 200),
    externalReference: `invoice_${invoice.id}`,
    token: input.cardToken,
    paymentMethodId: input.paymentMethodId,
    // Receipts always go to the address the invoice was sent to.
    email: client.email,
    identificationType: taxType,
    identificationNumber: taxType ? client.tax_id_number : null,
    idempotencyKey: input.idempotencyKey,
  });

  await applyOrderToInvoice(invoice, outcome, client.email);

  if (outcome.ok) {
    return {
      ok: true,
      status: outcome.status,
      message:
        outcome.status === "processed"
          ? "Payment confirmed. A receipt is on its way to your inbox."
          : outcome.message,
      challengeUrl: outcome.challengeUrl,
    };
  }
  return { ok: false, status: outcome.status, message: outcome.message };
}

/**
 * Webhook entry point: given a full order payload from GET /v1/orders/:id,
 * reconcile the linked invoice when external_reference is `invoice_<uuid>`.
 */
export async function markInvoiceFromOrder(
  payload: Record<string, unknown>,
): Promise<{ handled: boolean }> {
  const reference = typeof payload.external_reference === "string" ? payload.external_reference : "";
  if (!reference.startsWith("invoice_")) return { handled: false };
  const invoiceId = reference.slice("invoice_".length);
  if (!UUID_RE.test(invoiceId)) return { handled: false };

  const loaded = await loadRow("id", invoiceId);
  if (!loaded) {
    console.error("[invoice-pay] webhook invoice not found");
    return { handled: true };
  }

  // total_amount is in the account currency (MXN); the invoice amount is USD.
  const total = Number(payload.total_amount);
  const outcome = { ...interpretOrder(payload), orderTotal: Number.isFinite(total) ? total : undefined };
  const payer = payload.payer;
  const email =
    payer && typeof payer === "object" && typeof (payer as { email?: unknown }).email === "string"
      ? (payer as { email: string }).email
      : loaded.client.email;

  await applyOrderToInvoice(loaded.invoice, outcome, email);
  return { handled: true };
}

/**
 * Record the order in the payments ledger and move the invoice forward.
 * Idempotent per mp_order_id: an existing payment row is updated, never duplicated.
 * A paid invoice is never downgraded.
 */
async function applyOrderToInvoice(
  invoice: InvoiceRow,
  outcome: OrderOutcome & { orderTotal?: number },
  payerEmail: string,
) {
  const admin = createAdminClient();
  const orderId = outcome.id || null;
  const now = new Date().toISOString();

  if (!outcome.ok) {
    // Network or validation errors never reached the card network; leave the invoice alone.
    if (!orderId) return;
    await admin
      .from("payments")
      .update({ status: "failed", notes: outcome.message })
      .eq("mp_order_id", orderId)
      .eq("status", "pending");
    if (!isSettledStatus(invoice.status) && invoice.status !== "void") {
      await admin
        .from("invoices")
        .update({ status: "failed", mp_order_id: orderId ?? invoice.mp_order_id })
        .eq("id", invoice.id)
        .not("status", "in", "(paid,refunded,partially_refunded)");
    }
    revalidateInvoice(invoice);
    return;
  }

  // Without an order id there is nothing to reconcile later; leave the invoice as-is.
  if (!orderId) return;

  const processed = outcome.status === "processed";
  const existing = await admin
    .from("payments")
    .select("id, status")
    .eq("mp_order_id", orderId)
    .limit(1)
    .maybeSingle();

  let paymentId = (existing.data?.id as string | undefined) ?? null;
  if (paymentId) {
    if (processed && (existing.data?.status === "pending" || existing.data?.status === "failed")) {
      await admin
        .from("payments")
        .update({ status: "paid", paid_on: todayISO(), notes: outcome.message, invoice_id: invoice.id })
        .eq("id", paymentId);
    }
  } else {
    const inserted = await admin
      .from("payments")
      .insert({
        client_id: invoice.client_id,
        invoice_id: invoice.id,
        project_id: invoice.project_id,
        amount: Number(invoice.amount),
        currency: invoice.currency,
        status: processed ? "paid" : "pending",
        paid_on: processed ? todayISO() : null,
        period_label: invoice.period_label,
        method: "Mercado Pago",
        reference: orderId.slice(0, 120),
        ...chargeColumns(outcome, invoice),
        notes: `${outcome.message} Payer: ${payerEmail}`.slice(0, 4000),
        mp_order_id: orderId,
      })
      .select("id")
      .single();
    if (inserted.error) {
      console.error("[invoice-pay] payment insert failed", inserted.error.message);
    }
    paymentId = (inserted.data?.id as string | undefined) ?? null;
  }

  if (!isSettledStatus(invoice.status)) {
    await admin
      .from("invoices")
      .update({
        status: processed ? "paid" : invoice.status === "failed" ? "sent" : invoice.status,
        paid_at: processed ? now : null,
        sent_at: invoice.sent_at ?? now,
        mp_order_id: orderId,
        ...(paymentId ? { payment_id: paymentId } : {}),
      })
      .eq("id", invoice.id)
      .not("status", "in", "(paid,refunded,partially_refunded)");
  }

  // Only the first confirmation notifies; a webhook replay for a settled invoice stays quiet.
  if (processed && !isSettledStatus(invoice.status)) {
    await notifyPaidOrder({
      orderId,
      planName: `Invoice ${invoice.number} (${invoice.title})`,
      amountLabel: formatUsd(Number(invoice.amount)),
      email: payerEmail,
      status: outcome.status,
    });
  }

  revalidateInvoice(invoice);
}

/** What the card was charged: from our own charge, or derived from the order total (webhook). */
function chargeColumns(outcome: OrderOutcome & { orderTotal?: number }, invoice: InvoiceRow) {
  if (outcome.charge) {
    return {
      charge_currency: outcome.charge.currency,
      charge_amount: outcome.charge.amount,
      fx_rate: outcome.charge.rate,
    };
  }
  const total = outcome.orderTotal;
  const usd = Number(invoice.amount);
  if (!total || !Number.isFinite(total) || !usd) return {};
  return {
    charge_currency: accountCurrency(),
    charge_amount: total,
    fx_rate: Number((total / usd).toFixed(6)),
  };
}

function revalidateInvoice(invoice: InvoiceRow) {
  try {
    revalidatePath("/admin/invoices");
    revalidatePath(`/admin/invoices/${invoice.id}`);
    revalidatePath(`/admin/clients/${invoice.client_id}`);
    revalidatePath("/admin/payments");
    revalidatePath("/portal");
    revalidatePath(`/pay/${invoice.public_token}`);
  } catch {
    // revalidatePath throws outside a request scope; the pages are dynamic anyway.
  }
}
