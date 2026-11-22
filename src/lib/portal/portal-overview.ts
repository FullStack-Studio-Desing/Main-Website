import "server-only";
import { asNumber, todayISO } from "@/lib/portal/format";
import type { QueryResult } from "@/lib/portal/queries";
import { getPortalHome } from "@/lib/portal/queries";
import {
  getClientProjectActivity,
  type ClientProjectActivity,
  type ProjectActivityItem,
} from "@/lib/portal/project-queries";
import { ticketCounts } from "@/lib/portal/ticket-queries";
import type { ClientRecord, InvoiceRecord } from "@/lib/portal/types";

export type PortalOverview = {
  client: ClientRecord;
  amountDue: number;
  unpaidCount: number;
  oldestUnpaid: InvoiceRecord | null;
  activeProjects: number;
  openTasks: number;
  openTickets: number;
  awaitingYou: number;
  paidThisYear: number;
  refundedThisYear: number;
  projectProgress: ProjectActivityItem[];
  recentUpdates: ClientProjectActivity["updates"];
};

function yearStartISO() {
  const year = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric" }).format(
    new Date(),
  );
  return `${year}-01-01`;
}

export async function getPortalOverview(clientId: string): Promise<QueryResult<PortalOverview | null>> {
  const [home, countsRes, activityRes] = await Promise.all([
    getPortalHome(clientId),
    ticketCounts({ clientId }),
    getClientProjectActivity(clientId),
  ]);

  if (!home.ok) return { ok: false, reason: home.reason };
  if (!home.data) return { ok: true, data: null };

  const { client, invoices, payments, projects } = home.data;
  const unpaid = invoices.filter((inv) => inv.status === "sent" || inv.status === "failed");
  const amountDue = unpaid.reduce((sum, inv) => sum + asNumber(inv.amount), 0);
  const today = todayISO();
  const sortedUnpaid = [...unpaid].sort((a, b) => {
    const ad = a.due_on ?? "9999-12-31";
    const bd = b.due_on ?? "9999-12-31";
    return ad.localeCompare(bd);
  });
  const oldestUnpaid = sortedUnpaid[0] ?? null;

  const yearStart = yearStartISO();
  let paidThisYear = 0;
  let refundedThisYear = 0;
  for (const payment of payments) {
    const paidOn = payment.paid_on ?? payment.created_at.slice(0, 10);
    if (paidOn < yearStart) continue;
    if (payment.status === "paid" || payment.status === "partially_refunded") {
      paidThisYear += asNumber(payment.amount) - asNumber(payment.refunded_amount ?? 0);
    }
    refundedThisYear += asNumber(payment.refunded_amount ?? 0);
  }

  const activeProjects = projects.filter((p) => p.status === "active" || p.status === "planning").length;
  const ticketStats = countsRes.ok
    ? countsRes.data
    : {
        open: 0,
        clientAwaitingYou: 0,
        awaitingStudio: 0,
        adminInbox: 0,
        clientUnread: 0,
        resolvedThisWeek: 0,
        awaitingClient: 0,
      };

  const activity = activityRes.ok ? activityRes.data : { projects: [], updates: [] };
  const openTasks = activity.projects.reduce((n, p) => n + p.tasks_open, 0);

  return {
    ok: true,
    data: {
      client,
      amountDue,
      unpaidCount: unpaid.length,
      oldestUnpaid: oldestUnpaid && oldestUnpaid.due_on && oldestUnpaid.due_on < today ? oldestUnpaid : sortedUnpaid[0] ?? null,
      activeProjects,
      openTasks,
      openTickets: ticketStats.open + ticketStats.awaitingStudio + ticketStats.clientAwaitingYou,
      awaitingYou: ticketStats.clientAwaitingYou,
      paidThisYear,
      refundedThisYear,
      projectProgress: activity.projects.slice(0, 3),
      recentUpdates: activity.updates.slice(0, 5),
    },
  };
}