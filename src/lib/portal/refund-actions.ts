"use server";

import { randomUUID } from "crypto";
import { hasServiceRole } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSchemaError } from "@/lib/portal/errors";
import { requireAdmin } from "@/lib/portal/session";
import type { ActionState } from "@/lib/portal/types";
import { isUuid } from "@/lib/portal/validators";
import { mpConfigured, mpFetch } from "@/server/billing/mp";
import { roundMoney } from "@/server/billing/fx";
import { recordRefunds, refundEntriesFromMp, refundMpOrder, refundsFromOrder } from "@/server/billing/refunds";

/**
 * Refund all or part of a payment. Mercado Pago payments are refunded to the card through
 * the Orders API; anything else is recorded as a refund made outside the CRM.
 */
export async function refundPayment(
  paymentId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin();
  if (session.kind !== "ready") return { error: "Only an admin can issue refunds." };
  if (!isUuid(paymentId)) return { error: "That payment could not be found." };
  if (!hasServiceRole()) return { error: "Add SUPABASE_SERVICE_ROLE_KEY before issuing refunds." };

  const supabase = await createClient();
  const paymentRes = await supabase
    .from("payments")
    .select("id, client_id, invoice_id, amount, currency, status, mp_order_id, refunded_amount, charge_amount, fx_rate")
    .eq("id", paymentId)
    .maybeSingle();
  if (paymentRes.error) {
    console.error("[refunds]", paymentRes.error.message);
    return {
      error: isSchemaError(paymentRes.error)
        ? "Run the refunds SQL migration, then try again."
        : "The payment could not be loaded.",
    };
  }
  const payment = paymentRes.data;
  if (!payment) return { error: "That payment could not be found." };
  if (payment.status !== "paid" && payment.status !== "partially_refunded") {
    return { error: "Only paid payments can be refunded." };
  }

  const amount = Number(payment.amount);
  const alreadyRefunded = Number(payment.refunded_amount ?? 0);
  const remaining = Number((amount - alreadyRefunded).toFixed(2));
  if (remaining <= 0) return { error: "This payment is already fully refunded." };

  const mode = String(formData.get("mode") ?? "full");
  const requested =
    mode === "partial" ? Number(String(formData.get("amount") ?? "").replace(/[$,\s]/g, "")) : remaining;
  if (!Number.isFinite(requested) || requested <= 0) return { error: "Enter a refund amount above zero." };
  const refundAmount = Number(requested.toFixed(2));
  if (refundAmount > remaining) {
    return { error: `You can refund at most ${remaining.toFixed(2)} on this payment.` };
  }
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 1000) || null;

  if (payment.mp_order_id) {
    if (!mpConfigured()) return { error: "Mercado Pago is not configured, so the card cannot be refunded." };

    // A full refund of an untouched payment omits the amount; anything else is partial.
    const isFull = alreadyRefunded === 0 && refundAmount === amount;
    // The card was charged in the account currency (MXN) at the payment's original rate,
    // so refund the same share of what was charged, never at today's rate.
    let chargeRefund = refundAmount;
    const charged = Number(payment.charge_amount) || 0;
    if (charged && payment.fx_rate) {
      const log = await supabase.from("payment_refunds").select("charge_amount").eq("payment_id", payment.id);
      const returned = (log.data ?? []).reduce((sum, row) => sum + Number(row.charge_amount ?? 0), 0);
      const chargeRemaining = roundMoney(charged - returned);
      chargeRefund =
        refundAmount >= remaining
          ? chargeRemaining
          : Math.min(chargeRemaining, roundMoney(refundAmount * Number(payment.fx_rate)));
    }
    const outcome = await refundMpOrder({
      orderId: payment.mp_order_id,
      amount: isFull ? null : chargeRefund,
      idempotencyKey: randomUUID(),
    });
    if (!outcome.ok) return { error: outcome.message };

    // Prefer MP's own refund ids so the webhook never double-counts this refund.
    let refunds = outcome.refunds;
    if (!refunds.length) {
      const order = await mpFetch(`/v1/orders/${encodeURIComponent(payment.mp_order_id)}`);
      refunds = order.payload ? refundsFromOrder(order.payload) : [];
    }
    const { fully } = await recordRefunds({
      payment,
      refunds: refunds.length
        ? refundEntriesFromMp(payment, refunds, "crm")
        : [{ amount: refundAmount, chargeAmount: charged ? chargeRefund : null, mpRefundId: null, source: "crm" }],
      reason,
      createdBy: session.userId,
    });
    return {
      notice: fully
        ? "Refunded in full. Mercado Pago is returning the money to the card."
        : `Refunded ${refundAmount.toFixed(2)}. Mercado Pago is returning it to the card.`,
    };
  }

  const { fully } = await recordRefunds({
    payment,
    refunds: [{ amount: refundAmount, mpRefundId: null, source: "manual" }],
    reason,
    createdBy: session.userId,
  });
  return {
    notice: fully
      ? "Refund recorded. Send the money back the same way it was paid."
      : `Partial refund of ${refundAmount.toFixed(2)} recorded. Send it back the same way it was paid.`,
  };
}
