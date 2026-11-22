"use client";

import { useMemo, useState } from "react";
import { CreditCard } from "lucide-react";
import { formatCharge, formatDate, formatUsd } from "@/lib/portal/format";
import type { PaymentRecord } from "@/lib/portal/types";
import { FilterBar, matches } from "@/components/studio/FilterBar";
import { EmptyState, StatusBadge } from "@/components/studio/ui";
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
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "refunded", label: "Refunded" },
  { value: "all", label: "All" },
];

export function PortalPaymentList({
  payments,
  invoiceNumbers,
}: {
  payments: PaymentRecord[];
  invoiceNumbers?: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(
    () =>
      payments.filter((payment) => {
        const invoiceLabel =
          payment.invoice_id && invoiceNumbers ? invoiceNumbers[payment.invoice_id] ?? "" : "";
        return (
          (status === "all" || payment.status === status) &&
          matches(
            query,
            payment.period_label,
            payment.method,
            payment.reference,
            invoiceLabel,
            payment.notes
          )
        );
      }),
    [payments, invoiceNumbers, query, status]
  );

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={<CreditCard />}
        title="No payments yet"
        description="Charges and receipts will show up here."
      />
    );
  }

  return (
    <div className="space-y-3">
      <FilterBar
        query={query}
        onQuery={setQuery}
        placeholder="Search period, method, or invoice"
        status={status}
        onStatus={setStatus}
        statuses={statuses}
      />
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="hidden sm:table-cell">Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-20 text-center text-sm text-muted-foreground">
                  No payments match these filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((payment) => {
                const invoiceLabel =
                  payment.invoice_id && invoiceNumbers ? invoiceNumbers[payment.invoice_id] : null;
                const description =
                  invoiceLabel ??
                  payment.period_label ??
                  payment.notes ??
                  "Payment";
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(payment.paid_on ?? payment.created_at)}
                    </TableCell>
                    <TableCell className="min-w-[160px]">
                      <span className="font-medium text-foreground">{description}</span>
                      {payment.period_label && invoiceLabel ? (
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {payment.period_label}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {payment.method ?? "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatUsd(payment.amount)}
                      {payment.charge_amount && payment.charge_currency && payment.charge_currency !== "USD" ? (
                        <span className="block text-xs text-muted-foreground">
                          Charged {formatCharge(payment.charge_amount, payment.charge_currency)}
                        </span>
                      ) : null}
                      {payment.refunded_amount ? (
                        <span className="block text-xs text-muted-foreground">
                          {formatUsd(payment.refunded_amount)} refunded
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={payment.status} />
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