const MP_BASE = "https://api.mercadopago.com";

export function mpAccessToken() {
  return process.env.MP_ACCESS_TOKEN?.trim() || "";
}

export function mpConfigured() {
  return Boolean(mpAccessToken() && process.env.MP_PUBLIC_KEY?.trim());
}

export async function mpFetch(
  path: string,
  init: {
    method?: string;
    body?: unknown;
    idempotencyKey?: string;
  } = {},
): Promise<{ ok: boolean; status: number; payload: Record<string, unknown> | null }> {
  const accessToken = mpAccessToken();
  if (!accessToken) {
    return { ok: false, status: 0, payload: { message: "MP_ACCESS_TOKEN is not set." } };
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  if (init.idempotencyKey) headers["X-Idempotency-Key"] = init.idempotencyKey;

  let response: Response;
  try {
    response = await fetch(`${MP_BASE}${path}`, {
      method: init.method ?? (init.body ? "POST" : "GET"),
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    console.error("[mercadopago] request failed", path, error instanceof Error ? error.message : "unknown");
    return { ok: false, status: 0, payload: { message: "Mercado Pago could not be reached." } };
  }

  const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  return { ok: response.ok, status: response.status, payload };
}

export function mpErrorMessage(payload: Record<string, unknown> | null, fallback: string) {
  if (!payload) return fallback;
  if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
  if (typeof payload.error === "string" && payload.error.trim()) return payload.error;
  const cause = payload.cause;
  if (Array.isArray(cause) && cause[0] && typeof cause[0] === "object") {
    const first = cause[0] as { description?: unknown; code?: unknown };
    if (typeof first.description === "string" && first.description.trim()) return first.description;
  }
  return fallback;
}
