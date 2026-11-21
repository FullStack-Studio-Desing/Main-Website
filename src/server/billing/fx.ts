import "server-only";

/**
 * Invoices and plans are priced in USD. The Mercado Pago seller account is Mexican and
 * always charges in its own currency (MXN), so every charge converts USD → MXN at the
 * current market rate. Set MP_ACCOUNT_CURRENCY=USD to turn conversion off.
 */
export function accountCurrency() {
  return (process.env.MP_ACCOUNT_CURRENCY?.trim().toUpperCase() || "MXN").slice(0, 3);
}

export type FxQuote = {
  /** Units of the account currency per 1 USD. */
  rate: number;
  currency: string;
  source: string;
  fetchedAt: string;
};

const CACHE_MS = 60 * 60 * 1000;
let cached: { quote: FxQuote; at: number } | null = null;

// USD→MXN has traded between ~10 and ~30 for decades; anything outside is a bad feed.
const SANE: Record<string, [number, number]> = { MXN: [8, 40] };

function sane(currency: string, rate: unknown): rate is number {
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) return false;
  const bounds = SANE[currency];
  return !bounds || (rate >= bounds[0] && rate <= bounds[1]);
}

async function fromErApi(currency: string): Promise<number | null> {
  const response = await fetch("https://open.er-api.com/v6/latest/USD", {
    signal: AbortSignal.timeout(8_000),
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => null)) as
    | { result?: string; rates?: Record<string, number> }
    | null;
  const rate = payload?.result === "success" ? payload.rates?.[currency] : undefined;
  return sane(currency, rate) ? rate : null;
}

async function fromFrankfurter(currency: string): Promise<number | null> {
  const response = await fetch(
    `https://api.frankfurter.dev/v1/latest?base=USD&symbols=${encodeURIComponent(currency)}`,
    { signal: AbortSignal.timeout(8_000), cache: "no-store" },
  );
  const payload = (await response.json().catch(() => null)) as { rates?: Record<string, number> } | null;
  const rate = payload?.rates?.[currency];
  return sane(currency, rate) ? rate : null;
}

/** Current USD → account-currency rate, cached for an hour. Null when no source answers. */
export async function getUsdQuote(): Promise<FxQuote | null> {
  const currency = accountCurrency();
  if (currency === "USD") {
    return { rate: 1, currency, source: "none", fetchedAt: new Date().toISOString() };
  }
  if (cached && cached.quote.currency === currency && Date.now() - cached.at < CACHE_MS) {
    return cached.quote;
  }

  const sources: [string, (currency: string) => Promise<number | null>][] = [
    ["open.er-api.com", fromErApi],
    ["frankfurter.dev", fromFrankfurter],
  ];
  for (const [source, load] of sources) {
    try {
      const rate = await load(currency);
      if (rate) {
        const quote = { rate, currency, source, fetchedAt: new Date().toISOString() };
        cached = { quote, at: Date.now() };
        return quote;
      }
    } catch (error) {
      console.error("[fx] rate source failed", source, error instanceof Error ? error.message : "unknown");
    }
  }
  // A stale rate beats refusing payment, but only for a day.
  if (cached && cached.quote.currency === currency && Date.now() - cached.at < 24 * CACHE_MS) {
    return cached.quote;
  }
  return null;
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

/** USD → account currency at the quote's rate, rounded to cents. */
export function toChargeAmount(usd: number, quote: Pick<FxQuote, "rate">) {
  return roundMoney(usd * quote.rate);
}
