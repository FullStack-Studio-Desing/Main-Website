"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Field } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { checkoutPlans, formatUsd } from "@/server/billing/plans";

type MpInstance = {
  createCardToken: (fields: Record<string, string>) => Promise<{ id: string }>;
  getPaymentMethods: (opts: {
    bin: string;
  }) => Promise<{ results?: Array<{ id?: string }> }>;
};

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: { locale?: string }) => MpInstance;
  }
}

/**
 * MP.js (MX account) still wants an ID to mint a card token.
 * Never shown to the payer — US clients are charged with email only.
 */
const TOKEN_PLACEHOLDER_ID = {
  identificationType: "RFC",
  identificationNumber: "XAXX010101000",
};

function loadMpSdk() {
  return new Promise<void>((resolve, reject) => {
    if (window.MercadoPago) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>('script[data-mp-sdk="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Mercado Pago SDK failed to load.")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.dataset.mpSdk = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Mercado Pago SDK failed to load."));
    document.body.appendChild(script);
  });
}

const plans = Object.values(checkoutPlans);

export function CheckoutForm() {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [planId, setPlanId] = useState<(typeof plans)[number]["id"]>("starter");

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === planId) ?? plans[0],
    [planId]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/mp-config");
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.publicKey) {
          throw new Error(payload?.error ?? "Mercado Pago is not configured.");
        }
        await loadMpSdk();
        if (!cancelled) setPublicKey(String(payload.publicKey));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Mercado Pago is not configured.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ready = Boolean(publicKey);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (!publicKey || !window.MercadoPago) {
      setError("Mercado Pago is still loading. Try again in a moment.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const cardNumber = String(form.get("cardNumber") ?? "").replace(/\s+/g, "");
    const holderName = String(form.get("holderName") ?? "").trim();
    const expMonth = String(form.get("expMonth") ?? "").trim();
    const expYear = String(form.get("expYear") ?? "").trim();
    const securityCode = String(form.get("securityCode") ?? "").trim();

    if (!cardNumber || !holderName || !expMonth || !expYear || !securityCode) {
      setError("Fill every card field.");
      return;
    }

    setBusy(true);
    try {
      await loadMpSdk();
      const mp = new window.MercadoPago!(publicKey, { locale: "es-MX" });
      const methods = await mp.getPaymentMethods({ bin: cardNumber.slice(0, 6) });
      const paymentMethodId = methods.results?.[0]?.id;
      if (!paymentMethodId) {
        setError("That card brand is not supported.");
        return;
      }

      const token = await mp.createCardToken({
        cardNumber,
        cardholderName: holderName,
        cardExpirationMonth: expMonth,
        cardExpirationYear: expYear.length === 2 ? `20${expYear}` : expYear,
        securityCode,
        ...TOKEN_PLACEHOLDER_ID,
      });

      // Payer email from MP_PAYER_EMAIL — no RFC for US clients.
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          token: token.id,
          paymentMethodId,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok) {
        setError(payload?.message ?? "Payment failed.");
        return;
      }
      setNotice(payload.message ?? `Payment ${payload.status}.`);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      {error ? (
        <div className="sm:col-span-2">
          <Alert tone="error">{error}</Alert>
        </div>
      ) : null}
      {notice ? (
        <div className="sm:col-span-2">
          <Alert tone="notice">{notice}</Alert>
        </div>
      ) : null}
      {!ready ? (
        <p className="sm:col-span-2 text-sm text-muted-foreground">Loading Mercado Pago…</p>
      ) : null}

      <Field label="Plan" className="sm:col-span-2">
        <NativeSelect
          name="planId"
          value={planId}
          onChange={(event) => setPlanId(event.target.value as typeof planId)}
        >
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} — {formatUsd(plan.amount)}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field label="Name on card" className="sm:col-span-2">
        <Input name="holderName" required autoComplete="cc-name" />
      </Field>
      <Field label="Card number" className="sm:col-span-2">
        <Input name="cardNumber" required inputMode="numeric" autoComplete="cc-number" />
      </Field>
      <Field label="Exp month">
        <Input name="expMonth" required placeholder="MM" autoComplete="cc-exp-month" maxLength={2} />
      </Field>
      <Field label="Exp year">
        <Input name="expYear" required placeholder="YYYY" autoComplete="cc-exp-year" maxLength={4} />
      </Field>
      <Field label="CVV" className="sm:col-span-2">
        <Input name="securityCode" required autoComplete="cc-csc" maxLength={4} />
      </Field>

      <div className="sm:col-span-2 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Charge {formatUsd(selectedPlan.amount)} via Mercado Pago test mode.
        </p>
        <Button type="submit" disabled={busy || !ready}>
          {busy ? "Paying…" : `Pay ${formatUsd(selectedPlan.amount)}`}
        </Button>
      </div>
    </form>
  );
}
