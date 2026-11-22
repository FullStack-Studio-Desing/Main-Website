import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isAuthKeyError, isSchemaError } from "@/lib/portal/errors";
import type { QueryResult } from "@/lib/portal/queries";
import type {
  TicketAttachmentRecord,
  TicketAttachmentStatus,
  TicketAuthorRole,
  TicketCategory,
  TicketDetail,
  TicketListItem,
  TicketMessageKind,
  TicketMessageRecord,
  TicketPriority,
  TicketRecord,
  TicketStatus,
} from "@/lib/portal/types";

export type AdminTicketFilters = {
  status?: TicketStatus | "all" | "open_inbox";
  priority?: TicketPriority | "all";
  clientId?: string;
  projectId?: string;
  category?: TicketCategory | "all";
  assigneeId?: string;
  q?: string;
  limit?: number;
};

export type TicketCounts = {
  /** Admin nav: open + awaiting_studio */
  adminInbox: number;
  /** Client nav: tickets where studio replied and client has not read */
  clientUnread: number;
  /** Client: status awaiting_client */
  clientAwaitingYou: number;
  /** Alias for admin dashboards */
  awaitingClient: number;
  open: number;
  awaitingStudio: number;
  resolvedThisWeek: number;
};

const TICKET_COLUMNS =
  "id, number, client_id, project_id, category, title, description, priority, status, assigned_to, task_id, created_by, last_message_at, client_last_read_at, studio_last_read_at, resolved_at, closed_at, created_at, updated_at";

const MESSAGE_COLUMNS =
  "id, ticket_id, client_id, author_id, author_role, kind, body, event, created_at, edited_at";

const ATTACHMENT_COLUMNS =
  "id, ticket_id, message_id, client_id, uploaded_by, file_name, content_type, size_bytes, width, height, status, created_at";

const LIST_PAGE = 25;

function failed(error: { code?: string; message?: string }): QueryResult<never> {
  console.error("[tickets]", error.code ?? "", error.message ?? "query failed");
  if (isSchemaError(error)) return { ok: false, reason: "schema" };
  if (isAuthKeyError(error)) return { ok: false, reason: "auth" };
  return { ok: false, reason: "error" };
}

function attachmentUrl(id: string) {
  return `/api/tickets/attachments/${id}`;
}

type TicketRow = Record<string, unknown>;

function mapTicket(row: TicketRow): TicketRecord {
  return {
    id: String(row.id),
    number: String(row.number),
    client_id: String(row.client_id),
    project_id: row.project_id != null ? String(row.project_id) : null,
    category: String(row.category) as TicketCategory,
    title: String(row.title),
    description: String(row.description),
    priority: String(row.priority) as TicketPriority,
    status: String(row.status) as TicketStatus,
    assigned_to: row.assigned_to != null ? String(row.assigned_to) : null,
    task_id: row.task_id != null ? String(row.task_id) : null,
    created_by: row.created_by != null ? String(row.created_by) : null,
    last_message_at: String(row.last_message_at),
    client_last_read_at: row.client_last_read_at != null ? String(row.client_last_read_at) : null,
    studio_last_read_at: row.studio_last_read_at != null ? String(row.studio_last_read_at) : null,
    resolved_at: row.resolved_at != null ? String(row.resolved_at) : null,
    closed_at: row.closed_at != null ? String(row.closed_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapMessage(row: TicketRow): TicketMessageRecord {
  return {
    id: String(row.id),
    ticket_id: String(row.ticket_id),
    client_id: String(row.client_id),
    author_id: row.author_id != null ? String(row.author_id) : null,
    author_role: String(row.author_role) as TicketAuthorRole,
    kind: String(row.kind) as TicketMessageKind,
    body: row.body != null ? String(row.body) : null,
    event: row.event && typeof row.event === "object" ? (row.event as Record<string, unknown>) : null,
    created_at: String(row.created_at),
    edited_at: row.edited_at != null ? String(row.edited_at) : null,
  };
}

function mapAttachment(row: TicketRow): TicketAttachmentRecord {
  const id = String(row.id);
  return {
    id,
    ticket_id: String(row.ticket_id),
    message_id: row.message_id != null ? String(row.message_id) : null,
    client_id: String(row.client_id),
    uploaded_by: row.uploaded_by != null ? String(row.uploaded_by) : null,
    file_name: String(row.file_name),
    content_type: String(row.content_type),
    size_bytes: Number(row.size_bytes),
    width: row.width != null ? Number(row.width) : null,
    height: row.height != null ? Number(row.height) : null,
    status: String(row.status) as TicketAttachmentStatus,
    created_at: String(row.created_at),
    download_url: attachmentUrl(id),
  };
}

function clientUnread(ticket: TicketRecord, lastAuthorRole: TicketAuthorRole | null): boolean {
  if (!lastAuthorRole || lastAuthorRole === "client" || lastAuthorRole === "system") return false;
  const readAt = ticket.client_last_read_at;
  if (!readAt) return true;
  return new Date(ticket.last_message_at).getTime() > new Date(readAt).getTime();
}

async function loadProjectNames(ids: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (!ids.length) return map;
  const supabase = await createClient();
  const res = await supabase.from("projects").select("id, name").in("id", ids);
  if (res.data) {
    for (const row of res.data) {
      map.set(String(row.id), String(row.name));
    }
  }
  return map;
}

async function loadClientNames(ids: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (!ids.length) return map;
  const supabase = await createClient();
  const res = await supabase.from("clients").select("id, company_name").in("id", ids);
  if (res.data) {
    for (const row of res.data) {
      map.set(String(row.id), String(row.company_name));
    }
  }
  return map;
}

async function lastMessageAuthors(ticketIds: string[]): Promise<Map<string, TicketAuthorRole>> {
  const map = new Map<string, TicketAuthorRole>();
  if (!ticketIds.length) return map;
  const supabase = await createClient();
  const res = await supabase
    .from("ticket_messages")
    .select("ticket_id, author_role, created_at")
    .in("ticket_id", ticketIds)
    .order("created_at", { ascending: false });
  if (res.error || !res.data) return map;
  for (const row of res.data) {
    const tid = String(row.ticket_id);
    if (!map.has(tid)) {
      map.set(tid, String(row.author_role) as TicketAuthorRole);
    }
  }
  return map;
}

function toListItem(
  ticket: TicketRecord,
  projectName: string | null,
  companyName?: string,
  unread?: boolean,
): TicketListItem {
  return {
    ...ticket,
    project_name: projectName,
    company_name: companyName,
    unread,
  };
}

export async function listClientTickets(clientId: string): Promise<QueryResult<TicketListItem[]>> {
  const supabase = await createClient();
  const res = await supabase
    .from("tickets")
    .select(TICKET_COLUMNS)
    .eq("client_id", clientId)
    .order("last_message_at", { ascending: false })
    .limit(LIST_PAGE);
  if (res.error) return failed(res.error);
  const tickets = (res.data ?? []).map((row) => mapTicket(row as TicketRow));
  const projectIds = [...new Set(tickets.map((t) => t.project_id).filter(Boolean))] as string[];
  const projects = await loadProjectNames(projectIds);
  const authors = await lastMessageAuthors(tickets.map((t) => t.id));
  return {
    ok: true,
    data: tickets.map((ticket) =>
      toListItem(
        ticket,
        ticket.project_id ? projects.get(ticket.project_id) ?? null : null,
        undefined,
        clientUnread(ticket, authors.get(ticket.id) ?? null),
      ),
    ),
  };
}

export async function getClientTicket(
  clientId: string,
  number: string,
): Promise<QueryResult<TicketDetail | null>> {
  const trimmed = number.trim();
  if (!trimmed) return { ok: true, data: null };
  const supabase = await createClient();
  const ticketRes = await supabase
    .from("tickets")
    .select(TICKET_COLUMNS)
    .eq("client_id", clientId)
    .eq("number", trimmed)
    .maybeSingle();
  if (ticketRes.error) return failed(ticketRes.error);
  if (!ticketRes.data) return { ok: true, data: null };

  const ticket = mapTicket(ticketRes.data as TicketRow);
  const [messagesRes, projectNames, authors] = await Promise.all([
    supabase
      .from("ticket_messages")
      .select(MESSAGE_COLUMNS)
      .eq("ticket_id", ticket.id)
      .neq("kind", "internal_note")
      .order("created_at", { ascending: true })
      .limit(50),
    ticket.project_id ? loadProjectNames([ticket.project_id]) : Promise.resolve(new Map()),
    lastMessageAuthors([ticket.id]),
  ]);
  if (messagesRes.error) return failed(messagesRes.error);

  const messageIds = (messagesRes.data ?? []).map((row) => String((row as TicketRow).id));
  let attachments: TicketAttachmentRecord[] = [];
  if (messageIds.length) {
    const attachRes = await supabase
      .from("ticket_attachments")
      .select(ATTACHMENT_COLUMNS)
      .in("message_id", messageIds)
      .eq("status", "ready");
    if (attachRes.error) return failed(attachRes.error);
    attachments = (attachRes.data ?? []).map((row) => mapAttachment(row as TicketRow));
  }

  const byMessage = new Map<string, TicketAttachmentRecord[]>();
  for (const file of attachments) {
    if (!file.message_id) continue;
    const list = byMessage.get(file.message_id) ?? [];
    list.push(file);
    byMessage.set(file.message_id, list);
  }

  const messages = (messagesRes.data ?? []).map((row) => {
    const message = mapMessage(row as TicketRow);
    return { ...message, attachments: byMessage.get(message.id) ?? [] };
  });

  return {
    ok: true,
    data: {
      ticket: toListItem(
        ticket,
        ticket.project_id ? projectNames.get(ticket.project_id) ?? null : null,
        undefined,
        clientUnread(ticket, authors.get(ticket.id) ?? null),
      ),
      messages,
    },
  };
}

export async function listAdminTickets(
  filters: AdminTicketFilters = {},
): Promise<QueryResult<TicketListItem[]>> {
  const supabase = await createClient();
  let query = supabase
    .from("tickets")
    .select(TICKET_COLUMNS)
    .order("last_message_at", { ascending: false })
    .limit(filters.limit ?? LIST_PAGE);

  if (filters.status === "open_inbox") {
    query = query.in("status", ["open", "awaiting_studio"]);
  } else if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.priority && filters.priority !== "all") {
    query = query.eq("priority", filters.priority);
  }
  if (filters.clientId) query = query.eq("client_id", filters.clientId);
  if (filters.projectId) query = query.eq("project_id", filters.projectId);
  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }
  if (filters.assigneeId) query = query.eq("assigned_to", filters.assigneeId);

  const res = await query;
  if (res.error) return failed(res.error);

  let tickets = (res.data ?? []).map((row) => mapTicket(row as TicketRow));
  const q = filters.q?.trim().toLowerCase();
  if (q) {
    tickets = tickets.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(q) ||
        ticket.number.toLowerCase().includes(q) ||
        ticket.description.toLowerCase().includes(q),
    );
  }

  const projectIds = [...new Set(tickets.map((t) => t.project_id).filter(Boolean))] as string[];
  const clientIds = [...new Set(tickets.map((t) => t.client_id))];
  const [projects, clients, authors] = await Promise.all([
    loadProjectNames(projectIds),
    loadClientNames(clientIds),
    lastMessageAuthors(tickets.map((t) => t.id)),
  ]);

  return {
    ok: true,
    data: tickets.map((ticket) => {
      const lastRole = authors.get(ticket.id) ?? null;
      const unread =
        lastRole === "client" &&
        (!ticket.studio_last_read_at ||
          new Date(ticket.last_message_at).getTime() > new Date(ticket.studio_last_read_at).getTime());
      return toListItem(
        ticket,
        ticket.project_id ? projects.get(ticket.project_id) ?? null : null,
        clients.get(ticket.client_id),
        unread,
      );
    }),
  };
}

export async function getAdminTicket(number: string): Promise<QueryResult<TicketDetail | null>> {
  const trimmed = number.trim();
  if (!trimmed) return { ok: true, data: null };
  const supabase = await createClient();
  const ticketRes = await supabase
    .from("tickets")
    .select(TICKET_COLUMNS)
    .eq("number", trimmed)
    .maybeSingle();
  if (ticketRes.error) return failed(ticketRes.error);
  if (!ticketRes.data) return { ok: true, data: null };

  const ticket = mapTicket(ticketRes.data as TicketRow);
  const messagesRes = await supabase
    .from("ticket_messages")
    .select(MESSAGE_COLUMNS)
    .eq("ticket_id", ticket.id)
    .order("created_at", { ascending: true })
    .limit(50);
  if (messagesRes.error) return failed(messagesRes.error);

  const messageIds = (messagesRes.data ?? []).map((row) => String((row as TicketRow).id));
  let attachments: TicketAttachmentRecord[] = [];
  if (messageIds.length) {
    const attachRes = await supabase
      .from("ticket_attachments")
      .select(ATTACHMENT_COLUMNS)
      .in("message_id", messageIds)
      .eq("status", "ready");
    if (attachRes.error) return failed(attachRes.error);
    attachments = (attachRes.data ?? []).map((row) => mapAttachment(row as TicketRow));
  }

  const byMessage = new Map<string, TicketAttachmentRecord[]>();
  for (const file of attachments) {
    if (!file.message_id) continue;
    const list = byMessage.get(file.message_id) ?? [];
    list.push(file);
    byMessage.set(file.message_id, list);
  }

  const [projectNames, clients, authors] = await Promise.all([
    ticket.project_id ? loadProjectNames([ticket.project_id]) : Promise.resolve(new Map()),
    loadClientNames([ticket.client_id]),
    lastMessageAuthors([ticket.id]),
  ]);

  const messages = (messagesRes.data ?? []).map((row) => {
    const message = mapMessage(row as TicketRow);
    return { ...message, attachments: byMessage.get(message.id) ?? [] };
  });

  const lastRole = authors.get(ticket.id) ?? null;
  const unread =
    lastRole === "client" &&
    (!ticket.studio_last_read_at ||
      new Date(ticket.last_message_at).getTime() > new Date(ticket.studio_last_read_at).getTime());

  return {
    ok: true,
    data: {
      ticket: toListItem(
        ticket,
        ticket.project_id ? projectNames.get(ticket.project_id) ?? null : null,
        clients.get(ticket.client_id),
        unread,
      ),
      messages,
    },
  };
}

export async function ticketCounts(scope: {
  clientId?: string;
}): Promise<QueryResult<TicketCounts>> {
  const supabase = await createClient();
  const res = await supabase
    .from("tickets")
    .select("id, status, client_id, last_message_at, client_last_read_at, studio_last_read_at, resolved_at");
  if (res.error) return failed(res.error);

  const rows = res.data ?? [];
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  let adminInbox = 0;
  let open = 0;
  let awaitingStudio = 0;
  let resolvedThisWeek = 0;
  let clientAwaitingYou = 0;
  let awaitingClient = 0;
  let clientUnreadCount = 0;

  const clientRows = scope.clientId
    ? rows.filter((row) => String(row.client_id) === scope.clientId)
    : [];

  for (const row of rows) {
    const status = String(row.status);
    if (status === "open" || status === "awaiting_studio") adminInbox += 1;
    if (status === "open") open += 1;
    if (status === "awaiting_studio") awaitingStudio += 1;
    if (status === "awaiting_client") awaitingClient += 1;
    if (status === "resolved") {
      const resolvedAt = row.resolved_at ?? row.last_message_at;
      if (resolvedAt && new Date(String(resolvedAt)).getTime() >= weekAgo) {
        resolvedThisWeek += 1;
      }
    }
  }

  if (scope.clientId && clientRows.length) {
    const ids = clientRows.map((row) => String(row.id));
    const authors = await lastMessageAuthors(ids);
    for (const row of clientRows) {
      const status = String(row.status);
      if (status === "awaiting_client") clientAwaitingYou += 1;
      const ticket = mapTicket(row as TicketRow);
      if (clientUnread(ticket, authors.get(String(row.id)) ?? null)) clientUnreadCount += 1;
    }
  }

  return {
    ok: true,
    data: {
      adminInbox,
      clientUnread: clientUnreadCount,
      clientAwaitingYou,
      awaitingClient,
      open,
      awaitingStudio,
      resolvedThisWeek,
    },
  };
}