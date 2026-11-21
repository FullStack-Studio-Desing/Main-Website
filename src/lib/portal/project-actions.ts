"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { isSchemaError } from "@/lib/portal/errors";
import { requireAdmin } from "@/lib/portal/session";
import type {
  ActionState,
  ProjectUpdateKind,
  TaskPriority,
  TaskStatus,
} from "@/lib/portal/types";
import { isUuid } from "@/lib/portal/validators";

// Limits mirror the CHECK constraints in 20261121120000_project_tasks_updates_invoice_links.sql.
const TASK_TITLE_MAX = 200;
const TASK_DETAILS_MAX = 4000;
const UPDATE_BODY_MAX = 8000;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const taskStatuses: TaskStatus[] = ["todo", "in_progress", "blocked", "done"];
const taskPriorities: TaskPriority[] = ["low", "normal", "high", "urgent"];
const updateKinds: ProjectUpdateKind[] = ["note", "milestone", "blocker", "delivery"];

const MIGRATION_ERROR = "Run the project tasks SQL migration, then try again.";

async function adminContext(): Promise<{ userId: string } | { error: string }> {
  if (!isSupabaseConfigured()) return { error: "Supabase is not connected yet." };
  const session = await requireAdmin();
  if (session.kind === "ready") return { userId: session.userId };
  if (session.kind === "schema") return { error: "Run the portal SQL migration, then try again." };
  if (session.kind === "needs-promotion") return { error: "This account is not an admin yet." };
  return { error: "The portal is not ready yet." };
}

function safeDbError(error: { code?: string; message?: string } | null, fallback: string): ActionState {
  if (!error) return { error: fallback };
  console.error(`[portal] ${fallback}`, error.message ?? "unknown");
  if (isSchemaError(error)) return { error: MIGRATION_ERROR };
  return { error: fallback };
}

function raw(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function oneOf<T extends string>(value: string, allowed: readonly T[]): T | null {
  return allowed.includes(value as T) ? (value as T) : null;
}

function revalidateProject(projectId: string) {
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/admin/projects");
  revalidatePath("/portal");
}

function parseTask(formData: FormData) {
  const title = raw(formData, "title");
  const details = String(formData.get("details") ?? "").trim();
  const priority = oneOf(raw(formData, "priority") || "normal", taskPriorities);
  const statusRaw = raw(formData, "status");
  const status = statusRaw ? oneOf(statusRaw, taskStatuses) : null;
  const due = raw(formData, "due_on");

  if (!title) return { error: "Enter a task title." };
  if (title.length > TASK_TITLE_MAX) return { error: `Keep the title under ${TASK_TITLE_MAX} characters.` };
  if (details.length > TASK_DETAILS_MAX) {
    return { error: `Keep the details under ${TASK_DETAILS_MAX} characters.` };
  }
  if (!priority) return { error: "Choose a task priority." };
  if (statusRaw && !status) return { error: "Choose a task status." };
  if (due && !DATE_RE.test(due)) return { error: "Enter a valid due date." };

  return {
    value: {
      title,
      details: details || null,
      priority,
      due_on: due || null,
    },
    status,
  };
}

function parseUpdate(formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  const kind = oneOf(raw(formData, "kind") || "note", updateKinds);
  const visible = formData.get("visible_to_client");

  if (!body) return { error: "Write the update first." };
  if (body.length > UPDATE_BODY_MAX) return { error: `Keep updates under ${UPDATE_BODY_MAX} characters.` };
  if (!kind) return { error: "Choose an update type." };

  return {
    value: {
      body,
      kind,
      visible_to_client: visible === "on" || visible === "true",
    },
  };
}

// The client_id always comes from the project row, never from the form.
async function loadProject(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, client_id")
    .eq("id", projectId)
    .maybeSingle();
  if (error) return { error: safeDbError(error, "The project could not be loaded.")?.error ?? "" };
  if (!data) return { error: "That project could not be found." };
  return { project: data as { id: string; client_id: string } };
}

async function loadRow(table: "project_tasks" | "project_updates", id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .select("id, project_id")
    .eq("id", id)
    .maybeSingle();
  if (error) return { error: safeDbError(error, "That item could not be loaded.")?.error ?? "" };
  if (!data) return { error: "That item could not be found." };
  return { row: data as { id: string; project_id: string } };
}

function completedAt(status: TaskStatus) {
  return status === "done" ? new Date().toISOString() : null;
}

export async function createTask(
  projectId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const gate = await adminContext();
  if ("error" in gate) return gate;
  if (!isUuid(projectId)) return { error: "That project could not be found." };
  const parsed = parseTask(formData);
  if ("error" in parsed) return parsed;

  const found = await loadProject(projectId);
  if ("error" in found) return { error: found.error };

  const status = parsed.status ?? "todo";
  const supabase = await createClient();
  const { error } = await supabase.from("project_tasks").insert({
    ...parsed.value,
    status,
    completed_at: completedAt(status),
    project_id: found.project.id,
    client_id: found.project.client_id,
    created_by: gate.userId,
  });
  if (error) return safeDbError(error, "The task could not be saved.");
  revalidateProject(projectId);
  return { notice: "Task added." };
}

export async function updateTask(
  taskId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const gate = await adminContext();
  if ("error" in gate) return gate;
  if (!isUuid(taskId)) return { error: "That task could not be found." };
  const parsed = parseTask(formData);
  if ("error" in parsed) return parsed;

  const found = await loadRow("project_tasks", taskId);
  if ("error" in found) return { error: found.error };

  const patch: Record<string, unknown> = { ...parsed.value };
  if (parsed.status) {
    patch.status = parsed.status;
    patch.completed_at = completedAt(parsed.status);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("project_tasks").update(patch).eq("id", taskId);
  if (error) return safeDbError(error, "The task could not be saved.");
  revalidateProject(found.row.project_id);
  return { notice: "Task saved." };
}

export async function setTaskStatus(taskId: string, status: TaskStatus): Promise<ActionState> {
  const gate = await adminContext();
  if ("error" in gate) return gate;
  if (!isUuid(taskId)) return { error: "That task could not be found." };
  const next = oneOf(status, taskStatuses);
  if (!next) return { error: "Choose a task status." };

  const found = await loadRow("project_tasks", taskId);
  if ("error" in found) return { error: found.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("project_tasks")
    .update({ status: next, completed_at: completedAt(next) })
    .eq("id", taskId);
  if (error) return safeDbError(error, "The task could not be updated.");
  revalidateProject(found.row.project_id);
  return null;
}

export async function deleteTask(taskId: string): Promise<ActionState> {
  const gate = await adminContext();
  if ("error" in gate) return gate;
  if (!isUuid(taskId)) return { error: "That task could not be found." };

  const found = await loadRow("project_tasks", taskId);
  if ("error" in found) return { error: found.error };

  const supabase = await createClient();
  const { error } = await supabase.from("project_tasks").delete().eq("id", taskId);
  if (error) return safeDbError(error, "The task could not be deleted.");
  revalidateProject(found.row.project_id);
  return null;
}

export async function createUpdate(
  projectId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const gate = await adminContext();
  if ("error" in gate) return gate;
  if (!isUuid(projectId)) return { error: "That project could not be found." };
  const parsed = parseUpdate(formData);
  if ("error" in parsed) return parsed;

  const found = await loadProject(projectId);
  if ("error" in found) return { error: found.error };

  const supabase = await createClient();
  const { error } = await supabase.from("project_updates").insert({
    ...parsed.value,
    project_id: found.project.id,
    client_id: found.project.client_id,
    created_by: gate.userId,
  });
  if (error) return safeDbError(error, "The update could not be posted.");
  revalidateProject(projectId);
  return { notice: parsed.value.visible_to_client ? "Update posted to the client." : "Update posted." };
}

export async function updateUpdate(
  updateId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const gate = await adminContext();
  if ("error" in gate) return gate;
  if (!isUuid(updateId)) return { error: "That update could not be found." };
  const parsed = parseUpdate(formData);
  if ("error" in parsed) return parsed;

  const found = await loadRow("project_updates", updateId);
  if ("error" in found) return { error: found.error };

  const supabase = await createClient();
  const { error } = await supabase.from("project_updates").update(parsed.value).eq("id", updateId);
  if (error) return safeDbError(error, "The update could not be saved.");
  revalidateProject(found.row.project_id);
  return { notice: "Update saved." };
}

export async function deleteUpdate(updateId: string): Promise<ActionState> {
  const gate = await adminContext();
  if ("error" in gate) return gate;
  if (!isUuid(updateId)) return { error: "That update could not be found." };

  const found = await loadRow("project_updates", updateId);
  if ("error" in found) return { error: found.error };

  const supabase = await createClient();
  const { error } = await supabase.from("project_updates").delete().eq("id", updateId);
  if (error) return safeDbError(error, "The update could not be deleted.");
  revalidateProject(found.row.project_id);
  return null;
}
