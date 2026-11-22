import type { TicketDetail, TicketListItem, TicketMessageRecord } from "@/lib/portal/types";
import type { TicketCounts } from "@/lib/portal/ticket-queries";

const CLIENT_ID = "sample-northwind";

const tickets: TicketListItem[] = [
  {
    id: "sample-ticket-1",
    number: "TCK-0042",
    client_id: CLIENT_ID,
    project_id: "sample-project-site",
    category: "bug",
    title: "Mobile hero cuts off the phone number",
    description:
      "On iPhone 15 Safari the repair page hero hides the call button until you scroll. Steps: open /repair on mobile, portrait mode.",
    priority: "high",
    status: "awaiting_client",
    assigned_to: null,
    task_id: null,
    created_by: null,
    last_message_at: "2026-11-20T16:00:00.000Z",
    client_last_read_at: "2026-11-19T12:00:00.000Z",
    studio_last_read_at: "2026-11-20T16:05:00.000Z",
    resolved_at: null,
    closed_at: null,
    created_at: "2026-11-18T10:00:00.000Z",
    updated_at: "2026-11-20T16:00:00.000Z",
    project_name: "Website rebuild",
    unread: true,
  },
  {
    id: "sample-ticket-2",
    number: "TCK-0038",
    client_id: CLIENT_ID,
    project_id: null,
    category: "billing",
    title: "Update the card on file",
    description: "Our Amex expires in December. Need to swap the default card before the December retainer runs.",
    priority: "normal",
    status: "resolved",
    assigned_to: null,
    task_id: null,
    created_by: null,
    last_message_at: "2026-11-10T14:00:00.000Z",
    client_last_read_at: "2026-11-10T14:30:00.000Z",
    studio_last_read_at: "2026-11-10T14:00:00.000Z",
    resolved_at: "2026-11-10T14:00:00.000Z",
    closed_at: null,
    created_at: "2026-11-08T09:00:00.000Z",
    updated_at: "2026-11-10T14:00:00.000Z",
    project_name: null,
    unread: false,
  },
  {
    id: "sample-ticket-3",
    number: "TCK-0035",
    client_id: CLIENT_ID,
    project_id: "sample-project-ads",
    category: "question",
    title: "Can we pause Meta spend for two weeks?",
    description: "Cash flow is tight in December. Want to pause prospecting but keep search running.",
    priority: "low",
    status: "awaiting_studio",
    assigned_to: null,
    task_id: null,
    created_by: null,
    last_message_at: "2026-11-21T11:00:00.000Z",
    client_last_read_at: "2026-11-21T11:00:00.000Z",
    studio_last_read_at: null,
    resolved_at: null,
    closed_at: null,
    created_at: "2026-11-21T11:00:00.000Z",
    updated_at: "2026-11-21T11:00:00.000Z",
    project_name: "Paid search retainer",
    unread: false,
  },
];

function message(
  fields: Partial<TicketMessageRecord> & Pick<TicketMessageRecord, "id" | "ticket_id" | "body">,
): TicketMessageRecord {
  return {
    client_id: CLIENT_ID,
    author_id: null,
    author_role: "admin",
    kind: "reply",
    event: null,
    edited_at: null,
    created_at: "2026-11-20T16:00:00.000Z",
    ...fields,
  };
}

export function sampleClientTickets(): TicketListItem[] {
  return tickets;
}

export function sampleAdminTickets(): TicketListItem[] {
  return tickets.map((ticket) => ({ ...ticket, company_name: "Northwind Supply" }));
}

/** Alias used by older preview call sites */
export function sampleTickets(): TicketListItem[] {
  return sampleAdminTickets();
}

export function sampleTicketDetail(number: string): TicketDetail | null {
  const ticket = tickets.find((item) => item.number === number);
  if (!ticket) return null;
  const messages =
    number === "TCK-0042"
      ? [
          {
            ...message({
              id: "sample-msg-1",
              ticket_id: ticket.id,
              author_role: "client",
              body: ticket.description,
              created_at: ticket.created_at,
            }),
            attachments: [],
          },
          {
            ...message({
              id: "sample-msg-2",
              ticket_id: ticket.id,
              body: "We pushed a CSS fix to staging. Can you confirm on your phone?",
              created_at: "2026-11-20T16:00:00.000Z",
            }),
            attachments: [],
          },
        ]
      : [
          {
            ...message({
              id: "sample-msg-3",
              ticket_id: ticket.id,
              author_role: "client",
              body: ticket.description,
              created_at: ticket.created_at,
            }),
            attachments: [],
          },
        ];
  return { ticket, messages };
}

export function sampleTicketCounts(): TicketCounts {
  return {
    adminInbox: 2,
    clientUnread: 1,
    clientAwaitingYou: 1,
    awaitingClient: 1,
    open: 0,
    awaitingStudio: 1,
    resolvedThisWeek: 1,
  };
}