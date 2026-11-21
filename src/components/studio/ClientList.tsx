"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { formatDate, formatUsd } from "@/lib/portal/format";
import type { ClientListItem } from "@/lib/portal/types";
import { FilterBar, matches } from "@/components/studio/FilterBar";
import { EmptyState, StatusBadge, initials } from "@/components/studio/ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statuses = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "archived", label: "Archived" },
];

export function ClientList({
  clients,
  filters = true,
}: {
  clients: ClientListItem[];
  filters?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const rows = useMemo(
    () =>
      clients.filter(
        (client) =>
          (status === "all" || client.status === status) &&
          matches(query, client.company_name, client.contact_name, client.email, client.plan_name)
      ),
    [clients, query, status]
  );

  if (clients.length === 0) {
    return (
      <EmptyState
        icon={<Users />}
        title="No clients yet"
        description="Add the first company, then create their portal login from the client page."
      />
    );
  }

  return (
    <div className="space-y-3">
      {filters ? (
        <FilterBar
          query={query}
          onQuery={setQuery}
          placeholder="Search clients"
          status={status}
          onStatus={setStatus}
          statuses={statuses}
        />
      ) : null}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead className="hidden md:table-cell">Plan</TableHead>
              <TableHead className="hidden text-right sm:table-cell">MRR</TableHead>
              <TableHead className="hidden lg:table-cell">Latest payment</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-20 text-center text-sm text-muted-foreground">
                  No clients match these filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((client) => {
                const href = `/admin/clients/${client.id}`;
                const payment = client.latest_payment;
                return (
                  <TableRow
                    key={client.id}
                    className="cursor-pointer"
                    onClick={() => router.push(href)}
                  >
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="text-xs font-medium">
                            {initials(client.company_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <Link
                            href={href}
                            onClick={(event) => event.stopPropagation()}
                            className="block truncate font-medium text-foreground hover:underline"
                          >
                            {client.company_name}
                          </Link>
                          <span className="block truncate text-xs text-muted-foreground">
                            {client.contact_name}
                            <span className="sm:hidden"> · {formatUsd(client.monthly_amount)}/mo</span>
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{client.plan_name}</TableCell>
                    <TableCell className="hidden text-right tabular-nums sm:table-cell">
                      {formatUsd(client.monthly_amount)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {payment ? (
                        <div className="flex items-center gap-2">
                          <StatusBadge status={payment.status} />
                          <span className="whitespace-nowrap text-muted-foreground tabular-nums">
                            {formatUsd(payment.amount)}
                            {payment.paid_on ? ` · ${formatDate(payment.paid_on)}` : ""}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No payments yet</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={client.status} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
