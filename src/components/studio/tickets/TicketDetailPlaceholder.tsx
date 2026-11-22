import Link from "next/link";
import { formatDate } from "@/lib/portal/format";
import type { TicketDetail } from "@/lib/portal/types";
import { BackLink, StatusBadge } from "@/components/studio/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TicketDetailPlaceholder({
  detail,
  backHref,
}: {
  detail: TicketDetail;
  backHref: string;
}) {
  const { ticket, messages } = detail;

  return (
    <div className="space-y-6">
      <BackLink href={backHref}>Back to tickets</BackLink>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-mono text-[13px] text-muted-foreground">{ticket.number}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{ticket.title}</h1>
          <p className="text-sm text-muted-foreground">
            {ticket.project_name ?? "General"} · Opened {formatDate(ticket.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={ticket.status} />
          <StatusBadge status={ticket.category} />
          <StatusBadge status={ticket.priority} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conversation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-xs font-medium text-muted-foreground">Original request</p>
            <p className="mt-2 whitespace-pre-line text-sm">{ticket.description}</p>
          </div>
          {messages.map((message) => (
            <div key={message.id} className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground">
                {message.author_role === "client" ? "You" : "Studio"} · {formatDate(message.created_at)}
              </p>
              {message.body ? (
                <p className="mt-2 whitespace-pre-line text-sm">{message.body}</p>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">
        Reply composer and attachments land in the next pass.{" "}
        <Link href={backHref} className="underline underline-offset-2">
          Return to the list
        </Link>
        .
      </p>
    </div>
  );
}