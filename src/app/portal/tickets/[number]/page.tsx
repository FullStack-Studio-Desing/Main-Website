import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { TicketConversation } from "@/components/studio/tickets/TicketConversation";
import { getClientTicket } from "@/lib/portal/ticket-queries";
import { sampleTicketDetail } from "@/lib/portal/ticket-sample";
import { showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Ticket · FullStack Studio",
};

type Props = { params: Promise<{ number: string }> };

export default async function PortalTicketPage({ params }: Props) {
  const { number } = await params;
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const detail = sampleTicketDetail(decodeURIComponent(number));
      if (!detail) notFound();
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <TicketConversation detail={detail} backHref="/portal/tickets" mode="client" />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) notFound();

  const result = await getClientTicket(session.profile.client_id, decodeURIComponent(number));
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data) notFound();

  return <TicketConversation detail={result.data} backHref="/portal/tickets" mode="client" />;
}