import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isSchemaError } from "@/lib/portal/errors";
import { asNumber } from "@/lib/portal/format";
import type {
  InvoiceBillingType,
  InvoiceRecord,
  InvoiceStatus,
  PaymentRecord,
  PaymentStatus,
} from "@/lib/portal/types";

/**
 * Invoice reads for the pay-link workstream. queries.ts maps invoices without
 * public_token / project_id, so these helpers fetch what the pay links need.
 * All reads use the signed-in session, so RLS still applies.
 */

const TOKEN_RE = /^[a-f0-9]{32,64}$/;

export type ProjectOption = { id: string; name: string; client_id: string };

export type InvoiceDetail = {
  invoice: Omit<InvoiceRecord, "public_token" | "project_id"> & {
    public_token: string | null;
    project_id: string | null;
  };
  client: { id: string; company_name: string; contact_name: string | null; email: string };
  project: { id: string; name: string } | null;
  payments: PaymentRecord[];
  hasCardOnFile: boolean;
};

type Row = Record<string, unknown>;

function str(value: unknown) {
  return typeof value === "string" ? value : null;
}

function mapInvoiceRow(row: Row): InvoiceDetail["invoice"] {
  const token = str(row.public_token);
  return {
    id: String(row.id),
    client_id: String(row.client_id),
    payment_method_id: str(row.payment_method_id),
    payment_id: str(row.payment_id),
    number: String(row.number),
    title: String(row.title),
    description: str(row.description),
    amount: asNumber(row.amount),
    currency: str(row.currency) ?? "USD",
    billing_type: (str(row.billing_type) ?? "one_time") as InvoiceBillingType,
    status: (str(row.status) ?? "draft") as InvoiceStatus,
    period_label: str(row.period_label),
    due_on: str(row.due_on),
    next_charge_on: str(row.next_charge_on),
    mp_order_id: str(row.mp_order_id),
    project_id: str(row.project_id),
    public_token: token && TOKEN_RE.test(token) ? token : null,
    sent_at: str(row.sent_at),
    paid_at: str(row.paid_at),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapPaymentRow(row: Row): PaymentRecord {
  return {
    id: String(row.id),
    client_id: String(row.client_id),
    amount: asNumber(row.amount),
    currency: str(row.currency) ?? "USD",
    status: (str(row.status) ?? "pending") as PaymentStatus,
    paid_on: str(row.paid_on),
    period_label: str(row.period_label),
    method: str(row.method),
    reference: str(row.reference),
    notes: str(row.notes),
    invoice_id: str(row.invoice_id),
    project_id: str(row.project_id),
    mp_order_id: str(row.mp_order_id),
    refunded_amount: asNumber(row.refunded_amount ?? 0),
    charge_currency: str(row.charge_currency),
    charge_amount: row.charge_amount == null ? null : asNumber(row.charge_amount),
    fx_rate: row.fx_rate == null ? null : asNumber(row.fx_rate),
    created_at: String(row.created_at),
  };
}

/** id → public_token for the given invoices (empty when Supabase is not connected). */
export async function loadInvoiceTokens(ids: string[]): Promise<Record<string, string>> {
  if (!ids.length || !isSupabaseConfigured()) return {};
  try {
    const supabase = await createClient();
    const res = await supabase.from("invoices").select("id, public_token").in("id", ids);
    if (res.error) {
      if (!isSchemaError(res.error)) console.error("[invoices] token read failed", res.error.message);
      return {};
    }
    const map: Record<string, string> = {};
    for (const row of (res.data ?? []) as Row[]) {
      const token = str(row.public_token);
      if (token && TOKEN_RE.test(token)) map[String(row.id)] = token;
    }
    return map;
  } catch {
    return {};
  }
}

/** Projects the invoice form can link to (cancelled projects are left out). */
export async function listProjectOptions(): Promise<ProjectOption[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const res = await supabase
      .from("projects")
      .select("id, name, client_id, status")
      .neq("status", "cancelled")
      .order("created_at", { ascending: false });
    if (res.error) return [];
    return ((res.data ?? []) as Row[]).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      client_id: String(row.client_id),
    }));
  } catch {
    return [];
  }
}

export async function getInvoiceDetail(
  id: string,
): Promise<{ ok: true; data: InvoiceDetail | null } | { ok: false; reason: "schema" | "error" }> {
  const supabase = await createClient();
  const invoiceRes = await supabase.from("invoices").select("*").eq("id", id).maybeSingle();
  if (invoiceRes.error) {
    return { ok: false, reason: isSchemaError(invoiceRes.error) ? "schema" : "error" };
  }
  if (!invoiceRes.data) return { ok: true, data: null };
  const invoice = mapInvoiceRow(invoiceRes.data as Row);

  const paymentFilter =
    invoice.mp_order_id && /^[A-Za-z0-9_-]{1,120}$/.test(invoice.mp_order_id)
    ?`invoice_id.eq.${invoice.id},mp_order_id.eq.${invoice.mp_order_id}`
    : `invoice_id.eq.${invoice.id}`;

  const [clientRes, paymentsRes, projectRes, methodsRes] = await Promise.all([
    supabase
      .from("clients")
      .select("id, company_name, contact_name, email")
      .eq("id", invoice.client_id)
      .maybeSingle(),
    supabase
      .from("payments")
      .select("*")
      .or(paymentFilter)
      .order("created_at", { ascending: false }),
    invoice.project_id
      ? supabase.from("projects").select("id, name").eq("id", invoice.project_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("payment_methods")
      .select("id", { count: "exact", head: true })
      .eq("client_id", invoice.client_id)
      .eq("status", "active"),
  ]);

  if (clientRes.error || !clientRes.data) return { ok: false, reason: "error" };

  return {
    ok: true,
    data: {
      invoice,
      client: clientRes.data as InvoiceDetail["client"],
      project: (projectRes.data as { id: string; name: string } | null) ?? null,
      payments: paymentsRes.error ? [] : ((paymentsRes.data ?? []) as Row[]).map(mapPaymentRow),
      hasCardOnFile: (methodsRes.count ?? 0) > 0,
    },
  };
}
