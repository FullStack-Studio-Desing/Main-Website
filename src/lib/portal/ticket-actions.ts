"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSchemaError } from "@/lib/portal/errors";
import { requireAdmin, requireClient } from "@/lib/portal/session";
import type {
  ActionState,
  TicketActionState,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/lib/portal/types";
import { isUuid } from "@/lib/portal/validators";
import { ticketRateLimit } from "@/lib/portal/ticket-rate-limit";
import { deleteObject, headObject, presignPut } from "@/server/storage/r2";
import {
  BLOCKED_EXT,
  sanitizeFileName,
  uploadContentType,
  validateUploadMeta,
  type UploadFileMeta,
} from "@/lib/portal/ticket-limits";
import {
  notifyClientStatusChange,
  notifyClientStudioReply,
  notifyClientTicketReceived,
  notifyStudioClientReopened,
  notifyStudioClientReply,
  notifyStudioClientResolved,
  notifyStudioNewTicket,
} from "@/server/billing/ticket-mail";

const MIGRATION_ERROR = "Run the support tickets SQL migration, then try again.";
const TITLE_MIN = 3;
const TITLE_MAX = 140;
const DESC_MIN = 10;
const DESC_MAX = 8000;
const BODY_MAX = 8000;

/** Status changes the client is emailed about. Others stay in the portal only. */
const clientEmailStatuses: TicketStatus[] = ["awaiting_client", "resolved", "closed"];

const ticketStatuses: TicketStatus[] = [
  "open",
  "awaiting_studio",
  "awaiting_client",
  "in_progress",
  "resolved",
  "closed",
];
const clientPriorities: TicketPriority[] = ["low", "normal", "high"];
const allPriorities: TicketPriority[] = ["low", "normal", "high", "urgent"];
const categories: TicketCategory[] = [
  "bug",
  "change_request",
  "question",
  "content_update",
  "billing",
  "account",
  "other",
];

function gateClientError(session: Awaited<ReturnType<typeof requireClient>>): ActionState {
  if (session.kind === "unconfigured") return { error: "Supabase is not connected yet." };
  if (session.kind === "schema") return { error: MIGRATION_ERROR };
  if (session.kind === "no-profile" || session.kind === "needs-promotion") {
    return { error: "This login is not linked to a client company yet." };
  }
  return { error: "The portal is not ready yet." };
}

function gateAdminError(session: Awaited<ReturnType<typeof requireAdmin>>): ActionState {
  if (session.kind === "unconfigured") return { error: "Supabase is not connected yet." };
  if (session.kind === "schema") return { error: MIGRATION_ERROR };
  if (session.kind === "needs-promotion") return { error: "This account is not an admin yet." };
  return { error: "The portal is not ready yet." };
}

async function clientGate(): Promise<
  { userId: string; clientId: string } | { error: string }
> {
  const session = await requireClient();
  if (session.kind !== "ready") {
    const state = gateClientError(session);
    return { error: state?.error ?? "The portal is not ready yet." };
  }
  if (!session.profile.client_id) {
    return { error: "This login is not linked to a client company yet." };
  }
  return { userId: session.userId, clientId: session.profile.client_id };
}

async function adminGate(): Promise<{ userId: string } | { error: string }> {
  const session = await requireAdmin();
  if (session.kind !== "ready") {
    const state = gateAdminError(session);
    return { error: state?.error ?? "The portal is not ready yet." };
  }
  return { userId: session.userId };
}

function safeDbError(error: { code?: string; message?: string } | null, fallback: string): ActionState {
  if (!error) return { error: fallback };
  console.error("[tickets]", error.message ?? fallback);
  if (isSchemaError(error)) return { error: MIGRATION_ERROR };
  return { error: fallback };
}

function raw(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function oneOf<T extends string>(value: string, allowed: readonly T[]): T | null {
  return allowed.includes(value as T) ? (value as T) : null;
}

function revalidateTicketPaths(number: string, clientId?: string) {
  revalidatePath("/portal/tickets");
  revalidatePath(`/portal/tickets/${number}`);
  revalidatePath("/admin/tickets");
  revalidatePath(`/admin/tickets/${number}`);
  revalidatePath("/portal");
  revalidatePath("/admin");
  if (clientId) revalidatePath(`/admin/clients/${clientId}`);
}

async function verifyProject(
  clientId: string,
  projectId: string | null,
): Promise<{ value: string | null } | { error: string }> {
  if (!projectId) return { value: null };
  if (!isUuid(projectId)) return { error: "That project could not be found." };
  const supabase = await createClient();
  const project = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("client_id", clientId)
    .maybeSingle();
  if (project.error || !project.data) {
    return { error: "That project could not be found." };
  }
  return { value: projectId };
}

async function loadTicketForClient(
  clientId: string,
  ticketId: string,
): Promise<{ ticket: { id: string; number: string; client_id: string; status: string } } | { error: string }> {
  const supabase = await createClient();
  const res = await supabase
    .from("tickets")
    .select("id, number, client_id, status")
    .eq("id", ticketId)
    .eq("client_id", clientId)
    .maybeSingle();
  if (res.error) {
    const state = safeDbError(res.error, "That ticket could not be loaded.");
    return { error: state?.error ?? "That ticket could not be loaded." };
  }
  if (!res.data) return { error: "That ticket could not be found." };
  return { ticket: res.data as { id: string; number: string; client_id: string; status: string } };
}

type LoadedTicket = {
  id: string;
  number: string;
  client_id: string;
  status: string;
  project_id: string | null;
};

type LoadTicketResult = { ticket: LoadedTicket } | { error: string };

async function loadTicketByNumber(number: string): Promise<LoadTicketResult> {
  const supabase = await createClient();
  const res = await supabase
    .from("tickets")
    .select("id, number, client_id, status, project_id")
    .eq("number", number.trim())
    .maybeSingle();
  if (res.error) {
    const state = safeDbError(res.error, "That ticket could not be loaded.");
    return { error: state?.error ?? "That ticket could not be loaded." };
  }
  if (!res.data) return { error: "That ticket could not be found." };
  return { ticket: res.data as LoadedTicket };
}

async function clientUpdateTicket(
  ticketId: string,
  patch: Record<string, unknown>,
): Promise<ActionState | null> {
  if (!hasServiceRole()) {
    return { error: "Ticket updates need SUPABASE_SERVICE_ROLE_KEY on the server." };
  }
  const admin = createAdminClient();
  const res = await admin.from("tickets").update(patch).eq("id", ticketId);
  if (res.error) return safeDbError(res.error, "The ticket could not be updated.");
  return null;
}

async function insertSystemEvent(
  ticketId: string,
  clientId: string,
  event: Record<string, unknown>,
) {
  const supabase = await createClient();
  await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    client_id: clientId,
    author_role: "system",
    kind: "event",
    body: null,
    event,
  });
}

function parseNewTicket(formData: FormData) {
  const title = raw(formData, "title");
  const description = String(formData.get("description") ?? "").trim();
  const category = oneOf(raw(formData, "category") || "question", categories);
  const priority = oneOf(raw(formData, "priority") || "normal", clientPriorities);
  const projectRaw = raw(formData, "project_id");

  if (title.length < TITLE_MIN) return { error: "Enter a title with at least 3 characters." };
  if (title.length > TITLE_MAX) return { error: `Keep the title under ${TITLE_MAX} characters.` };
  if (description.length < DESC_MIN) return { error: "Add a description with at least 10 characters." };
  if (description.length > DESC_MAX) return { error: `Keep the description under ${DESC_MAX} characters.` };
  if (!category) return { error: "Choose a category." };
  if (!priority) return { error: "Choose a priority." };

  return {
    value: {
      title,
      description,
      category,
      priority,
      project_id: projectRaw || null,
    },
  };
}

async function clientEmail(clientId: string) {
  const supabase = await createClient();
  const res = await supabase.from("clients").select("company_name, email").eq("id", clientId).maybeSingle();
  if (!res.data) return null;
  return res.data as { company_name: string; email: string };
}

export async function createTicket(
  _prev: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  const gate = await clientGate();
  if ("error" in gate) return gate;
  if (!ticketRateLimit(`create:${gate.userId}`, 10, 60 * 60 * 1000)) {
    return { error: "Too many tickets opened recently. Try again in a little while." };
  }

  const parsed = parseNewTicket(formData);
  if ("error" in parsed) return parsed;

  const project = await verifyProject(gate.clientId, parsed.value.project_id);
  if ("error" in project) return project;

  const supabase = await createClient();
  const insert = await supabase
    .from("tickets")
    .insert({
      client_id: gate.clientId,
      project_id: project.value,
      category: parsed.value.category,
      title: parsed.value.title,
      description: parsed.value.description,
      priority: parsed.value.priority,
      status: "open",
      created_by: gate.userId,
    })
    .select("id, number")
    .single();

  if (insert.error) return safeDbError(insert.error, "The ticket could not be opened.");
  const number = String(insert.data.number);
  const ticketId = String(insert.data.id);

  const firstMessage = await supabase
    .from("ticket_messages")
    .insert({
      ticket_id: ticketId,
      client_id: gate.clientId,
      author_id: gate.userId,
      author_role: "client",
      kind: "reply",
      body: parsed.value.description,
    })
    .select("id")
    .single();

  const company = await clientEmail(gate.clientId);
  if (company) {
    after(() =>
      Promise.all([
        notifyStudioNewTicket({
          number,
          companyName: company.company_name,
          title: parsed.value.title,
          description: parsed.value.description,
        }),
        notifyClientTicketReceived({
          number,
          to: [company.email],
          title: parsed.value.title,
        }),
      ]),
    );
  }

  revalidateTicketPaths(number, gate.clientId);
  return {
    notice: `Ticket ${number} opened.`,
    number,
    ticketId,
    messageId: firstMessage.data ? String(firstMessage.data.id) : undefined,
  };
}

export async function replyToTicket(
  ticketNumber: string,
  _prev: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  const gate = await clientGate();
  if ("error" in gate) return gate;
  if (!ticketRateLimit(`reply:client:${gate.userId}`, 30, 60 * 60 * 1000)) {
    return { error: "Too many replies. Slow down and try again shortly." };
  }

  const body = String(formData.get("body") ?? "").trim();
  const hasFiles = raw(formData, "has_attachments") === "1";
  if (!body && !hasFiles) return { error: "Write a reply or attach a file first." };
  if (body.length > BODY_MAX) return { error: `Keep replies under ${BODY_MAX} characters.` };

  const loaded = await loadTicketByNumber(ticketNumber);
  if ("error" in loaded) return { error: loaded.error };
  if (loaded.ticket.client_id !== gate.clientId) return { error: "That ticket could not be found." };
  if (loaded.ticket.status === "closed") {
    return { error: "This ticket is closed. Open a new ticket instead." };
  }

  const supabase = await createClient();
  const message = await supabase
    .from("ticket_messages")
    .insert({
      ticket_id: loaded.ticket.id,
      client_id: gate.clientId,
      author_id: gate.userId,
      author_role: "client",
      kind: "reply",
      body: body || null,
    })
    .select("id")
    .single();
  if (message.error) return safeDbError(message.error, "The reply could not be sent.");

  const nextStatus =
    loaded.ticket.status === "in_progress"
      ? "in_progress"
      : loaded.ticket.status === "resolved"
        ? "awaiting_studio"
        : "awaiting_studio";

  const patch: Record<string, unknown> = {
    status: nextStatus,
    last_message_at: new Date().toISOString(),
  };
  if (loaded.ticket.status === "resolved") {
    patch.resolved_at = null;
  }

  const updateError = await clientUpdateTicket(loaded.ticket.id, patch);
  if (updateError) return updateError;

  const company = await clientEmail(gate.clientId);
  if (company) {
    after(() =>
      notifyStudioClientReply({
        number: loaded.ticket.number,
        companyName: company.company_name,
        body: body || "Sent files.",
      }),
    );
  }

  revalidateTicketPaths(loaded.ticket.number, gate.clientId);
  return {
    notice: "Reply sent.",
    number: loaded.ticket.number,
    ticketId: loaded.ticket.id,
    messageId: String(message.data.id),
  };
}

export async function resolveTicket(ticketNumber: string): Promise<ActionState> {
  const gate = await clientGate();
  if ("error" in gate) return gate;

  const loaded = await loadTicketByNumber(ticketNumber);
  if ("error" in loaded) return { error: loaded.error };
  if (loaded.ticket.client_id !== gate.clientId) return { error: "That ticket could not be found." };
  if (loaded.ticket.status === "closed") return { error: "This ticket is already closed." };

  const now = new Date().toISOString();
  const updateError = await clientUpdateTicket(loaded.ticket.id, {
    status: "resolved",
    resolved_at: now,
  });
  if (updateError) return updateError;

  await insertSystemEvent(loaded.ticket.id, gate.clientId, {
    type: "status",
    from: loaded.ticket.status,
    to: "resolved",
  });

  const company = await clientEmail(gate.clientId);
  if (company) {
    after(() =>
      notifyStudioClientResolved({
        number: loaded.ticket.number,
        companyName: company.company_name,
      }),
    );
  }

  revalidateTicketPaths(loaded.ticket.number, gate.clientId);
  return { notice: `${loaded.ticket.number} is marked resolved.` };
}

export async function reopenTicket(ticketNumber: string): Promise<ActionState> {
  const gate = await clientGate();
  if ("error" in gate) return gate;

  const loaded = await loadTicketByNumber(ticketNumber);
  if ("error" in loaded) return { error: loaded.error };
  if (loaded.ticket.client_id !== gate.clientId) return { error: "That ticket could not be found." };
  if (loaded.ticket.status !== "resolved" && loaded.ticket.status !== "closed") {
    return { error: "Only resolved or closed tickets can be reopened." };
  }

  const updateError = await clientUpdateTicket(loaded.ticket.id, {
    status: "awaiting_studio",
    resolved_at: null,
    closed_at: null,
  });
  if (updateError) return updateError;

  await insertSystemEvent(loaded.ticket.id, gate.clientId, {
    type: "status",
    from: loaded.ticket.status,
    to: "awaiting_studio",
  });

  const company = await clientEmail(gate.clientId);
  if (company) {
    after(() =>
      notifyStudioClientReopened({
        number: loaded.ticket.number,
        companyName: company.company_name,
      }),
    );
  }

  revalidateTicketPaths(loaded.ticket.number, gate.clientId);
  return { notice: `${loaded.ticket.number} was reopened.` };
}

export async function markTicketRead(
  ticketNumber: string,
  side: "client" | "studio",
): Promise<ActionState> {
  const now = new Date().toISOString();
  const loaded = await loadTicketByNumber(ticketNumber);
  if ("error" in loaded) return { error: loaded.error };

  if (side === "client") {
    const gate = await clientGate();
    if ("error" in gate) return gate;
    if (loaded.ticket.client_id !== gate.clientId) return { error: "That ticket could not be found." };
    const err = await clientUpdateTicket(loaded.ticket.id, { client_last_read_at: now });
    if (err) return err;
  } else {
    const gate = await adminGate();
    if ("error" in gate) return gate;
    const err = await clientUpdateTicket(loaded.ticket.id, { studio_last_read_at: now });
    if (err) return err;
  }

  return { notice: "Marked read." };
}

function ticketsR2Ready() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_TICKETS_BUCKET,
  );
}

async function resolveTicketForUpload(
  ticketIdOrDraft: string,
  clientId?: string,
): Promise<
  | { ticketId: string; clientId: string; error?: undefined }
  | { error: string }
> {
  if (ticketIdOrDraft === "draft") {
    return { error: "Save the ticket first, then attach files." };
  }
  if (!isUuid(ticketIdOrDraft)) return { error: "That ticket could not be found." };

  const supabase = await createClient();
  let query = supabase
    .from("tickets")
    .select("id, client_id")
    .eq("id", ticketIdOrDraft);
  if (clientId) query = query.eq("client_id", clientId);
  const res = await query.maybeSingle();
  if (res.error) {
    const state = safeDbError(res.error, "That ticket could not be loaded.");
    return { error: state?.error ?? "That ticket could not be loaded." };
  }
  if (!res.data) return { error: "That ticket could not be found." };
  return { ticketId: String(res.data.id), clientId: String(res.data.client_id) };
}

export async function requestTicketUploads(
  ticketIdOrDraft: string,
  files: UploadFileMeta[],
): Promise<ActionState & { uploads?: { id: string; uploadUrl: string }[] }> {
  const client = await clientGate();
  let userId: string;
  let clientIdForScope: string | undefined;
  if (!("error" in client)) {
    userId = client.userId;
    clientIdForScope = client.clientId;
  } else {
    const admin = await adminGate();
    if ("error" in admin) return { error: client.error };
    userId = admin.userId;
  }

  if (!ticketRateLimit(`upload:${userId}`, 60, 60 * 60 * 1000)) {
    return { error: "Too many uploads recently. Try again in a little while." };
  }

  const validation = validateUploadMeta(files);
  if (validation) return { error: validation };

  if (!ticketsR2Ready()) {
    return {
      error:
        "File uploads are not configured yet. Finish the R2 setup in docs/r2-tickets.md, then try again.",
    };
  }
  if (!hasServiceRole()) {
    return { error: "File uploads need SUPABASE_SERVICE_ROLE_KEY on the server." };
  }

  const scope = await resolveTicketForUpload(ticketIdOrDraft, clientIdForScope);
  if ("error" in scope) return { error: scope.error };

  const db = createAdminClient();
  const uploads: { id: string; uploadUrl: string }[] = [];

  for (const file of files) {
    const safeName = sanitizeFileName(file.name);
    const fileId = randomUUID();
    const r2Key = `tickets/${scope.clientId}/${scope.ticketId}/${fileId}/${safeName}`;
    const contentType = uploadContentType(file.type);

    const row = await db
      .from("ticket_attachments")
      .insert({
        ticket_id: scope.ticketId,
        client_id: scope.clientId,
        uploaded_by: userId,
        r2_key: r2Key,
        file_name: safeName,
        content_type: contentType,
        size_bytes: file.size,
        status: "pending",
      })
      .select("id")
      .single();

    if (row.error || !row.data) {
      const failed = safeDbError(row.error, "Could not start the upload.");
      return { error: failed?.error ?? "Could not start the upload." };
    }

    try {
      const uploadUrl = await presignPut(r2Key, contentType, file.size);
      uploads.push({ id: String(row.data.id), uploadUrl });
    } catch (error) {
      console.error("[tickets] presign failed", error);
      await db.from("ticket_attachments").delete().eq("id", row.data.id);
      return { error: "Could not sign the upload URL. Check R2 credentials." };
    }
  }

  return { notice: "Upload URLs ready.", uploads };
}

export async function confirmTicketUploads(
  attachmentIds: string[],
  messageId: string,
): Promise<ActionState & { confirmed?: number }> {
  const client = await clientGate();
  let userId: string;
  if (!("error" in client)) {
    userId = client.userId;
  } else {
    const admin = await adminGate();
    if ("error" in admin) return { error: client.error };
    userId = admin.userId;
  }

  if (!attachmentIds.length) return { error: "No attachments to confirm." };
  if (!isUuid(messageId)) return { error: "That message could not be found." };
  if (!ticketsR2Ready()) {
    return { error: "File uploads are not configured yet." };
  }
  if (!hasServiceRole()) {
    return { error: "File uploads need SUPABASE_SERVICE_ROLE_KEY on the server." };
  }

  const db = createAdminClient();
  const clientId = "error" in client ? undefined : client.clientId;

  // Files may only hang off a real message on the same ticket; clients only on their own messages.
  const messageRes = await db
    .from("ticket_messages")
    .select("id, ticket_id, client_id, author_id, kind")
    .eq("id", messageId)
    .maybeSingle();
  const message = messageRes.data;
  if (messageRes.error || !message || message.kind === "event") {
    return { error: "That message could not be found." };
  }
  if (clientId && (message.client_id !== clientId || message.author_id !== userId)) {
    return { error: "That message could not be found." };
  }

  let confirmed = 0;
  for (const rawId of attachmentIds) {
    if (!isUuid(rawId)) continue;
    let query = db
      .from("ticket_attachments")
      .select("id, ticket_id, r2_key, size_bytes, content_type, client_id, status")
      .eq("id", rawId);
    if (clientId) query = query.eq("client_id", clientId);
    const row = await query.maybeSingle();
    if (row.error || !row.data || row.data.status !== "pending") continue;
    if (row.data.ticket_id !== message.ticket_id) continue;

    try {
      const head = await headObject(String(row.data.r2_key));
      const remoteSize = head.ContentLength;
      const remoteType = head.ContentType ?? "";
      const expected = Number(row.data.size_bytes);
      if (remoteSize == null || remoteSize !== expected) {
        await deleteObject(String(row.data.r2_key));
        await db.from("ticket_attachments").update({ status: "rejected" }).eq("id", rawId);
        continue;
      }
      if (remoteType && BLOCKED_EXT.test(`.${remoteType.split("/").pop() ?? ""}`)) {
        await deleteObject(String(row.data.r2_key));
        await db.from("ticket_attachments").update({ status: "rejected" }).eq("id", rawId);
        continue;
      }
      await db
        .from("ticket_attachments")
        .update({
          status: "ready",
          message_id: message.id,
          content_type: remoteType || String(row.data.content_type),
          size_bytes: remoteSize,
        })
        .eq("id", rawId);
      confirmed += 1;
    } catch (error) {
      console.error("[tickets] confirm upload failed", rawId, error);
      await db.from("ticket_attachments").update({ status: "rejected" }).eq("id", rawId);
    }
  }

  return { notice: "Uploads confirmed.", confirmed };
}

export async function adminReply(
  ticketNumber: string,
  _prev: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  const gate = await adminGate();
  if ("error" in gate) return gate;

  const body = String(formData.get("body") ?? "").trim();
  const kind = raw(formData, "kind") === "internal_note" ? "internal_note" : "reply";
  const statusRaw = raw(formData, "status");

  const hasFiles = raw(formData, "has_attachments") === "1";
  if (!body && !hasFiles) return { error: "Write a message or attach a file first." };
  if (body.length > BODY_MAX) return { error: `Keep messages under ${BODY_MAX} characters.` };

  const loaded = await loadTicketByNumber(ticketNumber);
  if ("error" in loaded) return { error: loaded.error };

  const supabase = await createClient();
  const message = await supabase
    .from("ticket_messages")
    .insert({
      ticket_id: loaded.ticket.id,
      client_id: loaded.ticket.client_id,
      author_id: gate.userId,
      author_role: "admin",
      kind,
      body: body || null,
    })
    .select("id")
    .single();
  if (message.error) return safeDbError(message.error, "The message could not be saved.");

  if (kind === "reply") {
    const next =
      statusRaw && oneOf(statusRaw, ticketStatuses)
        ? statusRaw
        : ("awaiting_client" as TicketStatus);
    const updateError = await clientUpdateTicket(loaded.ticket.id, {
      status: next,
      last_message_at: new Date().toISOString(),
    });
    if (updateError) return updateError;

    if (next !== loaded.ticket.status) {
      await insertSystemEvent(loaded.ticket.id, loaded.ticket.client_id, {
        type: "status",
        from: loaded.ticket.status,
        to: next,
      });
    }

    // One email per action: the reply email carries the status, so no separate status email.
    const company = await clientEmail(loaded.ticket.client_id);
    if (company) {
      after(() =>
        notifyClientStudioReply({
          number: loaded.ticket.number,
          to: [company.email],
          projectName: null,
          body: body || "The studio sent you files.",
          status: next === "resolved" || next === "closed" ? next : null,
        }),
      );
    }
  }

  revalidateTicketPaths(loaded.ticket.number, loaded.ticket.client_id);
  return {
    notice: kind === "internal_note" ? "Internal note saved." : "Reply sent.",
    number: loaded.ticket.number,
    ticketId: loaded.ticket.id,
    messageId: String(message.data.id),
  };
}

async function emailClientStatus(ticket: LoadedTicket, next: TicketStatus) {
  if (!clientEmailStatuses.includes(next)) return;
  const company = await clientEmail(ticket.client_id);
  if (!company) return;
  after(() =>
    notifyClientStatusChange({
      number: ticket.number,
      to: [company.email],
      status: next as "awaiting_client" | "resolved" | "closed",
    }),
  );
}

export async function setTicketStatus(ticketNumber: string, status: string): Promise<ActionState> {
  const gate = await adminGate();
  if ("error" in gate) return gate;
  const next = oneOf(status, ticketStatuses);
  if (!next) return { error: "Choose a valid status." };

  const loaded = await loadTicketByNumber(ticketNumber);
  if ("error" in loaded) return { error: loaded.error };
  if (loaded.ticket.status === next) return { notice: "Status unchanged." };

  const patch: Record<string, unknown> = { status: next };
  const now = new Date().toISOString();
  if (next === "resolved") patch.resolved_at = now;
  if (next === "closed") patch.closed_at = now;
  if (next !== "resolved") patch.resolved_at = null;
  if (next !== "closed") patch.closed_at = null;

  const updateError = await clientUpdateTicket(loaded.ticket.id, patch);
  if (updateError) return updateError;

  await insertSystemEvent(loaded.ticket.id, loaded.ticket.client_id, {
    type: "status",
    from: loaded.ticket.status,
    to: next,
  });

  await emailClientStatus(loaded.ticket, next);

  revalidateTicketPaths(loaded.ticket.number, loaded.ticket.client_id);
  return { notice: `Status set to ${next.replace(/_/g, " ")}.` };
}

export async function setTicketPriority(ticketNumber: string, priority: string): Promise<ActionState> {
  const gate = await adminGate();
  if ("error" in gate) return gate;
  const next = oneOf(priority, allPriorities);
  if (!next) return { error: "Choose a valid priority." };

  const loaded = await loadTicketByNumber(ticketNumber);
  if ("error" in loaded) return { error: loaded.error };

  const updateError = await clientUpdateTicket(loaded.ticket.id, { priority: next });
  if (updateError) return updateError;

  revalidateTicketPaths(loaded.ticket.number, loaded.ticket.client_id);
  return { notice: `Priority set to ${next}.` };
}

export async function assignTicket(ticketNumber: string, assigneeId: string): Promise<ActionState> {
  const gate = await adminGate();
  if ("error" in gate) return gate;

  const loaded = await loadTicketByNumber(ticketNumber);
  if ("error" in loaded) return { error: loaded.error };

  const value = assigneeId.trim() ? assigneeId.trim() : null;
  if (value && !isUuid(value)) return { error: "Choose a valid assignee." };

  const updateError = await clientUpdateTicket(loaded.ticket.id, { assigned_to: value });
  if (updateError) return updateError;

  revalidateTicketPaths(loaded.ticket.number, loaded.ticket.client_id);
  return { notice: value ? "Ticket assigned." : "Assignee cleared." };
}

export async function setTicketCategory(ticketNumber: string, category: string): Promise<ActionState> {
  const gate = await adminGate();
  if ("error" in gate) return gate;
  const next = oneOf(category, categories);
  if (!next) return { error: "Choose a valid category." };

  const loaded = await loadTicketByNumber(ticketNumber);
  if ("error" in loaded) return { error: loaded.error };

  const updateError = await clientUpdateTicket(loaded.ticket.id, { category: next });
  if (updateError) return updateError;

  revalidateTicketPaths(loaded.ticket.number, loaded.ticket.client_id);
  return { notice: "Category updated." };
}

export async function bulkUpdateTickets(
  ticketNumbers: string[],
  patch: { status?: string; assigned_to?: string },
): Promise<ActionState> {
  const gate = await adminGate();
  if ("error" in gate) return gate;
  if (!ticketNumbers.length) return { error: "Select at least one ticket." };

  let status: TicketStatus | undefined;
  if (patch.status) {
    const next = oneOf(patch.status, ticketStatuses);
    if (!next) return { error: "Choose a valid status." };
    status = next;
  }

  let assignee: string | null | undefined;
  if (patch.assigned_to !== undefined) {
    const rawAssignee = patch.assigned_to.trim();
    assignee = rawAssignee ? rawAssignee : null;
    if (assignee && !isUuid(assignee)) return { error: "Choose a valid assignee." };
  }

  for (const number of ticketNumbers) {
    const loaded = await loadTicketByNumber(number);
    if ("error" in loaded) continue;
    const rowPatch: Record<string, unknown> = {};
    const statusChanged = Boolean(status && status !== loaded.ticket.status);
    if (statusChanged) rowPatch.status = status;
    if (assignee !== undefined) rowPatch.assigned_to = assignee;
    if (!Object.keys(rowPatch).length) continue;
    const updateError = await clientUpdateTicket(loaded.ticket.id, rowPatch);
    if (updateError) continue;
    if (statusChanged && status) {
      await insertSystemEvent(loaded.ticket.id, loaded.ticket.client_id, {
        type: "status",
        from: loaded.ticket.status,
        to: status,
      });
      await emailClientStatus(loaded.ticket, status);
    }
    revalidateTicketPaths(number, loaded.ticket.client_id);
  }

  revalidatePath("/admin/tickets");
  return { notice: "Bulk update finished." };
}

export async function adminCreateTicket(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const gate = await adminGate();
  if ("error" in gate) return gate;

  const clientId = raw(formData, "client_id");
  if (!isUuid(clientId)) return { error: "Choose a client." };

  const parsed = parseNewTicket(formData);
  if ("error" in parsed) return parsed;

  const project = await verifyProject(clientId, parsed.value.project_id);
  if ("error" in project) return project;

  const supabase = await createClient();
  const insert = await supabase
    .from("tickets")
    .insert({
      client_id: clientId,
      project_id: project.value,
      category: parsed.value.category,
      title: parsed.value.title,
      description: parsed.value.description,
      priority: parsed.value.priority,
      status: "open",
      created_by: gate.userId,
    })
    .select("number")
    .single();

  if (insert.error) return safeDbError(insert.error, "The ticket could not be created.");
  const number = String(insert.data.number);
  revalidateTicketPaths(number, clientId);
  return { notice: `Ticket ${number} created.` };
}

export async function createTaskFromTicket(ticketNumber: string): Promise<ActionState> {
  const gate = await adminGate();
  if ("error" in gate) return gate;

  const loaded = await loadTicketByNumber(ticketNumber);
  if ("error" in loaded) return { error: loaded.error };
  if (!loaded.ticket.project_id) {
    return { error: "Link this ticket to a project before creating a task." };
  }

  const supabase = await createClient();
  const ticketRes = await supabase
    .from("tickets")
    .select("title, description")
    .eq("id", loaded.ticket.id)
    .maybeSingle();
  if (ticketRes.error || !ticketRes.data) {
    return safeDbError(ticketRes.error, "That ticket could not be loaded.");
  }

  const taskInsert = await supabase
    .from("project_tasks")
    .insert({
      project_id: loaded.ticket.project_id,
      client_id: loaded.ticket.client_id,
      title: ticketRes.data.title,
      details: `${ticketRes.data.description}\n\nFrom ticket ${loaded.ticket.number}.`,
      status: "todo",
      priority: "normal",
    })
    .select("id")
    .single();

  if (taskInsert.error) return safeDbError(taskInsert.error, "The task could not be created.");

  const updateError = await clientUpdateTicket(loaded.ticket.id, {
    task_id: taskInsert.data.id,
  });
  if (updateError) return updateError;

  await insertSystemEvent(loaded.ticket.id, loaded.ticket.client_id, {
    type: "task",
    task_id: taskInsert.data.id,
  });

  revalidateTicketPaths(loaded.ticket.number, loaded.ticket.client_id);
  revalidatePath(`/admin/projects/${loaded.ticket.project_id}`);
  return { notice: "Task created from ticket." };
}