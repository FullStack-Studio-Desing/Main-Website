import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { TicketConversation } from "@/components/studio/tickets/TicketConversation";
import { getAdminTicket } from "@/lib/portal/ticket-queries";
import { sampleTicketDetail } from "@/lib/portal/ticket-sample";
import { showPreview } from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Ticket · FullStack Studio",
};

type Props = { params: Promise<{ number: string }> };

export default async function AdminTicketPage({ params }: Props) {
  const { number } = await params;
  const session = await requireAdmin();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const detail = sampleTicketDetail(decodeURIComponent(number));
      if (!detail) notFound();
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <TicketConversation detail={detail} backHref="/admin/tickets" mode="admin" />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  const result = await getAdminTicket(decodeURIComponent(number));
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data) notFound();

  return <TicketConversation detail={result.data} backHref="/admin/tickets" mode="admin" />;
}