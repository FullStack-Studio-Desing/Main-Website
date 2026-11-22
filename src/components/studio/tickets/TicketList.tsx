"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LifeBuoy } from "lucide-react";
import { formatDate } from "@/lib/portal/format";
import type { TicketListItem } from "@/lib/portal/types";
import { FilterBar, matches } from "@/components/studio/FilterBar";
import { EmptyState, StatusBadge } from "@/components/studio/ui";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const statuses = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "awaiting_client", label: "Waiting on you" },
  { value: "awaiting_studio", label: "Waiting on studio" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

type TicketListProps = {
  tickets: TicketListItem[];
  /** Client portal links; admin when false */
  portal?: boolean;
};

export function TicketList({ tickets, portal = true }: TicketListProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const base = portal ? "/portal/tickets" : "/admin/tickets";

  const rows = useMemo(
    () =>
      tickets.filter(
        (ticket) =>
          (status === "all" || ticket.status === status) &&
          matches(
            query,
            ticket.number,
            ticket.title,
            ticket.description,
            ticket.project_name,
            ticket.company_name,
          ),
      ),
    [tickets, query, status],
  );

  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={<LifeBuoy />}
        title="No tickets yet"
        description="Open one whenever you need something from the studio."
      />
    );
  }

  return (
    <div className="space-y-3">
      <FilterBar
        query={query}
        onQuery={setQuery}
        placeholder="Search by title or number"
        status={status}
        onStatus={setStatus}
        statuses={statuses}
      />
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              {!portal ? <TableHead className="hidden sm:table-cell">Client</TableHead> : null}
              <TableHead className="hidden sm:table-cell">Project</TableHead>
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={portal ? 4 : 5} className="h-20 text-center text-sm text-muted-foreground">
                  No tickets match this filter.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((ticket) => (
                <TableRow key={ticket.id} className="cursor-pointer">
                  <TableCell>
                    <Link href={`${base}/${ticket.number}`} className="block space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[13px] tabular-nums">{ticket.number}</span>
                        {ticket.unread ? (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-foreground" aria-hidden />
                        ) : null}
                      </div>
                      <p className="font-medium">{ticket.title}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground sm:hidden">
                        {ticket.project_name ?? "General"}
                      </p>
                    </Link>
                  </TableCell>
                  {!portal ? (
                    <TableCell className="hidden sm:table-cell">
                      <Link href={`${base}/${ticket.number}`}>{ticket.company_name ?? "—"}</Link>
                    </TableCell>
                  ) : null}
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    <Link href={`${base}/${ticket.number}`}>{ticket.project_name ?? "General"}</Link>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    <Link href={`${base}/${ticket.number}`}>
                      {formatDate(ticket.last_message_at)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`${base}/${ticket.number}`} className="inline-flex justify-end">
                      <StatusBadge status={ticket.status} className={cn(ticket.unread && "ring-1 ring-foreground/20")} />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      <div className="space-y-3 sm:hidden">
        {rows.map((ticket) => (
          <Card key={`m-${ticket.id}`}>
            <CardContent className="p-4">
              <Link href={`${base}/${ticket.number}`} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[13px]">{ticket.number}</span>
                  <StatusBadge status={ticket.status} />
                </div>
                <p className="font-medium">{ticket.title}</p>
                <p className="text-xs text-muted-foreground">
                  {ticket.project_name ?? "General"} · {formatDate(ticket.last_message_at)}
                </p>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}