"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, ExternalLink, Lock, Mail } from "lucide-react";
import { Alert, Field } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatUsd } from "@/lib/portal/format";

type MpInstance = {
  createCardToken: (fields: Record<string, string>) => Promise<{ id: string }>;
  getPaymentMethods: (opts: { bin: string }) => Promise<{ results?: Array<{ id?: string }> }>;
};
type MpConstructor = new (publicKey: string, options?: { locale?: string }) => MpInstance;

function mpConstructor() {
  return (window as unknown as { MercadoPago?: MpConstructor }).MercadoPago;
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
    if (mpConstructor()) {
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

type Result =
  | { kind: "paid"; message: string }
  | { kind: "pending"; message: string; challengeUrl?: string };

/** "4242424242424242" → "4242 4242 4242 4242" (Amex: 4-6-5). */
function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  if (/^3[47]/.test(digits)) {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean).join(" ");
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** Four digits typed as MMYY → "MM/YY". */
function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function PayInvoiceForm({
  token,
  amount,
  email,
  defaultName,
  chargeNote,
}: {
  token: string;
  amount: number;
  /** The address the invoice was sent to. Receipts always go here; the payer cannot change it. */
  email: string;
  defaultName?: string | null;
  /** Small print about the currency the card is actually charged in. */
  chargeNote?: string | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  // One key per attempt; a double-click reuses it so Mercado Pago never charges twice.
  const attemptKey = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/mp-config");
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.publicKey) {
          throw new Error("Card payments are not available right now.");
        }
        await loadMpSdk();
        if (!cancelled) setPublicKey(String(payload.publicKey));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Card payments are not available right now.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(null);
    const MercadoPago = mpConstructor();
    if (!publicKey || !MercadoPago) {
      setError("Mercado Pago is still loading. Try again in a moment.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const number = cardNumber.replace(/\D/g, "");
    const holderName = String(form.get("holderName") ?? "").trim();
    const securityCode = String(form.get("securityCode") ?? "").trim();
    const [expMonth = "", expYearShort = ""] = expiry.split("/");

    if (!holderName) {
      setError("Enter the name on the card.");
      return;
    }
    if (!/^\d{12,19}$/.test(number)) {
      setError("Enter the full card number.");
      return;
    }
    const month = Number(expMonth);
    if (!/^\d{2}$/.test(expMonth) || !/^\d{2}$/.test(expYearShort) || month < 1 || month > 12) {
      setError("Enter the expiration as MM/YY, for example 08/29.");
      return;
    }
    const expYear = `20${expYearShort}`;
    const now = new Date();
    if (Number(expYear) < now.getFullYear() || (Number(expYear) === now.getFullYear() && month < now.getMonth() + 1)) {
      setError("This card has expired.");
      return;
    }
    if (!/^\d{3,4}$/.test(securityCode)) {
      setError("Enter the 3 or 4 digit security code.");
      return;
    }

    setBusy(true);
    attemptKey.current ??= crypto.randomUUID();
    try {
      const mp = new MercadoPago(publicKey, { locale: "en-US" });
      const methods = await mp.getPaymentMethods({ bin: number.slice(0, 6) });
      const paymentMethodId = methods.results?.[0]?.id;
      if (!paymentMethodId) {
        setError("That card brand is not supported.");
        return;
      }

      const cardToken = await mp.createCardToken({
        cardNumber: number,
        cardholderName: holderName,
        cardExpirationMonth: expMonth,
        cardExpirationYear: expYear,
        securityCode,
        ...TOKEN_PLACEHOLDER_ID,
      });

      const response = await fetch(`/api/pay/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": attemptKey.current,
        },
        // The server sends the receipt to the invoice's email; none is posted from here.
        body: JSON.stringify({
          token: cardToken.id,
          payment_method_id: paymentMethodId,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok) {
        // A declined card gets a fresh key so the next try is a new charge.
        attemptKey.current = null;
        setError(payload?.message ?? "The payment could not be completed.");
        return;
      }

      if (payload.status === "processed") {
        setResult({ kind: "paid", message: payload.message ?? "Payment confirmed." });
        router.refresh();
      } else {
        setResult({
          kind: "pending",
          message: payload.message ?? "Mercado Pago is confirming the payment.",
          challengeUrl: typeof payload.challengeUrl === "string" ? payload.challengeUrl : undefined,
        });
      }
    } catch (err) {
      // MP.js rejects with field errors when the card data is invalid, or a plain
      // string (e.g. the page is not served over HTTPS).
      attemptKey.current = null;
      console.error("[pay] card tokenization failed", err);
      const detail = typeof err === "string" ? err.replace(/^MercadoPago\.js - /, "") : null;
      setError(detail ?? "The payment could not be completed. Check the card details and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (result?.kind === "paid") {
    return (
      <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-foreground" aria-hidden />
        <div>
          <p className="font-medium text-foreground">Paid. Thank you!</p>
          <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
        </div>
      </div>
    );
  }

  if (result?.kind === "pending") {
    return (
      <div className="space-y-4">
        <Alert tone="notice">{result.message}</Alert>
        {result.challengeUrl ? (
          <Button asChild className="w-full">
            <a href={result.challengeUrl} target="_blank" rel="noopener noreferrer">
              Complete bank verification
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
            </a>
          </Button>
        ) : null}
        <Button type="button" variant="outline" className="w-full" onClick={() => router.refresh()}>
          Refresh payment status
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4" noValidate>
      <div className="col-span-2">
        <h2 className="text-base font-semibold tracking-tight text-foreground">Pay by card</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Processed securely by Mercado Pago. Card details never touch our servers.
        </p>
      </div>
      {error ? (
        <div className="col-span-2">
          <Alert tone="error">{error}</Alert>
        </div>
      ) : null}

      <Field label="Receipt email" hint="Set by the invoice. Your receipt goes here." className="col-span-2">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={email}
            readOnly
            aria-readonly
            tabIndex={-1}
            className="cursor-default bg-muted/60 pl-9 text-muted-foreground focus-visible:ring-0"
          />
        </div>
      </Field>
      <Field label="Name on card" className="col-span-2">
        <Input name="holderName" required autoComplete="cc-name" defaultValue={defaultName ?? ""} />
      </Field>
      <Field label="Card number" className="col-span-2">
        <div className="relative">
          <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            name="cardNumber"
            required
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 1234 1234 1234"
            className="pl-9 tabular-nums tracking-wide"
            value={cardNumber}
            onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
          />
        </div>
      </Field>
      <Field label="Expiration (MM/YY)">
        <Input
          name="expiry"
          required
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/YY"
          className="tabular-nums"
          value={expiry}
          onChange={(event) => setExpiry(formatExpiry(event.target.value))}
        />
      </Field>
      <Field label="Security code">
        <Input
          name="securityCode"
          required
          inputMode="numeric"
          placeholder="CVC"
          autoComplete="cc-csc"
          maxLength={4}
          className="tabular-nums"
        />
      </Field>

      <div className="col-span-2 space-y-3 pt-2">
        <Button type="submit" className="h-11 w-full text-base" disabled={busy || !publicKey}>
          {busy ? "Processing…" : !publicKey && !error ? "Loading secure form…" : `Pay ${formatUsd(amount)} USD`}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" aria-hidden />
          Encrypted by Mercado Pago
        </p>
        {chargeNote ? (
          <p className="text-balance text-center text-xs leading-relaxed text-muted-foreground">{chargeNote}</p>
        ) : null}
      </div>
    </form>
  );
}
