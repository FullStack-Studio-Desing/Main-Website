import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy, Plus } from "lucide-react";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { ClientTicketList } from "@/components/studio/ticket/ClientTicketList";
import { EmptyState, PageIntro } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";
import { listClientTickets } from "@/lib/portal/ticket-queries";
import { sampleClientTickets } from "@/lib/portal/ticket-sample";

export const metadata: Metadata = {
  title: "Support · FullStack Studio",
};

export default async function PortalTicketsPage() {
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <TicketsBody tickets={sampleClientTickets()} />
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) {
    return (
      <PageIntro
        title="Support"
        lede="Ask the studio to link this login to your company before opening tickets."
      />
    );
  }

  const result = await listClientTickets(session.profile.client_id);
  if (!result.ok) return <QueryError reason={result.reason} />;

  return <TicketsBody tickets={result.data} />;
}

function TicketsBody({ tickets }: { tickets: ReturnType<typeof sampleClientTickets> }) {
  return (
    <>
      <PageIntro
        title="Support"
        lede="Ask for changes, report a problem, or ask a question. We reply within one business day."
        action={
          <Button asChild>
            <Link href="/portal/tickets/new">
              <Plus className="size-4" />
              Open ticket
            </Link>
          </Button>
        }
      />

      <div className="mt-8">
        {tickets.length === 0 ? (
          <EmptyState
            icon={<LifeBuoy />}
            title="No tickets yet"
            description="Open one whenever you need something from the studio."
            action={
              <Button asChild>
                <Link href="/portal/tickets/new">Open ticket</Link>
              </Button>
            }
          />
        ) : (
          <ClientTicketList tickets={tickets} />
        )}
      </div>
    </>
  );
}