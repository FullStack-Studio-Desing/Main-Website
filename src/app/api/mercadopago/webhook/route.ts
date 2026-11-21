import { NextRequest, NextResponse } from "next/server";
import { markInvoiceFromOrder } from "@/server/billing/invoice-pay";
import { notifyPaidOrder } from "@/server/billing/notify";
import { interpretOrder } from "@/server/billing/orders";
import { formatUsd, getCheckoutPlan } from "@/server/billing/plans";
import { isRefundPayload, syncRefundsFromOrder } from "@/server/billing/refunds";
import { verifyMpSignature } from "@/server/billing/webhook";

export const dynamic = "force-dynamic";

const seen = new Set<string>();

export async function POST(request: NextRequest) {
  const secret = process.env.MP_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[mercadopago] MP_WEBHOOK_SECRET is not configured");
    return new NextResponse(null, { status: 503 });
  }

  const dataId = new URL(request.url).searchParams.get("data.id");
  const valid = verifyMpSignature({
    xSignature: request.headers.get("x-signature"),
    xRequestId: request.headers.get("x-request-id"),
    dataId,
    secret,
  });
  if (!valid || !dataId) return new NextResponse(null, { status: 401 });

  const body = (await request.json().catch(() => null)) as { type?: string; action?: string } | null;
  const topic = body?.type ?? body?.action ?? "order";
  // Include the action so a later order.processed is not swallowed after order.action_required.
  const dedupeKey = `${topic}:${body?.action ?? ""}:${dataId}`;
  if (seen.has(dedupeKey)) return new NextResponse(null, { status: 200 });
  seen.add(dedupeKey);

  if (topic === "order" || topic.startsWith("order.")) {
    await reconcileOrder(dataId);
  }

  return new NextResponse(null, { status: 200 });
}

async function reconcileOrder(orderId: string) {
  const accessToken = process.env.MP_ACCESS_TOKEN?.trim();
  if (!accessToken) return;

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/orders/${encodeURIComponent(orderId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(15_000),
    });
    const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    if (!response.ok || !payload) {
      console.error("[mercadopago] webhook reconcile failed", response.status);
      return;
    }

    // Refunds (from the CRM or the Mercado Pago dashboard) sync onto the recorded payment.
    if (isRefundPayload(payload)) {
      await syncRefundsFromOrder(payload);
      return;
    }

    const reference = typeof payload.external_reference === "string" ? payload.external_reference : "";

    // CRM invoices (pay links and card-on-file charges) reconcile every status change.
    if (reference.startsWith("invoice_")) {
      await markInvoiceFromOrder(payload);
      return;
    }

    const outcome = interpretOrder(payload);
    if (!outcome.ok || outcome.status !== "processed" || !outcome.id) return;

    const planId = reference.split("_")[1] ?? "";
    const plan = getCheckoutPlan(planId);
    const payer = payload.payer;
    const email =
      payer && typeof payer === "object" && typeof (payer as { email?: unknown }).email === "string"
        ? (payer as { email: string }).email
        : "";

    await notifyPaidOrder({
      orderId: outcome.id,
      planName: plan?.name ?? (planId || "Unknown plan"),
      amountLabel: plan ? formatUsd(plan.amount) : String(payload.total_amount ?? ""),
      email,
      status: outcome.status,
    });
  } catch (error) {
    console.error("[mercadopago] webhook reconcile error", error instanceof Error ? error.message : "unknown");
  }
}
