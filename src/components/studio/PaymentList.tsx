"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CreditCard } from "lucide-react";
import { deletePayment } from "@/lib/portal/actions";
import { formatCharge, formatDate, formatUsd } from "@/lib/portal/format";
import { isUuid } from "@/lib/portal/validators";
import type { PaymentListItem } from "@/lib/portal/types";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { FilterBar, matches } from "@/components/studio/FilterBar";
import { PaymentStatusSelect } from "@/components/studio/PaymentStatusSelect";
import { RefundDialog } from "@/components/studio/RefundDialog";
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
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
  { value: "partially_refunded", label: "Partly refunded" },
];

export function PaymentList({ payments }: { payments: PaymentListItem[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const rows = useMemo(
    () =>
      payments.filter(
        (payment) =>
          (status === "all" || payment.status === status) &&
          matches(query, payment.company_name, payment.period_label, payment.method, payment.reference)
      ),
    [payments, query, status]
  );

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={<CreditCard />}
        title="No payments yet"
        description="Record one with the button above, or from a client page."
      />
    );
  }

  return (
    <div className="space-y-3">
      <FilterBar
        query={query}
        onQuery={setQuery}
        placeholder="Search client, period, reference"
        status={status}
        onStatus={setStatus}
        statuses={statuses}
      />
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden md:table-cell">Period</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-20 text-center text-sm text-muted-foreground">
                  No payments match these filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((payment) => {
                const real = isUuid(payment.id);
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="min-w-[160px]">
                      <Link
                        href={`/admin/clients/${payment.client_id}#payments`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {payment.company_name}
                      </Link>
                      {payment.method || payment.reference ? (
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {[payment.method, payment.reference].filter(Boolean).join(" · ")}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatUsd(payment.amount)}
                      {payment.charge_amount && payment.charge_currency && payment.charge_currency !== "USD" ? (
                        <span className="block text-xs font-normal text-muted-foreground">
                          {formatCharge(payment.charge_amount, payment.charge_currency)}
                        </span>
                      ) : null}
                      {payment.refunded_amount ? (
                        <span className="block text-xs font-normal text-muted-foreground">
                          −{formatUsd(payment.refunded_amount)} refunded
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {payment.period_label ?? "—"}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">
                      {payment.paid_on ? formatDate(payment.paid_on) : "No date"}
                    </TableCell>
                    <TableCell>
                      {real && payment.status !== "partially_refunded" && !payment.mp_order_id ? (
                        <PaymentStatusSelect
                          clientId={payment.client_id}
                          paymentId={payment.id}
                          status={payment.status}
                        />
                      ) : (
                        <StatusBadge status={payment.status} />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {real && (payment.status === "paid" || payment.status === "partially_refunded") ? (
                          <RefundDialog
                            paymentId={payment.id}
                            amount={payment.amount}
                            refundedAmount={payment.refunded_amount ?? 0}
                            viaMercadoPago={Boolean(payment.mp_order_id)}
                          />
                        ) : null}
                        {real ? (
                          <ConfirmForm
                            action={deletePayment.bind(null, payment.client_id, payment.id)}
                            message={`Delete this ${formatUsd(payment.amount)} payment?`}
                            label="Delete"
                          />
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
