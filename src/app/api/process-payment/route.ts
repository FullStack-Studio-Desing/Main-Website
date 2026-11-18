import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { notifyPaidOrder } from "@/server/billing/notify";
import { createCardOrder } from "@/server/billing/orders";
import { resolvePayer } from "@/server/billing/payer";
import { formatUsd, getCheckoutPlan } from "@/server/billing/plans";

export const dynamic = "force-dynamic";

/**
 * Card form: POST { planId, email, token, paymentMethodId }.
 * Amount comes from the server catalog. If email is omitted,
 * MP_PAYER_EMAIL is used as a fallback. RFC/CURP are optional (US payers skip them).
 */
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, status: "error", message: "The payment request was empty." },
      { status: 400 }
    );
  }

  const record = body as Record<string, unknown>;
  const plan = typeof record.planId === "string" ? getCheckoutPlan(record.planId) : undefined;
  if (!plan) {
    return NextResponse.json(
      { ok: false, status: "error", message: "That plan is not available." },
      { status: 400 }
    );
  }

  const token = typeof record.token === "string" ? record.token.trim() : "";
  const paymentMethodId =
    typeof record.paymentMethodId === "string" ? record.paymentMethodId.trim() : "";

  if (!/^[a-zA-Z0-9]{16,64}$/.test(token) || /^\d{13,19}$/.test(token)) {
    return NextResponse.json(
      { ok: false, status: "error", message: "The card could not be encrypted. Check the card fields and try again." },
      { status: 400 }
    );
  }
  if (!/^[a-z0-9_]{2,20}$/i.test(paymentMethodId)) {
    return NextResponse.json(
      { ok: false, status: "error", message: "That card brand is not supported." },
      { status: 400 }
    );
  }

  const payer = resolvePayer({
    email: record.email,
    identificationType: record.identificationType,
    identificationNumber: record.identificationNumber,
  });
  if (!payer.ok) {
    return NextResponse.json({ ok: false, status: "error", message: payer.message }, { status: 400 });
  }

  const idempotencyKey =
    typeof record.idempotencyKey === "string" && UUID.test(record.idempotencyKey)
      ? record.idempotencyKey
      : randomUUID();

  const outcome = await createCardOrder({
    plan,
    token,
    paymentMethodId,
    email: payer.payer.email,
    identificationType: payer.payer.identificationType,
    identificationNumber: payer.payer.identificationNumber,
    idempotencyKey,
  });

  if (outcome.ok && outcome.status === "processed" && outcome.id) {
    await notifyPaidOrder({
      orderId: outcome.id,
      planName: plan.name,
      amountLabel: formatUsd(plan.amount),
      email: payer.payer.email,
      status: outcome.status,
    });
  }

  return NextResponse.json(outcome, { status: outcome.ok ? 200 : outcome.status === "rejected" ? 402 : 400 });
}
