import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { ReportView } from "@/components/studio/ReportView";
import { BackLink } from "@/components/studio/ui";
import { getReport } from "@/lib/portal/queries";
import { sampleReport, showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Report · FullStack Studio",
};

export default async function PortalReportPage({ params }: Props) {
  const { id } = await params;
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const sample = sampleReport(id);
      if (!sample || sample.report.status !== "published") {
        return <Blocked session={session} />;
      }
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <BackLink href="/portal">← Your plan</BackLink>
            <p className="mt-6 text-sm font-medium text-muted-foreground">{sample.client.company_name}</p>
            <div className="mt-4">
              <ReportView report={sample.report} />
            </div>
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) notFound();
  const result = await getReport(id);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data || result.data.report.status !== "published") notFound();
  if (result.data.report.client_id !== session.profile.client_id) notFound();

  return (
    <>
      <BackLink href="/portal">← Your plan</BackLink>
      <p className="mt-6 text-sm font-medium text-muted-foreground">{result.data.client.company_name}</p>
      <div className="mt-4">
        <ReportView report={result.data.report} />
      </div>
    </>
  );
}
