import type { Metadata } from "next";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { GlobalPaymentForm } from "@/components/studio/GlobalPaymentForm";
import { PaymentList } from "@/components/studio/PaymentList";
import { PageIntro, Section } from "@/components/studio/ui";
import { createPaymentGlobal } from "@/lib/portal/actions";
import { listClientOptions, listPayments } from "@/lib/portal/queries";
import {
  sampleClientOptions,
  samplePayments,
  showPreview,
} from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";

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
  payments: Parameters<typeof PaymentList>[0]["payments"];
  clients: { id: string; company_name: string }[];
}) {
  return (
    <>
      <PageIntro
        eyebrow="CRM"
        title="Payments"
        lede="Every payment across clients — status, period, and method in one table."
      />
      <PaymentList payments={payments} />
      <Section title="Add payment" lede="Pick a client, then file the amount.">
        <GlobalPaymentForm action={createPaymentGlobal} clients={clients} />
      </Section>
    </>
  );
}
