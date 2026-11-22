"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { formatDate, formatUsd } from "@/lib/portal/format";
import type { InvoiceRecord } from "@/lib/portal/types";
import { FilterBar, matches } from "@/components/studio/FilterBar";
import { EmptyState, StatusBadge } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
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
  { value: "unpaid", label: "Unpaid" },
  { value: "paid", label: "Paid" },
  { value: "all", label: "All" },
];

export function PortalInvoiceTable({
  invoices,
  payPaths,
  projectNames,
}: {
  invoices: InvoiceRecord[];
  payPaths: Record<string, string | null>;
  projectNames?: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("unpaid");
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());

  const rows = useMemo(() => {
    const visible = invoices.filter((invoice) => invoice.status !== "void" && invoice.status !== "draft");
    return visible.filter((invoice) => {
      const unpaid = invoice.status === "sent" || invoice.status === "failed";
      const paid =
        invoice.status === "paid" ||
        invoice.status === "refunded" ||
        invoice.status === "partially_refunded";
      const statusOk =
        status === "all" ||
        (status === "unpaid" && unpaid) ||
        (status === "paid" && paid);
      const projectName =
        invoice.project_id && projectNames ? projectNames[invoice.project_id] ?? "" : "";
      return (
        statusOk &&
        matches(query, invoice.number, invoice.title, projectName, invoice.period_label)
      );
    });
  }, [invoices, projectNames, query, status]);

  if (invoices.length === 0) {
    return (
      <EmptyState icon={<FileText />} title="No invoices yet" description="Invoices the studio sends will show up here." />
    );
  }

  return (
    <div className="space-y-3">
      <FilterBar
        query={query}
        onQuery={setQuery}
        placeholder="Search number, title, or project"
        status={status}
        onStatus={setStatus}
        statuses={statuses}
      />
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead className="hidden sm:table-cell">Project</TableHead>
              <TableHead className="hidden md:table-cell">Issued</TableHead>
              <TableHead className="hidden sm:table-cell">Due</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-20 text-center text-sm text-muted-foreground">
                  No invoices match these filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((invoice) => {
                const payPath = payPaths[invoice.id] ?? null;
                const payable = invoice.status === "sent" || invoice.status === "failed";
                const overdue = Boolean(invoice.due_on && payable && invoice.due_on < today);
                const projectName =
                  invoice.project_id && projectNames ? projectNames[invoice.project_id] : null;
                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="min-w-[140px]">
                      <Link
                        href={`/portal/invoices/${invoice.id}`}
                        className="font-mono text-[13px] font-medium text-foreground hover:underline"
                      >
                        {invoice.number}
                      </Link>
                      <span className="mt-0.5 block max-w-[28ch] truncate text-sm text-muted-foreground">
                        {invoice.title}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {projectName ?? "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground whitespace-nowrap">
                      {formatDate(invoice.sent_at ?? invoice.created_at)}
                    </TableCell>
                    <TableCell
                      className={cnCell(overdue, "hidden sm:table-cell whitespace-nowrap")}
                    >
                      {invoice.due_on ? formatDate(invoice.due_on) : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatUsd(invoice.amount)}</TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        {payPath && payable ? (
                          <Button asChild size="sm">
                            <Link href={payPath}>Pay</Link>
                          </Button>
                        ) : null}
                        {payPath ? (
                          <Button asChild size="sm" variant="outline">
                            <a href={`/api/pay/${payPath.replace("/pay/", "")}/pdf`} target="_blank" rel="noreferrer">
                              PDF
                            </a>
                          </Button>
                        ) : null}
                      </div>
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

function cnCell(overdue: boolean, extra: string) {
  return overdue ? `font-medium text-destructive ${extra}` : `text-muted-foreground ${extra}`;
}