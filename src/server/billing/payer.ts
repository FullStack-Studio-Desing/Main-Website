export type ServerPayer = {
  email: string;
  /** Optional — US payers have no RFC/CURP; omit for email-only charges. */
  identificationType?: "RFC" | "CURP";
  identificationNumber?: string;
};

type PayerResult =
  | { ok: true; payer: ServerPayer }
  | { ok: false; message: string };

/**
 * Prefer payer fields from the request (test / checkout form). Fall back to
 * MP_PAYER_* env vars for the marketing form that only collects card data.
 * Identification is optional (US clients do not use RFC/CURP).
 */
export function resolvePayer(input?: {
  email?: unknown;
  identificationType?: unknown;
  identificationNumber?: unknown;
}): PayerResult {
  const fromBody = normalizePayer(input);
  if (fromBody.ok) return fromBody;
  if (hasAnyPayerInput(input)) return fromBody;
  return readServerPayer();
}

/**
 * Fallback when the request omits email (legacy / server-only callers).
 * Prefer collecting email on the checkout form. RFC/CURP stay optional.
 */
export function readServerPayer(): PayerResult {
  return normalizePayer(
    {
      email: process.env.MP_PAYER_EMAIL,
      identificationType: process.env.MP_PAYER_ID_TYPE,
      identificationNumber: process.env.MP_PAYER_ID_NUMBER,
    },
    {
      email: "Enter a payer email (or set MP_PAYER_EMAIL).",
    }
  );
}

function hasAnyPayerInput(input?: {
  email?: unknown;
  identificationType?: unknown;
  identificationNumber?: unknown;
}) {
  if (!input) return false;
  return [input.email, input.identificationType, input.identificationNumber].some(
    (value) => typeof value === "string" && value.trim().length > 0
  );
}

function normalizePayer(
  input?: {
    email?: unknown;
    identificationType?: unknown;
    identificationNumber?: unknown;
  },
  messages?: {
    email: string;
  }
): PayerResult {
  const email =
    typeof input?.email === "string" ? input.email.trim().toLowerCase() : "";
  const identificationTypeRaw =
    typeof input?.identificationType === "string"
      ? input.identificationType.trim().toUpperCase()
      : "";
  const identificationNumber =
    typeof input?.identificationNumber === "string"
      ? input.identificationNumber.trim().toUpperCase()
      : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      ok: false,
      message: messages?.email ?? "Enter a valid payer email.",
    };
  }

  // No ID → email-only payer (US clients).
  if (!identificationTypeRaw && !identificationNumber) {
    return { ok: true, payer: { email } };
  }

  if (identificationTypeRaw !== "RFC" && identificationTypeRaw !== "CURP") {
    return {
      ok: false,
      message: "If you send an ID, use RFC or CURP — or omit it for US payers.",
    };
  }
  if (!validDocument(identificationTypeRaw, identificationNumber)) {
    return {
      ok: false,
      message: "Enter a valid RFC or CURP, or omit ID fields for US payers.",
    };
  }

  return {
    ok: true,
    payer: {
      email,
      identificationType: identificationTypeRaw,
      identificationNumber,
    },
  };
}

function validDocument(type: "RFC" | "CURP", number: string): boolean {
  if (type === "RFC") return /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(number);
  return /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/.test(number);
}
