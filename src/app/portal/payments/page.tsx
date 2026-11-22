import type { Metadata } from "next";
import { CircleCheck, Clock, Undo2 } from "lucide-react";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { PortalPaymentList } from "@/components/studio/portal/PortalPaymentList";
import { PageIntro, StatCard } from "@/components/studio/ui";
import { formatUsd } from "@/lib/portal/format";
import { getPortalHome } from "@/lib/portal/queries";
import { samplePortal, showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";
export const metadata: Metadata = {
  title: "Payments · FullStack Studio",
};

export default async function PortalPaymentsPage() {
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const data = samplePortal();
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <PaymentsView
              payments={data.payments}
              invoiceNumbers={Object.fromEntries(data.invoices.map((i) => [i.id, i.number]))}
            />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) {
    return <PageIntro title="Payments" lede="Your login is not linked to a company yet." />;
  }

  const result = await getPortalHome(session.profile.client_id);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data) {
    return <PageIntro title="Payments" lede="We could not find your company record." />;
  }

  return (
    <PaymentsView
      payments={result.data.payments}
      invoiceNumbers={Object.fromEntries(result.data.invoices.map((i) => [i.id, i.number]))}
    />
  );
}

function PaymentsView({
  payments,
  invoiceNumbers,
}: {
  payments: Parameters<typeof PortalPaymentList>[0]["payments"];
  invoiceNumbers: Record<string, string>;
}) {
  const year = new Date().getFullYear();
  const inYear = (value: string | null | undefined) =>
    Boolean(value && new Date(value).getFullYear() === year);

  const paidThisYear = payments
    .filter(
      (payment) =>
        (payment.status === "paid" || payment.status === "partially_refunded") &&
        inYear(payment.paid_on ?? payment.created_at)
    )
    .reduce((sum, payment) => sum + payment.amount - (payment.refunded_amount ?? 0), 0);

  const pending = payments.filter((payment) => payment.status === "pending");
  const pendingTotal = pending.reduce((sum, payment) => sum + payment.amount, 0);

  const refundedRows = payments.filter(
    (payment) => (payment.refunded_amount ?? 0) > 0 || payment.status === "refunded"
  );
  const refundedTotal = refundedRows.reduce(
    (sum, payment) => sum + (payment.refunded_amount || (payment.status === "refunded" ? payment.amount : 0)),
    0
  );

  const plural = (count: number) => `${count} payment${count === 1 ? "" : "s"}`;

  return (
    <div className="space-y-6">
      <PageIntro title="Payments" lede="Receipts, refunds, and charge history in USD." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Paid this year"
          value={formatUsd(paidThisYear)}
          hint={plural(
            payments.filter(
              (p) =>
                (p.status === "paid" || p.status === "partially_refunded") &&
                inYear(p.paid_on ?? p.created_at)
            ).length
          )}
          icon={<CircleCheck />}
        />
        <StatCard
          label="Pending"
          value={formatUsd(pendingTotal)}
          hint={plural(pending.length)}
          icon={<Clock />}
        />
        <StatCard
          label="Refunded"
          value={formatUsd(refundedTotal)}
          hint={plural(refundedRows.length)}
          icon={<Undo2 />}
        />
      </div>
      <PortalPaymentList payments={payments} invoiceNumbers={invoiceNumbers} />
    </div>
  );
}