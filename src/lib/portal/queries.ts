import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isAuthKeyError, isSchemaError } from "@/lib/portal/errors";
import { asNumber, currentMonthKey, currentMonthLabel } from "@/lib/portal/format";
import type {
  ClientListItem,
  ClientRecord,
  DirectoryStats,
  InvoiceBillingType,
  InvoiceListItem,
  InvoiceRecord,
  InvoiceStatus,
  PaymentListItem,
  PaymentMethodRecord,
  PaymentMethodStatus,
  PaymentRecord,
  PaymentStatus,
  PlanId,
  PortalLogin,
  ProjectListItem,
  ProjectRecord,
  ProjectStatus,
  ReportRecord,
  ReportStatus,
  ClientStatus,
  TaxIdType,
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
  mp_customer_id?: string | null;
  tax_id_type?: string | null;
  tax_id_number?: string | null;
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
  invoice_id?: string | null;
  mp_order_id?: string | null;
  created_at: string;
};

type PaymentMethodRow = {
  id: string;
  client_id: string;
  mp_customer_id: string;
  mp_card_id: string;
  brand: string | null;
  last_four: string | null;
  exp_month: number | null;
  exp_year: number | null;
  holder_name: string | null;
  is_default: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};

type InvoiceRow = {
  id: string;
  client_id: string;
  payment_method_id: string | null;
  payment_id: string | null;
  number: string;
  title: string;
  description: string | null;
  amount: number | string;
  currency: string;
  billing_type: string;
  status: string;
  period_label: string | null;
  due_on: string | null;
  next_charge_on: string | null;
  mp_order_id: string | null;
  sent_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
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

type ProjectRow = {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
  status: string;
  started_on: string | null;
  due_on: string | null;
  budget: number | string | null;
  currency: string;
  notes: string | null;
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
    mp_customer_id: row.mp_customer_id ?? null,
    tax_id_type: (row.tax_id_type as TaxIdType | null | undefined) ?? null,
    tax_id_number: row.tax_id_number ?? null,
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
    invoice_id: row.invoice_id ?? null,
    mp_order_id: row.mp_order_id ?? null,
    created_at: row.created_at,
  };
}

function mapPaymentMethod(row: PaymentMethodRow): PaymentMethodRecord {
  return {
    id: row.id,
    client_id: row.client_id,
    mp_customer_id: row.mp_customer_id,
    mp_card_id: row.mp_card_id,
    brand: row.brand,
    last_four: row.last_four,
    exp_month: row.exp_month,
    exp_year: row.exp_year,
    holder_name: row.holder_name,
    is_default: row.is_default,
    status: row.status as PaymentMethodStatus,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapInvoice(row: InvoiceRow): InvoiceRecord {
  return {
    id: row.id,
    client_id: row.client_id,
    payment_method_id: row.payment_method_id,
    payment_id: row.payment_id,
    number: row.number,
    title: row.title,
    description: row.description,
    amount: asNumber(row.amount),
    currency: row.currency,
    billing_type: row.billing_type as InvoiceBillingType,
    status: row.status as InvoiceStatus,
    period_label: row.period_label,
    due_on: row.due_on,
    next_charge_on: row.next_charge_on,
    mp_order_id: row.mp_order_id,
    sent_at: row.sent_at,
    paid_at: row.paid_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
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

function mapProject(row: ProjectRow): ProjectRecord {
  return {
    id: row.id,
    client_id: row.client_id,
    name: row.name,
    description: row.description,
    status: row.status as ProjectStatus,
    started_on: row.started_on,
    due_on: row.due_on,
    budget: row.budget === null || row.budget === undefined ? null : asNumber(row.budget),
    currency: row.currency,
    notes: row.notes,
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
  const [clientsRes, paymentsRes, reportsRes, projectsRes] = await Promise.all([
    supabase.from("clients").select("*").order("company_name"),
    supabase
      .from("payments")
      .select("client_id, amount, currency, status, paid_on, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("reports").select("status, published_at"),
    supabase.from("projects").select("id, status"),
  ]);

  if (clientsRes.error) return failed(clientsRes.error);
  if (paymentsRes.error) return failed(paymentsRes.error);
  if (reportsRes.error) return failed(reportsRes.error);
  // Projects are additive CRM; allow admin to load before that migration runs.
  const projectsMissing = Boolean(projectsRes.error && isSchemaError(projectsRes.error));
  if (projectsRes.error && !projectsMissing) return failed(projectsRes.error);

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

  const projects = projectsMissing
    ? 0
    : ((projectsRes.data ?? []) as { id: string; status: string }[]).filter(
        (row) => row.status === "active" || row.status === "planning",
      ).length;

  return {
    ok: true,
    data: {
      clients,
      stats: {
        active: clients.filter((client) => client.status === "active").length,
        collected,
        reports,
        projects,
        monthLabel: currentMonthLabel(),
      },
    },
  };
}

export async function listPayments(): Promise<QueryResult<PaymentListItem[]>> {
  const supabase = await createClient();
  const [paymentsRes, clientsRes] = await Promise.all([
    supabase.from("payments").select("*").order("created_at", { ascending: false }),
    supabase.from("clients").select("id, company_name"),
  ]);
  if (paymentsRes.error) return failed(paymentsRes.error);
  if (clientsRes.error) return failed(clientsRes.error);

  const names = new Map(
    ((clientsRes.data ?? []) as { id: string; company_name: string }[]).map((row) => [
      row.id,
      row.company_name,
    ]),
  );

  return {
    ok: true,
    data: ((paymentsRes.data ?? []) as PaymentRow[]).map((row) => ({
      ...mapPayment(row),
      company_name: names.get(row.client_id) ?? "Unknown client",
    })),
  };
}

export async function listProjects(): Promise<QueryResult<ProjectListItem[]>> {
  const supabase = await createClient();
  const [projectsRes, clientsRes] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("clients").select("id, company_name"),
  ]);
  if (projectsRes.error) return failed(projectsRes.error);
  if (clientsRes.error) return failed(clientsRes.error);

  const names = new Map(
    ((clientsRes.data ?? []) as { id: string; company_name: string }[]).map((row) => [
      row.id,
      row.company_name,
    ]),
  );

  const statusRank: Record<ProjectStatus, number> = {
    active: 0,
    planning: 1,
    paused: 2,
    completed: 3,
    cancelled: 4,
  };

  return {
    ok: true,
    data: ((projectsRes.data ?? []) as ProjectRow[])
      .map((row) => ({
        ...mapProject(row),
        company_name: names.get(row.client_id) ?? "Unknown client",
      }))
      .sort(
        (a, b) =>
          statusRank[a.status] - statusRank[b.status] ||
          a.name.localeCompare(b.name),
      ),
  };
}

export async function listClientOptions(): Promise<
  QueryResult<{ id: string; company_name: string }[]>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id, company_name")
    .neq("status", "archived")
    .order("company_name");
  if (error) return failed(error);
  return { ok: true, data: data ?? [] };
}

export async function listInvoices(): Promise<QueryResult<InvoiceListItem[]>> {
  const supabase = await createClient();
  const [invoicesRes, clientsRes] = await Promise.all([
    supabase.from("invoices").select("*").order("created_at", { ascending: false }),
    supabase.from("clients").select("id, company_name"),
  ]);
  if (invoicesRes.error) {
    if (isSchemaError(invoicesRes.error)) return { ok: true, data: [] };
    return failed(invoicesRes.error);
  }
  if (clientsRes.error) return failed(clientsRes.error);

  const names = new Map(
    ((clientsRes.data ?? []) as { id: string; company_name: string }[]).map((row) => [
      row.id,
      row.company_name,
    ]),
  );

  return {
    ok: true,
    data: ((invoicesRes.data ?? []) as InvoiceRow[]).map((row) => ({
      ...mapInvoice(row),
      company_name: names.get(row.client_id) ?? "Unknown client",
    })),
  };
}

export async function listPaymentMethods(
  clientId: string,
): Promise<QueryResult<PaymentMethodRecord[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("client_id", clientId)
    .eq("status", "active")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    if (isSchemaError(error)) return { ok: true, data: [] };
    return failed(error);
  }
  return { ok: true, data: ((data ?? []) as PaymentMethodRow[]).map(mapPaymentMethod) };
}

export async function getClientBundle(id: string): Promise<
  QueryResult<{
    client: ClientRecord;
    payments: PaymentRecord[];
    projects: ProjectRecord[];
    reports: ReportRecord[];
    invoices: InvoiceRecord[];
    paymentMethods: PaymentMethodRecord[];
    login: PortalLogin | null;
  } | null>
> {
  const supabase = await createClient();
  const [clientRes, paymentsRes, projectsRes, reportsRes, invoicesRes, methodsRes, loginRes] =
    await Promise.all([
      supabase.from("clients").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("payments")
        .select("*")
        .eq("client_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("projects")
        .select("*")
        .eq("client_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("reports")
        .select("*")
        .eq("client_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("invoices")
        .select("*")
        .eq("client_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("payment_methods")
        .select("*")
        .eq("client_id", id)
        .eq("status", "active")
        .order("is_default", { ascending: false })
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
  const projectsMissing = Boolean(projectsRes.error && isSchemaError(projectsRes.error));
  if (projectsRes.error && !projectsMissing) return failed(projectsRes.error);
  if (reportsRes.error) return failed(reportsRes.error);
  const invoicesMissing = Boolean(invoicesRes.error && isSchemaError(invoicesRes.error));
  if (invoicesRes.error && !invoicesMissing) return failed(invoicesRes.error);
  const methodsMissing = Boolean(methodsRes.error && isSchemaError(methodsRes.error));
  if (methodsRes.error && !methodsMissing) return failed(methodsRes.error);
  if (loginRes.error) return failed(loginRes.error);
  if (!clientRes.data) return { ok: true, data: null };

  return {
    ok: true,
    data: {
      client: mapClient(clientRes.data as ClientRow),
      payments: ((paymentsRes.data ?? []) as PaymentRow[]).map(mapPayment),
      projects: projectsMissing
        ? []
        : ((projectsRes.data ?? []) as ProjectRow[]).map(mapProject),
      reports: ((reportsRes.data ?? []) as ReportRow[]).map(mapReport),
      invoices: invoicesMissing
        ? []
        : ((invoicesRes.data ?? []) as InvoiceRow[]).map(mapInvoice),
      paymentMethods: methodsMissing
        ? []
        : ((methodsRes.data ?? []) as PaymentMethodRow[]).map(mapPaymentMethod),
      login: (loginRes.data as PortalLogin | null) ?? null,
    },
  };
}

export async function getProject(
  id: string,
): Promise<QueryResult<{ project: ProjectRecord; client: ClientRecord } | null>> {
  const supabase = await createClient();
  const projectRes = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (projectRes.error) return failed(projectRes.error);
  if (!projectRes.data) return { ok: true, data: null };

  const project = mapProject(projectRes.data as ProjectRow);
  const clientRes = await supabase
    .from("clients")
    .select("*")
    .eq("id", project.client_id)
    .maybeSingle();
  if (clientRes.error) return failed(clientRes.error);
  if (!clientRes.data) return { ok: true, data: null };

  return {
    ok: true,
    data: { project, client: mapClient(clientRes.data as ClientRow) },
  };
}

export async function getPortalHome(clientId: string): Promise<
  QueryResult<{
    client: ClientRecord;
    payments: PaymentRecord[];
    reports: ReportRecord[];
    invoices: InvoiceRecord[];
    paymentMethods: PaymentMethodRecord[];
  } | null>
> {
  const supabase = await createClient();
  const [clientRes, paymentsRes, reportsRes, invoicesRes, methodsRes] = await Promise.all([
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
    supabase
      .from("invoices")
      .select("*")
      .eq("client_id", clientId)
      .in("status", ["sent", "paid", "failed"])
      .order("created_at", { ascending: false }),
    supabase
      .from("payment_methods")
      .select("*")
      .eq("client_id", clientId)
      .eq("status", "active")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  if (clientRes.error) return failed(clientRes.error);
  if (paymentsRes.error) return failed(paymentsRes.error);
  if (reportsRes.error) return failed(reportsRes.error);
  const invoicesMissing = Boolean(invoicesRes.error && isSchemaError(invoicesRes.error));
  if (invoicesRes.error && !invoicesMissing) return failed(invoicesRes.error);
  const methodsMissing = Boolean(methodsRes.error && isSchemaError(methodsRes.error));
  if (methodsRes.error && !methodsMissing) return failed(methodsRes.error);
  if (!clientRes.data) return { ok: true, data: null };

  return {
    ok: true,
    data: {
      client: mapClient(clientRes.data as ClientRow),
      payments: ((paymentsRes.data ?? []) as PaymentRow[]).map(mapPayment),
      reports: ((reportsRes.data ?? []) as ReportRow[]).map(mapReport),
      invoices: invoicesMissing
        ? []
        : ((invoicesRes.data ?? []) as InvoiceRow[]).map(mapInvoice),
      paymentMethods: methodsMissing
        ? []
        : ((methodsRes.data ?? []) as PaymentMethodRow[]).map(mapPaymentMethod),
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
