import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isAuthKeyError, isSchemaError } from "@/lib/portal/errors";
import { asNumber, currentMonthKey, currentMonthLabel } from "@/lib/portal/format";
import type {
  ClientListItem,
  ClientRecord,
  DirectoryStats,
  PaymentRecord,
  PaymentStatus,
  PlanId,
  PortalLogin,
  ReportRecord,
  ReportStatus,
  ClientStatus,
} from "@/lib/portal/types";

export type QueryResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "schema" | "auth" | "error" };

type ClientRow = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  status: string;
  plan_id: string;
  plan_name: string;
  monthly_amount: number | string;
  currency: string;
  billing_notes: string | null;
  started_on: string | null;
  created_at: string;
  updated_at: string;
};

type PaymentRow = {
  id: string;
  client_id: string;
  amount: number | string;
  currency: string;
  status: string;
  paid_on: string | null;
  period_label: string | null;
  method: string | null;
  reference: string | null;
  notes: string | null;
  created_at: string;
};

type ReportRow = {
  id: string;
  client_id: string;
  title: string;
  period_label: string;
  summary: string | null;
  traffic: string | null;
  campaigns: string | null;
  pipeline: string | null;
  actions: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function failed(error: { code?: string; message?: string }): QueryResult<never> {
  console.error("[portal]", error.code ?? "", error.message ?? "query failed");
  if (isSchemaError(error)) return { ok: false, reason: "schema" };
  if (isAuthKeyError(error)) return { ok: false, reason: "auth" };
  return { ok: false, reason: "error" };
}

function mapClient(row: ClientRow): ClientRecord {
  return {
    id: row.id,
    company_name: row.company_name,
    contact_name: row.contact_name,
    email: row.email,
    phone: row.phone,
    status: row.status as ClientStatus,
    plan_id: row.plan_id as PlanId,
    plan_name: row.plan_name,
    monthly_amount: asNumber(row.monthly_amount),
    currency: row.currency,
    billing_notes: row.billing_notes,
    started_on: row.started_on,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapPayment(row: PaymentRow): PaymentRecord {
  return {
    id: row.id,
    client_id: row.client_id,
    amount: asNumber(row.amount),
    currency: row.currency,
    status: row.status as PaymentStatus,
    paid_on: row.paid_on,
    period_label: row.period_label,
    method: row.method,
    reference: row.reference,
    notes: row.notes,
    created_at: row.created_at,
  };
}

function mapReport(row: ReportRow): ReportRecord {
  return {
    id: row.id,
    client_id: row.client_id,
    title: row.title,
    period_label: row.period_label,
    summary: row.summary,
    traffic: row.traffic,
    campaigns: row.campaigns,
    pipeline: row.pipeline,
    actions: row.actions,
    status: row.status as ReportStatus,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

const statusOrder: Record<ClientStatus, number> = {
  active: 0,
  paused: 1,
  archived: 2,
};

export async function listClients(): Promise<
  QueryResult<{ clients: ClientListItem[]; stats: DirectoryStats }>
> {
  const supabase = await createClient();
  const [clientsRes, paymentsRes, reportsRes] = await Promise.all([
    supabase.from("clients").select("*").order("company_name"),
    supabase
      .from("payments")
      .select("client_id, amount, currency, status, paid_on, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("reports").select("status, published_at"),
  ]);

  if (clientsRes.error) return failed(clientsRes.error);
  if (paymentsRes.error) return failed(paymentsRes.error);
  if (reportsRes.error) return failed(reportsRes.error);

  const latest = new Map<string, PaymentRow>();
  for (const row of (paymentsRes.data ?? []) as PaymentRow[]) {
    if (!latest.has(row.client_id)) latest.set(row.client_id, row);
  }

  const clients = ((clientsRes.data ?? []) as ClientRow[])
    .map((row) => {
      const payment = latest.get(row.id);
      return {
        ...mapClient(row),
        latest_payment: payment
          ? {
              status: payment.status as PaymentStatus,
              amount: asNumber(payment.amount),
              currency: payment.currency,
              paid_on: payment.paid_on,
            }
          : null,
      };
    })
    .sort(
      (a, b) =>
        statusOrder[a.status] - statusOrder[b.status] ||
        a.company_name.localeCompare(b.company_name),
    );

  const month = currentMonthKey();
  const inMonth = (value: string | null | undefined) =>
    Boolean(value && value.slice(0, 7) === month);

  const collected = ((paymentsRes.data ?? []) as PaymentRow[])
    .filter((row) => row.status === "paid" && inMonth(row.paid_on ?? row.created_at))
    .reduce((sum, row) => sum + asNumber(row.amount), 0);

  const reports = ((reportsRes.data ?? []) as { status: string; published_at: string | null }[])
    .filter((row) => row.status === "published" && inMonth(row.published_at)).length;

  return {
    ok: true,
    data: {
      clients,
      stats: {
        active: clients.filter((client) => client.status === "active").length,
        collected,
        reports,
        monthLabel: currentMonthLabel(),
      },
    },
  };
}

export async function getClientBundle(id: string): Promise<
  QueryResult<{
    client: ClientRecord;
    payments: PaymentRecord[];
    reports: ReportRecord[];
    login: PortalLogin | null;
  } | null>
> {
  const supabase = await createClient();
  const [clientRes, paymentsRes, reportsRes, loginRes] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("payments")
      .select("*")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("reports")
      .select("*")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("client_id", id)
      .eq("role", "client")
      .maybeSingle(),
  ]);

  if (clientRes.error) return failed(clientRes.error);
  if (paymentsRes.error) return failed(paymentsRes.error);
  if (reportsRes.error) return failed(reportsRes.error);
  if (loginRes.error) return failed(loginRes.error);
  if (!clientRes.data) return { ok: true, data: null };

  return {
    ok: true,
    data: {
      client: mapClient(clientRes.data as ClientRow),
      payments: ((paymentsRes.data ?? []) as PaymentRow[]).map(mapPayment),
      reports: ((reportsRes.data ?? []) as ReportRow[]).map(mapReport),
      login: (loginRes.data as PortalLogin | null) ?? null,
    },
  };
}

export async function getPortalHome(clientId: string): Promise<
  QueryResult<{
    client: ClientRecord;
    payments: PaymentRecord[];
    reports: ReportRecord[];
  } | null>
> {
  const supabase = await createClient();
  const [clientRes, paymentsRes, reportsRes] = await Promise.all([
    supabase.from("clients").select("*").eq("id", clientId).maybeSingle(),
    supabase
      .from("payments")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false }),
    supabase
      .from("reports")
      .select("*")
      .eq("client_id", clientId)
      .eq("status", "published")
      .order("published_at", { ascending: false }),
  ]);

  if (clientRes.error) return failed(clientRes.error);
  if (paymentsRes.error) return failed(paymentsRes.error);
  if (reportsRes.error) return failed(reportsRes.error);
  if (!clientRes.data) return { ok: true, data: null };

  return {
    ok: true,
    data: {
      client: mapClient(clientRes.data as ClientRow),
      payments: ((paymentsRes.data ?? []) as PaymentRow[]).map(mapPayment),
      reports: ((reportsRes.data ?? []) as ReportRow[]).map(mapReport),
    },
  };
}

export async function getReport(
  id: string,
): Promise<QueryResult<{ report: ReportRecord; client: ClientRecord } | null>> {
  const supabase = await createClient();
  const reportRes = await supabase.from("reports").select("*").eq("id", id).maybeSingle();
  if (reportRes.error) return failed(reportRes.error);
  if (!reportRes.data) return { ok: true, data: null };

  const report = mapReport(reportRes.data as ReportRow);
  const clientRes = await supabase
    .from("clients")
    .select("*")
    .eq("id", report.client_id)
    .maybeSingle();
  if (clientRes.error) return failed(clientRes.error);
  if (!clientRes.data) return { ok: true, data: null };

  return {
    ok: true,
    data: { report, client: mapClient(clientRes.data as ClientRow) },
  };
}
