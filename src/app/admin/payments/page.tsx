import type { Metadata } from "next";
import { CircleCheck, Clock, Undo2 } from "lucide-react";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { FormDialog } from "@/components/studio/FormDialog";
import { GlobalPaymentForm } from "@/components/studio/GlobalPaymentForm";
import { PaymentList } from "@/components/studio/PaymentList";
import { PageIntro, StatCard } from "@/components/studio/ui";
import { createPaymentGlobal } from "@/lib/portal/actions";
import { formatUsd } from "@/lib/portal/format";
import { listClientOptions, listPayments } from "@/lib/portal/queries";
import {
  sampleClientOptions,
  samplePayments,
  showPreview,
} from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";
import type { PaymentListItem, PaymentStatus } from "@/lib/portal/types";

export const metadata: Metadata = {
  title: "Payments · FullStack Studio",
};

export default async function AdminPaymentsPage() {
  const session = await requireAdmin();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <PaymentsView payments={samplePayments()} clients={sampleClientOptions()} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  const [paymentsResult, clientsResult] = await Promise.all([
    listPayments(),
    listClientOptions(),
  ]);
  if (!paymentsResult.ok) return <QueryError reason={paymentsResult.reason} />;
  if (!clientsResult.ok) return <QueryError reason={clientsResult.reason} />;

  return <PaymentsView payments={paymentsResult.data} clients={clientsResult.data} />;
}

function PaymentsView({
  payments,
  clients,
}: {
  payments: PaymentListItem[];
  clients: { id: string; company_name: string }[];
}) {
  const total = (status: PaymentStatus) => {
    const rows = payments.filter((payment) => payment.status === status);
    return { amount: rows.reduce((sum, payment) => sum + payment.amount, 0), count: rows.length };
  };
  // Collected is net of refunds; refunded counts full and partial refunds.
  const kept = payments.filter((payment) => payment.status === "paid" || payment.status === "partially_refunded");
  const collected = {
    amount: kept.reduce((sum, payment) => sum + payment.amount - (payment.refunded_amount ?? 0), 0),
    count: kept.length,
  };
  const pending = total("pending");
  const refundedRows = payments.filter((payment) => (payment.refunded_amount ?? 0) > 0 || payment.status === "refunded");
  const refunded = {
    amount: refundedRows.reduce(
      (sum, payment) => sum + (payment.refunded_amount || (payment.status === "refunded" ? payment.amount : 0)),
      0
    ),
    count: refundedRows.length,
  };
  const plural = (count: number) => `${count} payment${count === 1 ? "" : "s"}`;

  return (
    <div className="space-y-6">
      <PageIntro
        title="Payments"
        lede="Every payment across clients — status, period, and method in one table."
        action={
          <FormDialog
            key={payments.length}
            hash="record"
            trigger="Record payment"
            title="Record payment"
            description="Pick a client, then file the amount. You land on their page after saving."
          >
            <GlobalPaymentForm action={createPaymentGlobal} clients={clients} />
          </FormDialog>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Collected"
          value={formatUsd(collected.amount)}
          hint={plural(collected.count)}
          icon={<CircleCheck />}
        />
        <StatCard
          label="Pending"
          value={formatUsd(pending.amount)}
          hint={plural(pending.count)}
          icon={<Clock />}
        />
        <StatCard
          label="Refunded"
          value={formatUsd(refunded.amount)}
          hint={plural(refunded.count)}
          icon={<Undo2 />}
        />
      </div>
      <PaymentList payments={payments} />
    </div>
  );
}
