export type ServerPayer = {
  email: string;
  identificationType: "RFC" | "CURP";
  identificationNumber: string;
};

/**
 * Orders API still expects payer email, and a Mexico seller usually also
 * needs RFC or CURP. The future card form does not collect these, so they
 * live in server config until a trusted customer record exists.
 */
export function readServerPayer():
  | { ok: true; payer: ServerPayer }
  | { ok: false; message: string } {
  const email = process.env.MP_PAYER_EMAIL?.trim().toLowerCase() ?? "";
  const identificationType = process.env.MP_PAYER_ID_TYPE?.trim().toUpperCase() ?? "";
  const identificationNumber = process.env.MP_PAYER_ID_NUMBER?.trim().toUpperCase() ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      ok: false,
      message: "Set MP_PAYER_EMAIL before charging. The card form does not collect email.",
    };
  }
  if (identificationType !== "RFC" && identificationType !== "CURP") {
    return {
      ok: false,
      message: "Set MP_PAYER_ID_TYPE to RFC or CURP. The card form does not collect it.",
    };
  }
  if (!validDocument(identificationType, identificationNumber)) {
    return {
      ok: false,
      message: "Set MP_PAYER_ID_NUMBER to a valid RFC or CURP. The card form does not collect it.",
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
