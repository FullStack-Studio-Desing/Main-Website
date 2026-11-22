import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { findOrCreateMpCustomer, saveCardToCustomer } from "@/server/billing/customers";

/** What a payer may see about a card on file: never the full number. */
export type SavedCard = {
  id: string;
  /** Mercado Pago card id; MP.js needs it (plus the CVC) to mint a one-time token. */
  mpCardId: string;
  brand: string | null;
  lastFour: string | null;
  expMonth: number | null;
  expYear: number | null;
  holderName: string | null;
  isDefault: boolean;
};

export async function listSavedCards(clientId: string): Promise<SavedCard[]> {
  const result = await createAdminClient()
    .from("payment_methods")
    .select("id, mp_card_id, brand, last_four, exp_month, exp_year, holder_name, is_default")
    .eq("client_id", clientId)
    .eq("status", "active")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  if (result.error) {
    console.error("[saved-cards] list failed", result.error.message);
    return [];
  }
  return (result.data ?? []).map((row) => ({
    id: row.id as string,
    mpCardId: row.mp_card_id as string,
    brand: (row.brand as string | null) ?? null,
    lastFour: (row.last_four as string | null) ?? null,
    expMonth: (row.exp_month as number | null) ?? null,
    expYear: (row.exp_year as number | null) ?? null,
    holderName: (row.holder_name as string | null) ?? null,
    isDefault: Boolean(row.is_default),
  }));
}

export async function loadSavedCard(clientId: string, methodId: string) {
  const result = await createAdminClient()
    .from("payment_methods")
    .select("id, mp_customer_id, mp_card_id, brand")
    .eq("id", methodId)
    .eq("client_id", clientId)
    .eq("status", "active")
    .maybeSingle();
  return result.data ?? null;
}

/**
 * Save a tokenized card to the client's Mercado Pago customer and the CRM, as the default.
 * Callers authorize first (portal session, or a paid invoice link). Uses the service role.
 */
export async function saveCardForClient(input: {
  clientId: string;
  token: string;
  paymentMethodId: string;
  holderName?: string;
  identificationType?: "RFC" | "CURP";
  identificationNumber?: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const admin = createAdminClient();
  const clientRes = await admin
    .from("clients")
    .select("id, email, contact_name, mp_customer_id, tax_id_type, tax_id_number")
    .eq("id", input.clientId)
    .maybeSingle();
  if (clientRes.error || !clientRes.data) {
    return { ok: false, message: "The company record could not be loaded." };
  }

  const [firstName, ...rest] = String(clientRes.data.contact_name ?? "").trim().split(/\s+/);
  const identificationType =
    input.identificationType ?? ((clientRes.data.tax_id_type as "RFC" | "CURP" | null) || undefined);
  const identificationNumber =
    input.identificationNumber?.toUpperCase() ?? (clientRes.data.tax_id_number as string | null) ?? undefined;

  let customerId = clientRes.data.mp_customer_id as string | null;
  if (!customerId) {
    const created = await findOrCreateMpCustomer({
      email: clientRes.data.email,
      firstName: firstName || undefined,
      lastName: rest.join(" ") || undefined,
      identificationType,
      identificationNumber,
    });
    if (!created.ok) return { ok: false, message: created.message };
    customerId = created.id;
    await admin.from("clients").update({ mp_customer_id: customerId }).eq("id", input.clientId);
  }

  if (input.identificationType && input.identificationNumber) {
    await admin
      .from("clients")
      .update({ tax_id_type: identificationType, tax_id_number: identificationNumber })
      .eq("id", input.clientId);
  }

  const saved = await saveCardToCustomer({ customerId, token: input.token });
  if (!saved.ok) return { ok: false, message: saved.message };

  // Saving the same card twice returns the same MP card id: refresh it instead of duplicating.
  const existing = await admin
    .from("payment_methods")
    .select("id")
    .eq("client_id", input.clientId)
    .eq("mp_card_id", saved.card.id)
    .maybeSingle();

  await admin
    .from("payment_methods")
    .update({ is_default: false })
    .eq("client_id", input.clientId)
    .eq("status", "active");

  const row = {
    client_id: input.clientId,
    mp_customer_id: customerId,
    mp_card_id: saved.card.id,
    brand: saved.card.brand ?? input.paymentMethodId,
    last_four: saved.card.lastFour,
    exp_month: saved.card.expMonth,
    exp_year: saved.card.expYear,
    holder_name: input.holderName?.trim() || saved.card.holderName,
    is_default: true,
    status: "active",
  };
  const written = existing.data
    ? await admin.from("payment_methods").update(row).eq("id", existing.data.id)
    : await admin.from("payment_methods").insert(row);
  if (written.error) {
    console.error("[saved-cards] save failed", written.error.message);
    return { ok: false, message: "The card was saved in Mercado Pago, but not in the CRM." };
  }
  return { ok: true };
}
