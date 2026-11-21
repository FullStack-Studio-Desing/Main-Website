import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isAuthKeyError, isSchemaError } from "@/lib/portal/errors";
import { asNumber } from "@/lib/portal/format";
import { getProject, type QueryResult } from "@/lib/portal/queries";
import type {
  ClientRecord,
  InvoiceBillingType,
  InvoiceRecord,
  InvoiceStatus,
  PaymentRecord,
  PaymentStatus,
  ProjectRecord,
  ProjectStatus,
  ProjectTaskRecord,
  ProjectUpdateKind,
  ProjectUpdateRecord,
  TaskPriority,
  TaskStatus,
} from "@/lib/portal/types";

export type ProjectWorkspace = {
  project: ProjectRecord;
  client: ClientRecord;
  tasks: ProjectTaskRecord[];
  updates: ProjectUpdateRecord[];
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
  // False until the project tasks migration has been applied.
  tasksReady: boolean;
};

export type ProjectActivityItem = ProjectRecord & {
  tasks_total: number;
  tasks_done: number;
  tasks_open: number;
};

export type ClientProjectActivity = {
  projects: ProjectActivityItem[];
  updates: (ProjectUpdateRecord & { project_name: string })[];
};

type TaskRow = {
  id: string;
  project_id: string;
  client_id: string;
  title: string;
  details: string | null;
  status: string;
  priority: string;
  due_on: string | null;
  completed_at: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

type UpdateRow = {
  id: string;
  project_id: string;
  client_id: string;
  kind: string;
  body: string;
  visible_to_client: boolean;
  created_at: string;
  updated_at: string;
};

type InvoiceRow = Omit<InvoiceRecord, "amount" | "billing_type" | "status"> & {
  amount: number | string;
  billing_type: string;
  status: string;
};

type PaymentRow = Omit<PaymentRecord, "amount" | "status"> & {
  amount: number | string;
  status: string;
};

type ProjectRow = Omit<ProjectRecord, "budget" | "status"> & {
  budget: number | string | null;
  status: string;
};

function failed(error: { code?: string; message?: string }): QueryResult<never> {
  console.error("[portal]", error.code ?? "", error.message ?? "query failed");
  if (isSchemaError(error)) return { ok: false, reason: "schema" };
  if (isAuthKeyError(error)) return { ok: false, reason: "auth" };
  return { ok: false, reason: "error" };
}

// Missing tables or columns (migration not applied yet) count as "no rows".
function missing(error: { code?: string; message?: string } | null) {
  return Boolean(error && (isSchemaError(error) || error.code === "42703"));
}

function mapTask(row: TaskRow): ProjectTaskRecord {
  return {
    id: row.id,
    project_id: row.project_id,
    client_id: row.client_id,
    title: row.title,
    details: row.details,
    status: row.status as TaskStatus,
    priority: row.priority as TaskPriority,
    due_on: row.due_on,
    completed_at: row.completed_at,
    sort_order: row.sort_order ?? 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapUpdate(row: UpdateRow): ProjectUpdateRecord {
  return {
    id: row.id,
    project_id: row.project_id,
    client_id: row.client_id,
    kind: row.kind as ProjectUpdateKind,
    body: row.body,
    visible_to_client: Boolean(row.visible_to_client),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapInvoice(row: InvoiceRow): InvoiceRecord {
  return {
    ...row,
    amount: asNumber(row.amount),
    billing_type: row.billing_type as InvoiceBillingType,
    status: row.status as InvoiceStatus,
    project_id: row.project_id ?? null,
  };
}

function mapPayment(row: PaymentRow): PaymentRecord {
  return {
    ...row,
    amount: asNumber(row.amount),
    status: row.status as PaymentStatus,
    invoice_id: row.invoice_id ?? null,
    project_id: row.project_id ?? null,
    mp_order_id: row.mp_order_id ?? null,
  };
}

function mapProject(row: ProjectRow): ProjectRecord {
  return {
    ...row,
    status: row.status as ProjectStatus,
    budget: row.budget === null || row.budget === undefined ? null : asNumber(row.budget),
  };
}

const priorityRank: Record<TaskPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3 };

// Open tasks first (by due date, then priority), finished tasks last.
export function sortTasks(tasks: ProjectTaskRecord[]) {
  return [...tasks].sort((a, b) => {
    const aDone = a.status === "done" ? 1 : 0;
    const bDone = b.status === "done" ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;
    if (aDone) return (b.completed_at ?? "").localeCompare(a.completed_at ?? "");
    const aDue = a.due_on ?? "9999-12-31";
    const bDue = b.due_on ?? "9999-12-31";
    return (
      aDue.localeCompare(bDue) ||
      priorityRank[a.priority] - priorityRank[b.priority] ||
      a.sort_order - b.sort_order ||
      a.created_at.localeCompare(b.created_at)
    );
  });
}

export async function getProjectWorkspace(
  projectId: string,
): Promise<QueryResult<ProjectWorkspace | null>> {
  const base = await getProject(projectId);
  if (!base.ok) return base;
  if (!base.data) return { ok: true, data: null };

  const supabase = await createClient();
  const [tasksRes, updatesRes, invoicesRes, paymentsRes] = await Promise.all([
    supabase
      .from("project_tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("project_updates")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    supabase
      .from("invoices")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    supabase
      .from("payments")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
  ]);

  if (tasksRes.error && !missing(tasksRes.error)) return failed(tasksRes.error);
  if (updatesRes.error && !missing(updatesRes.error)) return failed(updatesRes.error);
  if (invoicesRes.error && !missing(invoicesRes.error)) return failed(invoicesRes.error);
  if (paymentsRes.error && !missing(paymentsRes.error)) return failed(paymentsRes.error);

  return {
    ok: true,
    data: {
      ...base.data,
      tasks: tasksRes.error ? [] : sortTasks(((tasksRes.data ?? []) as TaskRow[]).map(mapTask)),
      updates: updatesRes.error ? [] : ((updatesRes.data ?? []) as UpdateRow[]).map(mapUpdate),
      invoices: invoicesRes.error ? [] : ((invoicesRes.data ?? []) as InvoiceRow[]).map(mapInvoice),
      payments: paymentsRes.error ? [] : ((paymentsRes.data ?? []) as PaymentRow[]).map(mapPayment),
      tasksReady: !tasksRes.error && !updatesRes.error,
    },
  };
}

// Portal view: RLS limits rows to the signed-in client's own projects and to
// updates marked visible_to_client. The explicit filters keep admin previews honest.
export async function getClientProjectActivity(
  clientId: string,
): Promise<QueryResult<ClientProjectActivity>> {
  const supabase = await createClient();
  const [projectsRes, tasksRes, updatesRes] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false }),
    supabase.from("project_tasks").select("project_id, status").eq("client_id", clientId),
    supabase
      .from("project_updates")
      .select("*")
      .eq("client_id", clientId)
      .eq("visible_to_client", true)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (projectsRes.error) {
    if (missing(projectsRes.error)) return { ok: true, data: { projects: [], updates: [] } };
    return failed(projectsRes.error);
  }
  if (tasksRes.error && !missing(tasksRes.error)) return failed(tasksRes.error);
  if (updatesRes.error && !missing(updatesRes.error)) return failed(updatesRes.error);

  const counts = new Map<string, { total: number; done: number }>();
  if (!tasksRes.error) {
    for (const row of (tasksRes.data ?? []) as { project_id: string; status: string }[]) {
      const entry = counts.get(row.project_id) ?? { total: 0, done: 0 };
      entry.total += 1;
      if (row.status === "done") entry.done += 1;
      counts.set(row.project_id, entry);
    }
  }

  const projects = ((projectsRes.data ?? []) as ProjectRow[]).map((row) => {
    const project = mapProject(row);
    const entry = counts.get(project.id) ?? { total: 0, done: 0 };
    return {
      ...project,
      tasks_total: entry.total,
      tasks_done: entry.done,
      tasks_open: entry.total - entry.done,
    };
  });

  const names = new Map(projects.map((project) => [project.id, project.name]));
  const updates = updatesRes.error
    ? []
    : ((updatesRes.data ?? []) as UpdateRow[])
        .map(mapUpdate)
        .filter((update) => names.has(update.project_id))
        .map((update) => ({ ...update, project_name: names.get(update.project_id) ?? "" }));

  return { ok: true, data: { projects, updates } };
}
