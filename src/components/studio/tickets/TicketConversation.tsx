"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  adminReply,
  markTicketRead,
  reopenTicket,
  replyToTicket,
  resolveTicket,
} from "@/lib/portal/ticket-actions";
import { formatDate } from "@/lib/portal/format";
import type { TicketDetail, TicketMessageRecord } from "@/lib/portal/types";
import { Alert, BackLink, StatusBadge } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function linkify(text: string) {
  const urlRe = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRe);
  return parts.map((part, index) =>
    urlRe.test(part) ? (
      <a key={index} href={part} className="underline underline-offset-2" rel="noreferrer" target="_blank">
        {part}
      </a>
    ) : (
      part
    ),
  );
}

type MessageWithFiles = TicketMessageRecord & {
  attachments?: { id: string; file_name: string; download_url?: string }[];
};

function MessageLine({ message }: { message: MessageWithFiles }) {
  if (message.kind === "event") {
    const event = message.event;
    const to = event && typeof event.to === "string" ? event.to.replace(/_/g, " ") : "updated";
    return (
      <p className="text-center text-xs text-muted-foreground">
        Status changed to {to} · {formatDate(message.created_at)}
      </p>
    );
  }

  const mine = message.author_role === "client";
  const internal = message.kind === "internal_note";

  return (
    <div
      className={cn(
        "max-w-[92%] rounded-lg border px-4 py-3 text-sm",
        internal && "border-amber-200/80 bg-amber-50/80",
        !internal && mine && "ml-auto bg-muted/50",
        !internal && !mine && "bg-background",
      )}
    >
      <p className="text-xs text-muted-foreground">
        {internal
          ? "Internal note · only the studio sees this"
          : mine
            ? "You"
            : message.author_name ?? "FullStack Studio"}{" "}
        · {formatDate(message.created_at)}
      </p>
      {message.body ? <p className="mt-2 whitespace-pre-line break-words">{linkify(message.body)}</p> : null}
      {message.attachments?.length ? (
        <ul className="mt-3 space-y-1 text-xs">
          {message.attachments.map((file) => (
            <li key={file.id}>
              <a href={file.download_url} className="underline underline-offset-2">
                {file.file_name}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function TicketConversation({
  detail,
  backHref,
  mode,
}: {
  detail: TicketDetail;
  backHref: string;
  mode: "client" | "admin";
}) {
  const router = useRouter();
  const { ticket, messages } = detail;
  const boundReply = useMemo(() => replyToTicket.bind(null, ticket.number), [ticket.number]);
  const boundAdmin = useMemo(() => adminReply.bind(null, ticket.number), [ticket.number]);
  const [replyState, replyAction, replyPending] = useActionState(boundReply, null);
  const [adminState, adminAction, adminPending] = useActionState(boundAdmin, null);

  useEffect(() => {
    void markTicketRead(ticket.number, mode === "client" ? "client" : "studio");
  }, [ticket.number, mode]);

  useEffect(() => {
    const state = replyState ?? adminState;
    if (state?.notice) toast.success(state.notice);
    if (state?.error) toast.error(state.error);
    if (state?.notice) router.refresh();
  }, [replyState, adminState, router]);

  const closed = ticket.status === "closed";
  const canClientReply = mode === "client" && !closed;

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

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground">Original request</p>
              <p className="mt-2 whitespace-pre-line break-words text-sm">{ticket.description}</p>
            </div>
            {messages.map((message) =>
              mode === "client" && message.kind === "internal_note" ? null : (
                <MessageLine key={message.id} message={message} />
              ),
            )}
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card>
            <CardContent className="space-y-3 p-4 text-sm">
              <p>
                <span className="text-muted-foreground">Status</span>
                <br />
                <StatusBadge status={ticket.status} className="mt-1" />
              </p>
              {mode === "client" && ticket.status === "awaiting_client" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    void resolveTicket(ticket.number).then((result) => {
                      if (result?.notice) toast.success(result.notice);
                      if (result?.error) toast.error(result.error);
                      router.refresh();
                    })
                  }
                >
                  Mark resolved
                </Button>
              ) : null}
              {mode === "client" && (ticket.status === "resolved" || ticket.status === "closed") ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    void reopenTicket(ticket.number).then((result) => {
                      if (result?.notice) toast.success(result.notice);
                      if (result?.error) toast.error(result.error);
                      router.refresh();
                    })
                  }
                >
                  Reopen
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>

      {mode === "client" ? (
        closed ? (
          <p className="text-sm text-muted-foreground">
            This ticket is closed.{" "}
            <Link href="/portal/tickets/new" className="underline underline-offset-2">
              Open a new ticket
            </Link>
            .
          </p>
        ) : (
          <form action={replyAction} className="sticky bottom-0 space-y-3 border-t bg-background py-4">
            {replyState?.error ? <Alert tone="error">{replyState.error}</Alert> : null}
            <Textarea name="body" rows={4} placeholder="Write a reply" className="min-h-[5rem]" required />
            <Button type="submit" disabled={replyPending || !canClientReply}>
              {replyPending ? "Sending…" : "Send reply"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Attachments will be available once Cloudflare R2 keys are configured.
            </p>
          </form>
        )
      ) : (
        <form action={adminAction} className="space-y-3 border-t pt-4">
          {adminState?.error ? <Alert tone="error">{adminState.error}</Alert> : null}
          <Textarea name="body" rows={4} className="min-h-[5rem]" placeholder="Reply to the client" required />
          <div className="flex flex-wrap gap-2">
            <select name="kind" defaultValue="reply" className="h-10 rounded-md border bg-background px-3 text-sm">
              <option value="reply">Public reply</option>
              <option value="internal_note">Internal note</option>
            </select>
            <select name="status" defaultValue="awaiting_client" className="h-10 rounded-md border bg-background px-3 text-sm">
              <option value="awaiting_client">Waiting on client</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <Button type="submit" disabled={adminPending}>
              {adminPending ? "Sending…" : "Send"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}