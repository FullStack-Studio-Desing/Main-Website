import Link from "next/link";
import { deletePayment } from "@/lib/portal/actions";
import { formatDate, formatUsd } from "@/lib/portal/format";
import { isUuid } from "@/lib/portal/validators";
import type { PaymentListItem } from "@/lib/portal/types";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { PaymentStatusSelect } from "@/components/studio/PaymentStatusSelect";
import { StatusBadge } from "@/components/studio/ui";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PaymentList({ payments }: { payments: PaymentListItem[] }) {
  if (payments.length === 0) {
    return (
      <p className="mt-8 max-w-md text-sm text-muted-foreground">
        No payments yet. Add one from a client page or use the form below.
      </p>
    );
  }

  return (
    <Card className="mt-6 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden sm:table-cell">Period</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => {
            const real = isUuid(payment.id);
            return (
              <TableRow key={payment.id}>
                <TableCell>
                  <Link
                    href={`/admin/clients/${payment.client_id}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {payment.company_name}
                  </Link>
                  {payment.method ? (
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {payment.method}
                      {payment.reference ? ` · ${payment.reference}` : ""}
                    </span>
                  ) : null}
                </TableCell>
                <TableCell className="font-medium">{formatUsd(payment.amount)}</TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {payment.period_label ?? "—"}
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {payment.paid_on ? formatDate(payment.paid_on) : "No date"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-3">
                    {real ? (
                      <PaymentStatusSelect
                        clientId={payment.client_id}
                        paymentId={payment.id}
                        status={payment.status}
                      />
                    ) : (
                      <StatusBadge status={payment.status} />
                    )}
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
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
