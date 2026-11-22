import type { Metadata } from "next";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { FormDialog } from "@/components/studio/FormDialog";
import { PaymentMethodForm } from "@/components/studio/PaymentMethodForm";
import { PaymentMethodList } from "@/components/studio/PaymentMethodList";
import { PageIntro, Section } from "@/components/studio/ui";
import { getPortalHome } from "@/lib/portal/queries";
import { samplePortal, showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Payment methods · FullStack Studio",
};

export default async function PortalPaymentMethodsPage() {
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const data = samplePortal();
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <PaymentMethodsView client={data.client} methods={data.paymentMethods} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) {
    return <PageIntro title="Payment methods" lede="Your login is not linked to a company yet." />;
  }

  const result = await getPortalHome(session.profile.client_id);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data) {
    return <PageIntro title="Payment methods" lede="We could not find your company record." />;
  }

  return <PaymentMethodsView client={result.data.client} methods={result.data.paymentMethods} />;
}

function PaymentMethodsView({
  client,
  methods,
}: {
  client: { id: string; tax_id_type: "RFC" | "CURP" | null; tax_id_number: string | null };
  methods: Parameters<typeof PaymentMethodList>[0]["methods"];
}) {
  return (
    <div className="space-y-6">
      <PageIntro
        title="Payment methods"
        lede="Cards are stored by Mercado Pago. You'll still enter the security code when paying."
        action={
          <FormDialog
            hash="add-card"
            trigger="Add a card"
            title="Add a card"
            description="Tokenize a card with Mercado Pago. It will be available for future charges."
          >
            <PaymentMethodForm
              defaultTaxIdType={client.tax_id_type}
              defaultTaxIdNumber={client.tax_id_number}
            />
          </FormDialog>
        }
      />
      <Section title="Saved cards" lede="Default card is charged for invoices when you approve a charge.">
        <PaymentMethodList clientId={client.id} methods={methods} />
      </Section>
    </div>
  );
}