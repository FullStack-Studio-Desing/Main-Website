import Link from "next/link";
import { formatDate, formatUsd } from "@/lib/portal/format";
import type { ClientListItem, DirectoryStats } from "@/lib/portal/types";
import { StatusBadge } from "@/components/studio/ui";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ClientStats({ stats }: { stats: DirectoryStats }) {
  const items = [
    { label: "Active clients", value: String(stats.active) },
    { label: `Collected in ${stats.monthLabel}`, value: formatUsd(stats.collected) },
    { label: "Open projects", value: String(stats.projects) },
    { label: `Reports in ${stats.monthLabel}`, value: String(stats.reports) },
  ];

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-lg font-medium text-foreground">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ClientList({ clients }: { clients: ClientListItem[] }) {
  if (clients.length === 0) {
    return (
      <p className="mt-12 max-w-[46ch] text-base leading-relaxed text-body">
        No clients yet. Add the first company, then create their portal login from the client page.
      </p>
    );
  }

  return (
    <Card className="mt-10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead className="hidden sm:table-cell">Plan</TableHead>
            <TableHead className="hidden md:table-cell">Latest payment</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} className="cursor-pointer">
              <TableCell>
                <Link href={`/admin/clients/${client.id}`} className="block">
                  <span className="font-medium text-foreground">{client.company_name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {client.contact_name}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Link href={`/admin/clients/${client.id}`} className="block text-sm">
                  {client.plan_name} · {formatUsd(client.monthly_amount)}/mo
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Link href={`/admin/clients/${client.id}`} className="block text-sm text-muted-foreground">
                  {client.latest_payment
                    ? `${formatUsd(client.latest_payment.amount)} · ${
                        client.latest_payment.status.charAt(0).toUpperCase() +
                        client.latest_payment.status.slice(1)
                      }${
                        client.latest_payment.paid_on
                          ? ` · ${formatDate(client.latest_payment.paid_on)}`
                          : ""
                      }`
                    : "No payments yet"}
                </Link>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/admin/clients/${client.id}`} className="inline-flex justify-end">
                  <StatusBadge status={client.status} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
