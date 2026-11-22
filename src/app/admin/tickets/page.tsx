import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy, Plus } from "lucide-react";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { AdminTicketList } from "@/components/studio/ticket/AdminTicketList";
import { EmptyState, PageIntro, StatCard } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { showPreview } from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";
import { listAdminTickets, ticketCounts, type TicketCounts } from "@/lib/portal/ticket-queries";
import { sampleAdminTickets, sampleTicketCounts } from "@/lib/portal/ticket-sample";
import type { TicketListItem } from "@/lib/portal/types";

export const metadata: Metadata = {
  title: "Support · FullStack Studio CRM",
};

export default async function AdminTicketsPage() {
  const session = await requireAdmin();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const counts = sampleTicketCounts();
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <TicketsInbox tickets={sampleAdminTickets()} counts={counts} />
        </>
      );
    }
    return <Blocked session={session} />;
  }

  const [listRes, countsRes] = await Promise.all([
    listAdminTickets({ status: "open_inbox" }),
    ticketCounts({}),
  ]);
  if (!listRes.ok) return <QueryError reason={listRes.reason} />;

  const counts: TicketCounts = countsRes.ok
    ? countsRes.data
    : {
        open: 0,
        awaitingStudio: 0,
        awaitingClient: 0,
        adminInbox: 0,
        clientUnread: 0,
        clientAwaitingYou: 0,
        resolvedThisWeek: 0,
      };

  return <TicketsInbox tickets={listRes.data} counts={counts} />;
}

function TicketsInbox({ tickets, counts }: { tickets: TicketListItem[]; counts: TicketCounts }) {
  return (
    <div className="space-y-8">
      <PageIntro
        title="Support"
        lede="Client tickets across every company."
        action={
          <Button asChild variant="outline" disabled>
            <Link href="/admin/tickets/new">
              <Plus className="size-4" />
              New ticket
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open" value={String(counts.open)} />
        <StatCard label="Waiting on studio" value={String(counts.awaitingStudio)} />
        <StatCard label="Waiting on client" value={String(counts.awaitingClient)} />
        <StatCard label="Resolved this week" value={String(counts.resolvedThisWeek)} />
      </div>
      {tickets.length === 0 ? (
        <EmptyState icon={<LifeBuoy />} title="Inbox clear" description="No open tickets right now." />
      ) : (
        <AdminTicketList tickets={tickets} showClient showProject />
      )}
    </div>
  );
}