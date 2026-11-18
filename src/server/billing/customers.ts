import { mpErrorMessage, mpFetch } from "@/server/billing/mp";

export type MpCustomerInput = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  identificationType?: "RFC" | "CURP" | null;
  identificationNumber?: string | null;
};

export async function findOrCreateMpCustomer(
  input: MpCustomerInput,
): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "A valid payer email is required for Mercado Pago." };
  }

  const search = await mpFetch(`/v1/customers/search?email=${encodeURIComponent(email)}`);
  if (search.ok && search.payload) {
    const results = Array.isArray(search.payload.results) ? search.payload.results : [];
    const existing = results.find((row) => row && typeof row === "object" && typeof (row as { id?: unknown }).id === "string") as
      | { id: string }
      | undefined;
    if (existing?.id) return { ok: true, id: existing.id };
  }

  const body: Record<string, unknown> = { email };
  if (input.firstName) body.first_name = input.firstName;
  if (input.lastName) body.last_name = input.lastName;
  if (input.identificationType && input.identificationNumber) {
    body.identification = {
      type: input.identificationType,
      number: input.identificationNumber,
    };
  }

  const created = await mpFetch("/v1/customers", { body });
  const id = typeof created.payload?.id === "string" ? created.payload.id : "";
  if (!created.ok || !id) {
    return {
      ok: false,
      message: mpErrorMessage(created.payload, "Mercado Pago could not create the customer."),
    };
  }
  return { ok: true, id };
}

export async function saveCardToCustomer(input: {
  customerId: string;
  token: string;
}): Promise<
  | {
      ok: true;
      card: {
        id: string;
        brand: string | null;
        lastFour: string | null;
        expMonth: number | null;
        expYear: number | null;
        holderName: string | null;
      };
    }
  | { ok: false; message: string }
> {
  const saved = await mpFetch(`/v1/customers/${encodeURIComponent(input.customerId)}/cards`, {
    body: { token: input.token },
  });

  const id = typeof saved.payload?.id === "string" ? saved.payload.id : "";
  if (!saved.ok || !id) {
    return {
      ok: false,
      message: mpErrorMessage(saved.payload, "Mercado Pago could not save that card."),
    };
  }

  const paymentMethod =
    saved.payload?.payment_method && typeof saved.payload.payment_method === "object"
      ? (saved.payload.payment_method as { id?: unknown })
      : null;
  const cardholder =
    saved.payload?.cardholder && typeof saved.payload.cardholder === "object"
      ? (saved.payload.cardholder as { name?: unknown })
      : null;

  return {
    ok: true,
    card: {
      id,
      brand: typeof paymentMethod?.id === "string" ? paymentMethod.id : null,
      lastFour: typeof saved.payload?.last_four_digits === "string" ? saved.payload.last_four_digits : null,
      expMonth: typeof saved.payload?.expiration_month === "number" ? saved.payload.expiration_month : null,
      expYear: typeof saved.payload?.expiration_year === "number" ? saved.payload.expiration_year : null,
      holderName: typeof cardholder?.name === "string" ? cardholder.name : null,
    },
  };
}

export async function createTokenFromSavedCard(input: {
  cardId: string;
  securityCode?: string;
}): Promise<{ ok: true; token: string } | { ok: false; message: string }> {
  const body: Record<string, unknown> = { card_id: input.cardId };
  if (input.securityCode) body.security_code = input.securityCode;

  const tokenized = await mpFetch("/v1/card_tokens", { body });
  const token = typeof tokenized.payload?.id === "string" ? tokenized.payload.id : "";
  if (!tokenized.ok || !token) {
    return {
      ok: false,
      message: mpErrorMessage(tokenized.payload, "Mercado Pago could not reuse the saved card."),
    };
  }
  return { ok: true, token };
}

export async function deleteCustomerCard(input: {
  customerId: string;
  cardId: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const deleted = await mpFetch(
    `/v1/customers/${encodeURIComponent(input.customerId)}/cards/${encodeURIComponent(input.cardId)}`,
    { method: "DELETE" },
  );
  if (!deleted.ok && deleted.status !== 404) {
    return {
      ok: false,
      message: mpErrorMessage(deleted.payload, "Mercado Pago could not remove that card."),
    };
  }
  return { ok: true };
}
