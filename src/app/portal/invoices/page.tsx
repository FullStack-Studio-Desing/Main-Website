import type { Metadata } from "next";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { PortalInvoiceTable } from "@/components/studio/portal/PortalInvoiceTable";
import { PageIntro } from "@/components/studio/ui";
import { loadInvoiceTokens } from "@/lib/portal/invoice-queries";
import { getPortalHome } from "@/lib/portal/queries";
import { samplePortal, showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Invoices · FullStack Studio",
};

export default async function PortalInvoicesPage() {
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const data = samplePortal();
      const payPaths = await buildPayPaths(data.invoices.map((invoice) => invoice.id));
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12 space-y-6">
            <PageIntro title="Invoices" lede="Everything billed, with pay links and PDFs." />
            <PortalInvoiceTable invoices={data.invoices} payPaths={payPaths} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) {
    return (
      <PageIntro title="Invoices" lede="Your login is not linked to a company yet." />
    );
  }

  const result = await getPortalHome(session.profile.client_id);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data) {
    return <PageIntro title="Invoices" lede="We could not find your company record." />;
  }

  const projectNames = Object.fromEntries(result.data.projects.map((p) => [p.id, p.name]));
  const payPaths = await buildPayPaths(result.data.invoices.map((invoice) => invoice.id));

  return (
    <div className="space-y-6">
      <PageIntro title="Invoices" lede="Everything billed, with pay links and PDFs." />
      <PortalInvoiceTable
        invoices={result.data.invoices}
        payPaths={payPaths}
        projectNames={projectNames}
      />
    </div>
  );
}

async function buildPayPaths(ids: string[]) {
  const tokens = await loadInvoiceTokens(ids);
  const payPaths: Record<string, string | null> = {};
  for (const id of ids) {
    payPaths[id] = tokens[id] ? `/pay/${tokens[id]}` : null;
  }
  return payPaths;
}