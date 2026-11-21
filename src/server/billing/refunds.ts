import "server-only";
import { revalidatePath } from "next/cache";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { mpErrorMessage, mpFetch } from "@/server/billing/mp";
import { amountToMp } from "@/server/billing/plans";

export type MpRefund = { id: string; amount: number; status: string };

export type RefundOrderOutcome =
  | { ok: true; refunds: MpRefund[]; statusDetail: string }
  | { ok: false; message: string };

function firstPaymentId(order: Record<string, unknown>): string | null {
  const transactions = order.transactions as { payments?: Array<{ id?: unknown }> } | undefined;
  const id = transactions?.payments?.[0]?.id;
  return typeof id === "string" ? id : null;
}

/** Processed refunds listed on an order payload (GET /v1/orders/:id or the refund response). */
export function refundsFromOrder(order: Record<string, unknown>): MpRefund[] {
  const transactions = order.transactions as { refunds?: unknown } | undefined;
  const list = Array.isArray(transactions?.refunds) ? transactions.refunds : [];
  return list
    .map((item) => item as { id?: unknown; amount?: unknown; status?: unknown })
    .filter((item) => typeof item.id === "string")
    .map((item) => ({
      id: item.id as string,
      amount: Number(item.amount ?? 0),
      status: typeof item.status === "string" ? item.status : "",
    }))
    .filter((item) => Number.isFinite(item.amount) && item.amount > 0 && item.status !== "failed");
}

export function isRefundPayload(order: Record<string, unknown>) {
  const detail = typeof order.status_detail === "string" ? order.status_detail : "";
  return order.status === "refunded" || detail === "refunded" || detail === "partially_refunded";
}

/**
 * Refund a Mercado Pago order. Omit `amount` for a full refund.
 * `amount` is in the account currency (MXN), the same currency the card was charged in.
 * POST /v1/orders/:id/refund needs the order's payment transaction id.
 */
export async function refundMpOrder(input: {
  orderId: string;
  amount: number | null;
  idempotencyKey: string;
}): Promise<RefundOrderOutcome> {
  const order = await mpFetch(`/v1/orders/${encodeURIComponent(input.orderId)}`);
  if (!order.ok || !order.payload) {
    return { ok: false, message: mpErrorMessage(order.payload, "The Mercado Pago order could not be loaded.") };
  }
  const paymentId = firstPaymentId(order.payload);
  if (!paymentId) return { ok: false, message: "That Mercado Pago order has no payment to refund." };

  const transaction: Record<string, string> = { id: paymentId };
  if (input.amount !== null) transaction.amount = amountToMp(input.amount);

  const refund = await mpFetch(`/v1/orders/${encodeURIComponent(input.orderId)}/refund`, {
    method: "POST",
    body: { transactions: [transaction] },
    idempotencyKey: input.idempotencyKey,
  });
  console.info("[mercadopago] refund response", { httpStatus: refund.status });
  if (!refund.ok || !refund.payload) {
    return { ok: false, message: mpErrorMessage(refund.payload, "Mercado Pago did not accept the refund.") };
  }
  return {
    ok: true,
    refunds: refundsFromOrder(refund.payload),
    statusDetail: typeof refund.payload.status_detail === "string" ? refund.payload.status_detail : "",
  };
}

export type RefundablePayment = {
  id: string;
  client_id: string;
  invoice_id: string | null;
  amount: number | string;
  currency: string;
  refunded_amount: number | string | null;
  charge_amount?: number | string | null;
  fx_rate?: number | string | null;
};

type RefundEntry = {
  /** USD, like every CRM amount. */
  amount: number;
  /** What went back to the card, in the account currency, when it was charged through MP. */
  chargeAmount?: number | null;
  mpRefundId: string | null;
  source: "crm" | "mercadopago" | "manual";
};

/** MP refunds are in the charged currency; convert back to USD at the payment's original rate. */
export function refundEntriesFromMp(
  payment: RefundablePayment,
  refunds: MpRefund[],
  source: "crm" | "mercadopago",
): RefundEntry[] {
  const rate = Number(payment.fx_rate) || 1;
  return refunds.map((refund) => ({
    amount: Math.round((refund.amount / rate) * 100) / 100,
    chargeAmount: payment.fx_rate ? refund.amount : null,
    mpRefundId: refund.id,
    source,
  }));
}

/**
 * Write refunds into the CRM: log rows (one per MP refund id), the payment's refunded total
 * and status, and the linked invoice's status. Used by the admin action and the webhook.
 */
export async function recordRefunds(input: {
  payment: RefundablePayment;
  refunds: RefundEntry[];
  reason: string | null;
  createdBy: string | null;
}) {
  const admin = createAdminClient();
  for (const refund of input.refunds) {
    const inserted = await admin.from("payment_refunds").insert({
      payment_id: input.payment.id,
      client_id: input.payment.client_id,
      invoice_id: input.payment.invoice_id,
      amount: refund.amount,
      charge_amount: refund.chargeAmount ?? null,
      currency: input.payment.currency,
      reason: input.reason,
      source: refund.source,
      mp_refund_id: refund.mpRefundId,
      created_by: input.createdBy,
    });
    // 23505 = this MP refund is already logged (webhook and action raced); that's fine.
    if (inserted.error && inserted.error.code !== "23505") {
      console.error("[refunds] log insert failed", inserted.error.message);
    }
  }

  const logged = await admin
    .from("payment_refunds")
    .select("amount, charge_amount")
    .eq("payment_id", input.payment.id);
  const rows = logged.data ?? [];
  const amount = Number(input.payment.amount);
  const charged = Number(input.payment.charge_amount) || 0;
  // Converted payments are "fully refunded" when the charged currency is fully returned,
  // so cent rounding in the USD conversion never leaves a phantom balance.
  const fully = charged
    ? rows.reduce((sum, row) => sum + Number(row.charge_amount ?? 0), 0) >= charged - 0.009
    : rows.reduce((sum, row) => sum + Number(row.amount), 0) >= amount - 0.009;
  const total = fully ? amount : Math.min(amount, rows.reduce((sum, row) => sum + Number(row.amount), 0));

  await admin
    .from("payments")
    .update({
      refunded_amount: Number(total.toFixed(2)),
      status: total <= 0 ? "paid" : fully ? "refunded" : "partially_refunded",
    })
    .eq("id", input.payment.id);

  if (input.payment.invoice_id && total > 0) {
    await admin
      .from("invoices")
      .update({ status: fully ? "refunded" : "partially_refunded" })
      .eq("id", input.payment.invoice_id)
      .in("status", ["paid", "partially_refunded"]);
  }

  try {
    revalidatePath("/admin/payments");
    revalidatePath("/admin/invoices");
    if (input.payment.invoice_id) revalidatePath(`/admin/invoices/${input.payment.invoice_id}`);
    revalidatePath(`/admin/clients/${input.payment.client_id}`);
    revalidatePath("/portal");
  } catch {
    // revalidatePath throws outside a request scope (webhook); pages are dynamic anyway.
  }
  return { total, fully };
}

/** Webhook entry: sync refunds made anywhere (CRM or MP dashboard) for an order we recorded. */
export async function syncRefundsFromOrder(order: Record<string, unknown>) {
  if (!hasServiceRole() || typeof order.id !== "string") return;
  const refunds = refundsFromOrder(order);
  if (!refunds.length) return;

  const admin = createAdminClient();
  const payment = await admin
    .from("payments")
    .select("id, client_id, invoice_id, amount, currency, refunded_amount, charge_amount, fx_rate")
    .eq("mp_order_id", order.id)
    .maybeSingle();
  if (!payment.data) return;

  await recordRefunds({
    payment: payment.data as RefundablePayment,
    refunds: refundEntriesFromMp(payment.data as RefundablePayment, refunds, "mercadopago"),
    reason: null,
    createdBy: null,
  });
}
