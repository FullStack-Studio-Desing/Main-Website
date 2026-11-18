export type ServerPayer = {
  email: string;
  identificationType: "RFC" | "CURP";
  identificationNumber: string;
};

type PayerResult =
  | { ok: true; payer: ServerPayer }
  | { ok: false; message: string };

/**
 * Prefer payer fields from the request (test / checkout form). Fall back to
 * MP_PAYER_* env vars for the marketing form that only collects card data.
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
 * Orders API still expects payer email, and a Mexico seller usually also
 * needs RFC or CURP. The future card form does not collect these, so they
 * live in server config until a trusted customer record exists.
 */
export function readServerPayer(): PayerResult {
  return normalizePayer(
    {
      email: process.env.MP_PAYER_EMAIL,
      identificationType: process.env.MP_PAYER_ID_TYPE,
      identificationNumber: process.env.MP_PAYER_ID_NUMBER,
    },
    {
      email: "Set MP_PAYER_EMAIL before charging. The card form does not collect email.",
      identificationType: "Set MP_PAYER_ID_TYPE to RFC or CURP. The card form does not collect it.",
      identificationNumber:
        "Set MP_PAYER_ID_NUMBER to a valid RFC or CURP. The card form does not collect it.",
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
    identificationType: string;
    identificationNumber: string;
  }
): PayerResult {
  const email =
    typeof input?.email === "string" ? input.email.trim().toLowerCase() : "";
  const identificationType =
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
  if (identificationType !== "RFC" && identificationType !== "CURP") {
    return {
      ok: false,
      message: messages?.identificationType ?? "Choose RFC or CURP.",
    };
  }
  if (!validDocument(identificationType, identificationNumber)) {
    return {
      ok: false,
      message: messages?.identificationNumber ?? "Enter a valid RFC or CURP.",
    };
  }

  return {
    ok: true,
    payer: { email, identificationType, identificationNumber },
  };
}

function validDocument(type: "RFC" | "CURP", number: string): boolean {
  if (type === "RFC") return /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(number);
  return /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/.test(number);
}
