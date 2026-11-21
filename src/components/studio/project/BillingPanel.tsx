import Link from "next/link";
import { CircleDollarSign, FileText, Receipt, Wallet } from "lucide-react";
import { formatDate, formatUsd } from "@/lib/portal/format";
import type { InvoiceRecord, PaymentRecord, ProjectRecord } from "@/lib/portal/types";
import { EmptyState, SectionCard, StatCard, StatusBadge } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Drafts are not sent yet and void invoices were cancelled, so neither counts as billed.
function billed(invoice: InvoiceRecord) {
  return invoice.status !== "draft" && invoice.status !== "void";
}

export function billingTotals(
  project: ProjectRecord,
  invoices: InvoiceRecord[],
  payments: PaymentRecord[],
) {
  const invoiced = invoices.filter(billed).reduce((sum, invoice) => sum + invoice.amount, 0);
  const paid = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  return {
    budget: project.budget,
    invoiced,
    paid,
    outstanding: Math.max(invoiced - paid, 0),
    remaining: project.budget === null ? null : project.budget - invoiced,
  };
}

export function BillingPanel({
  project,
  invoices,
  payments,
}: {
  project: ProjectRecord;
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
}) {
  const totals = billingTotals(project, invoices, payments);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Budget"
          icon={<Wallet />}
          value={totals.budget === null ? "Not set" : formatUsd(totals.budget)}
          hint={
            totals.remaining === null
              ? "Set a budget in Overview"
              : totals.remaining >= 0
                ? `${formatUsd(totals.remaining)} left to invoice`
                : `${formatUsd(-totals.remaining)} over budget`
          }
        />
        <StatCard
          label="Invoiced"
          icon={<FileText />}
          value={formatUsd(totals.invoiced)}
          hint={`${invoices.filter(billed).length} sent or paid`}
        />
        <StatCard
          label="Paid"
          icon={<CircleDollarSign />}
          value={formatUsd(totals.paid)}
          hint={totals.outstanding > 0 ? `${formatUsd(totals.outstanding)} outstanding` : "Nothing outstanding"}
        />
      </div>

      <SectionCard
        title="Invoices"
        description="Invoices linked to this project."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/invoices">All invoices</Link>
          </Button>
        }
      >
        {invoices.length === 0 ? (
          <EmptyState
            icon={<FileText />}
            title="No invoices linked yet"
            description="Invoices that name this project show up here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Due</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="min-w-0">
                    <Link
                      href={`/admin/invoices/${invoice.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {invoice.number}
                    </Link>
                    <p className="max-w-[220px] truncate text-xs text-muted-foreground">
                      {invoice.title}
                    </p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {formatDate(invoice.due_on)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatUsd(invoice.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      <SectionCard
        title="Payments"
        description="Payments recorded against this project."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/payments">All payments</Link>
          </Button>
        }
      >
        {payments.length === 0 ? (
          <EmptyState
            icon={<Receipt />}
            title="No payments linked yet"
            description="Payments tied to this project show up here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <span className="text-foreground">
                      {formatDate(payment.paid_on ?? payment.created_at)}
                    </span>
                    {payment.period_label ? (
                      <p className="text-xs text-muted-foreground">{payment.period_label}</p>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {payment.method ?? "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatUsd(payment.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
