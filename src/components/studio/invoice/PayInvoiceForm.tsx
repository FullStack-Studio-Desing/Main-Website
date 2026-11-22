"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CheckCircle2, CreditCard, ExternalLink, Lock, Mail, Plus } from "lucide-react";
import { Alert, Field } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatUsd } from "@/lib/portal/format";
import { CardPreview, type CardBrand, type CardField } from "@/components/studio/invoice/CardPreview";
import { StatementPreview, type StatementLine } from "@/components/studio/invoice/StatementPreview";

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

type Result = { kind: "paid"; message: string } | { kind: "pending"; message: string; challengeUrl?: string };

/** Masked card on file, as the pay page receives it. */
export type SavedCardOption = {
  id: string;
  mpCardId: string;
  brand: string | null;
  lastFour: string | null;
  expMonth: number | null;
  expYear: number | null;
  holderName: string | null;
  isDefault: boolean;
};

/** Mercado Pago payment_method ids ("master", "debvisa", …) → card face brand. */
function cardBrand(id: string | null): CardBrand {
  if (!id) return null;
  if (id.includes("visa")) return "visa";
  if (id.includes("master")) return "mastercard";
  if (id.includes("amex")) return "amex";
  return null;
}

function brandName(id: string | null) {
  const brand = cardBrand(id);
  return brand === "visa"
    ? "Visa"
    : brand === "mastercard"
      ? "Mastercard"
      : brand === "amex"
        ? "Amex"
        : "Card";
}

function MethodOption({
  selected,
  onSelect,
  title,
  detail,
  badge,
  icon,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  detail: string;
  badge?: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
        selected ? "border-foreground bg-accent" : "hover:bg-accent/60",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground",
          selected && "text-foreground",
        )}
      >
        {icon ?? <CreditCard className="h-4 w-4" aria-hidden />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-foreground">{title}</span>
        <span className="block text-xs text-muted-foreground">{detail}</span>
      </span>
      {badge ? (
        <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          {badge}
        </span>
      ) : null}
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-foreground bg-foreground text-background" : "border-muted-foreground/40",
        )}
      >
        {selected ? <Check className="h-3 w-3" aria-hidden /> : null}
      </span>
    </button>
  );
}

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
  statement,
  savedCards = [],
}: {
  token: string;
  amount: number;
  /** The address the invoice was sent to. Receipts always go here; the payer cannot change it. */
  email: string;
  defaultName?: string | null;
  /** Mock statement row shown above the Pay button. */
  statement?: StatementLine | null;
  /** The client's cards on file, masked. */
  savedCards?: SavedCardOption[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [holder, setHolder] = useState(defaultName ?? "");
  const [cvcLength, setCvcLength] = useState(0);
  const [focused, setFocused] = useState<CardField>(null);
  // "new" or the id of a saved card; default to the client's default card when there is one.
  const [method, setMethod] = useState<string>(savedCards[0]?.id ?? "new");
  const [saveCard, setSaveCard] = useState(true);
  const savedCard = savedCards.find((card) => card.id === method) ?? null;
  const track = (field: CardField) => ({
    onFocus: () => setFocused(field),
    onBlur: () => setFocused((current) => (current === field ? null : current)),
  });
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
    const expYear = `20${expYearShort}`;

    if (!savedCard) {
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
      const now = new Date();
      if (
        Number(expYear) < now.getFullYear() ||
        (Number(expYear) === now.getFullYear() && month < now.getMonth() + 1)
      ) {
        setError("This card has expired.");
        return;
      }
    }
    if (!/^\d{3,4}$/.test(securityCode)) {
      setError("Enter the 3 or 4 digit security code.");
      return;
    }

    setBusy(true);
    attemptKey.current ??= crypto.randomUUID();
    try {
      const mp = new MercadoPago(publicKey, { locale: "en-US" });
      let paymentMethodId: string | undefined;
      let cardToken: { id: string };
      let saveToken: { id: string } | null = null;

      if (savedCard) {
        // A saved card still needs its security code: whoever holds the link must hold the card.
        paymentMethodId = savedCard.brand ?? undefined;
        cardToken = await mp.createCardToken({
          cardId: savedCard.mpCardId,
          securityCode,
        });
      } else {
        const methods = await mp.getPaymentMethods({ bin: number.slice(0, 6) });
        paymentMethodId = methods.results?.[0]?.id;
        if (!paymentMethodId) {
          setError("That card brand is not supported.");
          return;
        }
        const fields = {
          cardNumber: number,
          cardholderName: holderName,
          cardExpirationMonth: expMonth,
          cardExpirationYear: expYear,
          securityCode,
          ...TOKEN_PLACEHOLDER_ID,
        };
        cardToken = await mp.createCardToken(fields);
        // Tokens are single-use: a second one lets the server save the card after the charge.
        if (saveCard) saveToken = await mp.createCardToken(fields).catch(() => null);
      }
      if (!paymentMethodId) {
        setError("That card brand is not supported.");
        return;
      }

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
          saved_method_id: savedCard?.id,
          save_token: saveToken?.id,
          holder_name: savedCard ? undefined : holderName,
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
        const note = payload.cardSaved ? " Your card is saved for next time." : "";
        setResult({
          kind: "paid",
          message: `${payload.message ?? "Payment confirmed."}${note}`,
        });
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
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={email}
            readOnly
            aria-readonly
            tabIndex={-1}
            className="cursor-default bg-muted/60 pl-9 text-muted-foreground focus-visible:ring-0"
          />
        </div>
      </Field>

      {savedCards.length ? (
        <fieldset className="col-span-2 space-y-2">
          <legend className="mb-2 text-sm font-medium text-foreground">Payment method</legend>
          <div role="radiogroup" aria-label="Payment method" className="grid gap-2">
            {savedCards.map((card) => (
              <MethodOption
                key={card.id}
                selected={method === card.id}
                onSelect={() => {
                  setMethod(card.id);
                  setCvcLength(0);
                }}
                title={`${brandName(card.brand)} •••• ${card.lastFour ?? "····"}`}
                detail={
                  card.expMonth && card.expYear
                    ? `Expires ${String(card.expMonth).padStart(2, "0")}/${String(card.expYear).slice(-2)}`
                    : "Saved card"
                }
                badge={card.isDefault ? "Default" : undefined}
              />
            ))}
            <MethodOption
              selected={method === "new"}
              onSelect={() => {
                setMethod("new");
                setCvcLength(0);
              }}
              title="Use a new card"
              detail="Visa, Mastercard or American Express"
              icon={<Plus className="h-4 w-4" aria-hidden />}
            />
          </div>
        </fieldset>
      ) : null}

      <div className="col-span-2 py-2">
        <CardPreview
          number={
            savedCard ? `${"•".repeat(12)}${savedCard.lastFour ?? "••••"}` : cardNumber.replace(/\D/g, "")
          }
          brandOverride={savedCard ? cardBrand(savedCard.brand) : undefined}
          name={savedCard ? (savedCard.holderName ?? holder) : holder}
          expiry={
            savedCard && savedCard.expMonth && savedCard.expYear
              ? `${String(savedCard.expMonth).padStart(2, "0")}/${String(savedCard.expYear).slice(-2)}`
              : expiry
          }
          cvcLength={cvcLength}
          focused={focused}
        />
      </div>

      {savedCard ? (
        <>
          <Field label="Security code" className={savedCard ? "col-span-2 sm:col-span-1" : undefined}>
            <Input
              key={method}
              name="securityCode"
              type="password"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="•••"
              autoComplete="cc-csc"
              maxLength={4}
              className="tabular-nums tracking-[0.3em]"
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                if (digits !== event.target.value) event.target.value = digits;
                setCvcLength(digits.length);
              }}
              {...track("cvc")}
            />
          </Field>
          <p className="col-span-2 -mt-1 text-xs text-muted-foreground sm:col-span-1 sm:mt-7">
            For your security, enter the code on the back of this card.
          </p>
        </>
      ) : (
        <>
          <Field label="Name on card" className="col-span-2">
            <Input
              name="holderName"
              required
              autoComplete="cc-name"
              value={holder}
              onChange={(event) => setHolder(event.target.value.slice(0, 60))}
              {...track("name")}
            />
          </Field>
          <Field label="Card number" className="col-span-2">
            <div className="relative">
              <CreditCard
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                name="cardNumber"
                required
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 1234 1234 1234"
                className="pl-9 tabular-nums tracking-wide"
                value={cardNumber}
                onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                {...track("number")}
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
              {...track("expiry")}
            />
          </Field>
          <Field label="Security code" className={savedCard ? "col-span-2 sm:col-span-1" : undefined}>
            <Input
              key={method}
              name="securityCode"
              type="password"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="•••"
              autoComplete="cc-csc"
              maxLength={4}
              className="tabular-nums tracking-[0.3em]"
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                if (digits !== event.target.value) event.target.value = digits;
                setCvcLength(digits.length);
              }}
              {...track("cvc")}
            />
          </Field>
          <label className="col-span-2 flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm">
            <Checkbox
              checked={saveCard}
              onCheckedChange={(value) => setSaveCard(value === true)}
              className="mt-0.5"
              aria-describedby="save-card-hint"
            />
            <span>
              <span className="font-medium text-foreground">Save this card for future payments</span>
              <span id="save-card-hint" className="block text-xs text-muted-foreground">
                Stored securely by Mercado Pago. You will still enter the security code each time.
              </span>
            </span>
          </label>
        </>
      )}

      {statement ? (
        <div className="col-span-2 pt-1">
          <StatementPreview line={statement} />
        </div>
      ) : null}

      <div className="col-span-2 space-y-3 pt-2">
        <Button type="submit" className="h-11 w-full text-base" disabled={busy || !publicKey}>
          {busy
            ? "Processing…"
            : !publicKey && !error
              ? "Loading secure form…"
              : `Pay ${formatUsd(amount)} USD`}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" aria-hidden />
          Encrypted by Mercado Pago
        </p>
      </div>
    </form>
  );
}
