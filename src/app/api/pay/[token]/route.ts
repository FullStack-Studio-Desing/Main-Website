import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { isPayToken, payInvoiceByToken } from "@/server/billing/invoice-pay";

export const dynamic = "force-dynamic";

/**
 * Public invoice payment: POST { token, payment_method_id, idempotency_key }.
 * The receipt email is always the invoice's own; the payer cannot change it.
 * `token` in the body is the MP.js card token; the invoice token is the URL segment.
 * Amount and description always come from the invoice row on the server.
 */
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Light in-memory throttle per invoice link (per server instance).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, number[]>();

function throttled(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(key, recent);
    return true;
  }
  recent.push(now);
  attempts.set(key, recent);
  if (attempts.size > 5000) {
    for (const [entry, times] of attempts) {
      if (times.every((at) => now - at >= WINDOW_MS)) attempts.delete(entry);
    }
  }
  return false;
}

function fail(message: string, status: number) {
  return NextResponse.json({ ok: false, status: "error", message }, { status });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token: invoiceToken } = await params;
  if (!isPayToken(invoiceToken)) return fail("This invoice link is not valid.", 404);

  if (throttled(invoiceToken)) {
    return fail("Too many payment attempts. Wait a few minutes and try again.", 429);
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("The payment request was empty.", 400);
  const record = body as Record<string, unknown>;

  const cardToken = typeof record.token === "string" ? record.token.trim() : "";
  const paymentMethodId =
    typeof record.payment_method_id === "string" ? record.payment_method_id.trim() : "";

  if (!/^[a-zA-Z0-9]{16,64}$/.test(cardToken) || /^\d{13,19}$/.test(cardToken)) {
    return fail("The card could not be encrypted. Check the card fields and try again.", 400);
  }
  if (!/^[a-z0-9_]{2,20}$/i.test(paymentMethodId)) {
    return fail("That card brand is not supported.", 400);
  }

  const headerKey = request.headers.get("x-idempotency-key") ?? "";
  const bodyKey = typeof record.idempotency_key === "string" ? record.idempotency_key : "";
  const idempotencyKey = UUID.test(headerKey) ? headerKey : UUID.test(bodyKey) ? bodyKey : randomUUID();

  const result = await payInvoiceByToken({
    token: invoiceToken,
    cardToken,
    paymentMethodId,
    idempotencyKey,
  });

  const httpStatus = result.ok
    ? 200
    : result.status === "rejected"
      ? 402
      : result.status === "unavailable"
        ? 409
        : 400;
  return NextResponse.json(result, { status: httpStatus });
}
