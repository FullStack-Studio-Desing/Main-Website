"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Field } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

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

export function PaymentMethodForm({
  defaultTaxIdType,
  defaultTaxIdNumber,
}: {
  defaultTaxIdType?: "RFC" | "CURP" | null;
  defaultTaxIdNumber?: string | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

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

  const ready = useMemo(() => Boolean(publicKey), [publicKey]);

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
    const identificationType = String(form.get("identificationType") ?? "").trim() as
      | "RFC"
      | "CURP";
    const identificationNumber = String(form.get("identificationNumber") ?? "")
      .trim()
      .toUpperCase();

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
        identificationType,
        identificationNumber,
      });

      const response = await fetch("/api/portal/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token.id,
          paymentMethodId,
          holderName,
          identificationType,
          identificationNumber,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.error ?? "The card could not be saved.");
        return;
      }
      setNotice(payload?.notice ?? "Card saved on file.");
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The card could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
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
      <Field label="CVV">
        <Input name="securityCode" required autoComplete="cc-csc" maxLength={4} />
      </Field>
      <Field label="ID type">
        <NativeSelect name="identificationType" defaultValue={defaultTaxIdType ?? "RFC"}>
          <option value="RFC">RFC</option>
          <option value="CURP">CURP</option>
        </NativeSelect>
      </Field>
      <Field label="RFC / CURP" className="sm:col-span-2">
        <Input
          name="identificationNumber"
          required
          defaultValue={defaultTaxIdNumber ?? ""}
          autoComplete="off"
        />
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={busy || !ready}>
          {busy ? "Saving…" : "Save card on file"}
        </Button>
      </div>
    </form>
  );
}
