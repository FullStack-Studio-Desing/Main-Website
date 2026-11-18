import { NextRequest, NextResponse } from "next/server";
import { savePortalPaymentMethod } from "@/lib/portal/billing-actions";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "The request was empty." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const result = await savePortalPaymentMethod({
    token: typeof record.token === "string" ? record.token : "",
    paymentMethodId: typeof record.paymentMethodId === "string" ? record.paymentMethodId : "",
    holderName: typeof record.holderName === "string" ? record.holderName : undefined,
    identificationType:
      record.identificationType === "RFC" || record.identificationType === "CURP"
        ? record.identificationType
        : undefined,
    identificationNumber:
      typeof record.identificationNumber === "string" ? record.identificationNumber : undefined,
  });

  if (result?.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, notice: result?.notice ?? "Card saved." });
}
