import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import { EmptyState, StatusBadge } from "@/components/studio/ui";
import { relativeTime } from "@/components/studio/project/labels";
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

export function ClientTicketList({ tickets }: { tickets: TicketListItem[] }) {
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
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6">Ticket</TableHead>
            <TableHead className="hidden md:table-cell">Project</TableHead>
            <TableHead className="hidden sm:table-cell">Updated</TableHead>
            <TableHead className="pr-6 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="cursor-pointer">
              <TableCell className="pl-6">
                <Link href={`/portal/tickets/${ticket.number}`} className="block min-w-0">
                  <span className="flex items-center gap-2 font-medium">
                    {ticket.unread ? (
                      <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden />
                    ) : null}
                    {ticket.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-[13px] text-muted-foreground">
                    {ticket.number}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {ticket.project_name ?? "General"}
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                {relativeTime(ticket.last_message_at)}
              </TableCell>
              <TableCell className={cn("pr-6 text-right")}>
                <StatusBadge status={ticket.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}