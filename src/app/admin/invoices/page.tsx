import type { Metadata } from "next";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { InvoiceForm } from "@/components/studio/InvoiceForm";
import { InvoiceList } from "@/components/studio/InvoiceList";
import { PageIntro, Section } from "@/components/studio/ui";
import { createInvoiceGlobal } from "@/lib/portal/billing-actions";
import { listProjectOptions } from "@/lib/portal/invoice-queries";
import { listClientOptions, listInvoices } from "@/lib/portal/queries";
import { sampleClientOptions, sampleInvoices, showPreview } from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Invoices · FullStack Studio",
};

export default async function InvoicesPage() {
  const session = await requireAdmin();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <PageIntro
              eyebrow="CRM"
              title="Invoices"
              lede="Send invoices and charge Mercado Pago cards on file."
            />
            <Section title="All invoices" lede="Preview data.">
              <InvoiceList invoices={sampleInvoices()} showCompany />
            </Section>
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  const [invoices, clients, projects] = await Promise.all([
    listInvoices(),
    listClientOptions(),
    listProjectOptions(),
  ]);
  if (!invoices.ok) return <QueryError reason={invoices.reason} />;
  if (!clients.ok) return <QueryError reason={clients.reason} />;

  return (
    <>
      <PageIntro
        eyebrow="CRM"
        title="Invoices"
        lede="Every invoice gets a private pay link the client can open without logging in."
      />
      <Section title="All invoices" lede="Newest first across every client.">
        <InvoiceList invoices={invoices.data} showCompany />
      </Section>
      <Section title="New invoice" lede="Email the pay link, charge the card on file now, or both.">
        <InvoiceForm
          action={createInvoiceGlobal}
          clients={clients.data.length ? clients.data : sampleClientOptions()}
          projects={projects}
        />
      </Section>
    </>
  );
}
