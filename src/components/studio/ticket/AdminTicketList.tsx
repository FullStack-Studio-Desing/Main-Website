import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import { EmptyState, StatusBadge } from "@/components/studio/ui";
import { formatDate } from "@/lib/portal/format";
import type { TicketListItem } from "@/lib/portal/types";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function AdminTicketList({
  tickets,
  showClient = false,
  showProject = true,
  compact = false,
}: {
  tickets: TicketListItem[];
  showClient?: boolean;
  showProject?: boolean;
  compact?: boolean;
}) {
  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={<LifeBuoy />}
        title="No tickets yet"
        description="Support tickets for this scope will show up here."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        {!compact ? (
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Ticket</TableHead>
              {showClient ? <TableHead className="hidden sm:table-cell">Client</TableHead> : null}
              {showProject ? <TableHead className="hidden md:table-cell">Project</TableHead> : null}
              <TableHead className="hidden sm:table-cell">Updated</TableHead>
              <TableHead className="pr-6 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
        ) : null}
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className={cn("min-w-[12rem]", compact ? "pl-6" : "pl-6")}>
                <Link
                  href={`/admin/tickets/${ticket.number}`}
                  className="font-medium hover:underline"
                >
                  {ticket.title}
                </Link>
                <span className="mt-0.5 block font-mono text-[13px] text-muted-foreground">
                  {ticket.number}
                </span>
              </TableCell>
              {showClient ? (
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {ticket.company_name ? (
                    <Link href={`/admin/clients/${ticket.client_id}`} className="hover:underline">
                      {ticket.company_name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
              ) : null}
              {showProject ? (
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {ticket.project_name ?? "General"}
                </TableCell>
              ) : null}
              <TableCell className="hidden whitespace-nowrap text-xs text-muted-foreground sm:table-cell">
                {formatDate(ticket.last_message_at.slice(0, 10))}
              </TableCell>
              <TableCell className="pr-6 text-right">
                <StatusBadge status={ticket.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

/** Whole days / hours since `iso` (for awaiting-studio queue age). */
export function ticketWaitingLabel(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor(ms / 3_600_000);
  if (days >= 1) return `${days} day${days === 1 ? "" : "s"} waiting`;
  if (hours >= 1) return `${hours} hour${hours === 1 ? "" : "s"} waiting`;
  return "Just now";
}