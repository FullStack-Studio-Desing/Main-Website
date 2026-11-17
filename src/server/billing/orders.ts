import { randomUUID } from "crypto";
import { amountToMp, type CheckoutPlan } from "@/server/billing/plans";

const MP_ORDERS = "https://api.mercadopago.com/v1/orders";

export type OrderOutcome =
  | {
      ok: true;
      status: "processed" | "pending";
      id: string;
      message: string;
      challengeUrl?: string;
    }
  | {
      ok: false;
      status: "rejected" | "error";
      message: string;
      id?: string;
    };

type CreateOrderInput = {
  plan: CheckoutPlan;
  token: string;
  paymentMethodId: string;
  email: string;
  identificationType: "RFC" | "CURP";
  identificationNumber: string;
  idempotencyKey: string;
};

const DETAIL_MESSAGES: Record<string, string> = {
  accredited: "Payment confirmed. We will follow up by email within one business day.",
  pending_waiting_payment: "The payment is pending. We will confirm it when Mercado Pago settles it.",
  pending_challenge: "Your bank needs an extra confirmation to finish this payment.",
  cc_rejected_insufficient_amount: "The card does not have enough funds.",
  cc_rejected_bad_filled_security_code: "The security code was declined. Check it and try again.",
  cc_rejected_bad_filled_date: "The expiration date was declined. Check it and try again.",
  cc_rejected_call_for_authorize: "The bank declined the payment. Call the bank or use another card.",
};

export function paymentTypeFor(methodId: string): "credit_card" | "debit_card" {
  return methodId.startsWith("deb") ? "debit_card" : "credit_card";
}

export async function createCardOrder(input: CreateOrderInput): Promise<OrderOutcome> {
  const accessToken = process.env.MP_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    return {
      ok: false,
      status: "error",
      message: "Payments are not configured yet. Add the Mercado Pago test credentials and try again.",
    };
  }

  const amount = amountToMp(input.plan.amount);
  const externalReference = `fssd_${input.plan.id}_${randomUUID()}`;

  let response: Response;
  try {
    response = await fetch(MP_ORDERS, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify({
        type: "online",
        processing_mode: "automatic",
        // No currency field exists on POST /v1/orders. Amount is the USD catalog
        // value (999.00 / 1500.00 / 2500.00) and is not converted to MXN.
        total_amount: amount,
        external_reference: externalReference,
        description: input.plan.reason,
        payer: {
          email: input.email,
          identification: {
            type: input.identificationType,
            number: input.identificationNumber,
          },
        },
        transactions: {
          payments: [
            {
              amount,
              payment_method: {
                id: input.paymentMethodId,
                type: paymentTypeFor(input.paymentMethodId),
                token: input.token,
                installments: 1,
              },
            },
          ],
        },
      }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    console.error("[mercadopago] order request failed", error instanceof Error ? error.message : "unknown");
    return {
      ok: false,
      status: "error",
      message: "Mercado Pago could not be reached. Try again in a moment.",
    };
  }

  const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  logOrderResult(response.status, payload);

  if (response.status === 429) {
    return {
      ok: false,
      status: "error",
      message: "Mercado Pago is busy. Wait a moment and try again.",
    };
  }

  if (!payload || typeof payload.status !== "string") {
    return {
      ok: false,
      status: "error",
      message: response.ok
        ? "Mercado Pago returned an unexpected response."
        : "Mercado Pago could not process this payment. Check the details and try again.",
    };
  }

  return interpretOrder(payload);
}

export function interpretOrder(payload: Record<string, unknown>): OrderOutcome {
  const id = typeof payload.id === "string" ? payload.id : undefined;
  const status = typeof payload.status === "string" ? payload.status : "";
  const detail = typeof payload.status_detail === "string" ? payload.status_detail : "";
  const payment = firstPayment(payload);
  const paymentDetail = typeof payment?.status_detail === "string" ? payment.status_detail : detail;
  const message =
    DETAIL_MESSAGES[paymentDetail] ??
    DETAIL_MESSAGES[detail] ??
    (status === "processed"
      ? DETAIL_MESSAGES.accredited
      : "The payment was not approved. Check the card details or try another card.");

  if (status === "processed") {
    return { ok: true, status: "processed", id: id ?? "", message };
  }

  if (status === "pending" || status === "action_required" || status === "created") {
    return {
      ok: true,
      status: "pending",
      id: id ?? "",
      message,
      challengeUrl: challengeUrl(payment),
    };
  }

  if (id) {
    return { ok: false, status: "rejected", id, message };
  }

  return { ok: false, status: "error", message };
}

function firstPayment(payload: Record<string, unknown>): Record<string, unknown> | undefined {
  const transactions = payload.transactions;
  if (!transactions || typeof transactions !== "object") return undefined;
  const payments = (transactions as { payments?: unknown }).payments;
  if (!Array.isArray(payments) || !payments[0] || typeof payments[0] !== "object") return undefined;
  return payments[0] as Record<string, unknown>;
}

function challengeUrl(payment: Record<string, unknown> | undefined): string | undefined {
  if (!payment) return undefined;
  const method = payment.payment_method;
  if (!method || typeof method !== "object") return undefined;
  const record = method as Record<string, unknown>;
  const threeDs = record.three_ds_info;
  const candidates = [
    record.challenge_url,
    record.three_ds_url,
    threeDs && typeof threeDs === "object" ? (threeDs as { external_resource_url?: unknown }).external_resource_url : undefined,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.startsWith("https://")) return candidate;
  }
  return undefined;
}

function logOrderResult(status: number, payload: Record<string, unknown> | null) {
  const codes = Array.isArray(payload?.errors)
    ? payload.errors
        .map((error) =>
          error && typeof error === "object" && "code" in error ? String((error as { code: unknown }).code) : ""
        )
        .filter(Boolean)
        .join(",")
    : "";
  console.info("[mercadopago] order response", {
    httpStatus: status,
    orderStatus: typeof payload?.status === "string" ? payload.status : undefined,
    codes: codes || undefined,
  });
}
