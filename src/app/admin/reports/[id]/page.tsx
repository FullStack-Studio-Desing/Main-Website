import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteReport, updateReport } from "@/lib/portal/actions";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { ReportForm } from "@/components/studio/ReportForm";
import { ReportView } from "@/components/studio/ReportView";
import { BackLink, PageIntro, SectionCard } from "@/components/studio/ui";
import { getReport } from "@/lib/portal/queries";
import { sampleReport, showPreview } from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";
import { isUuid } from "@/lib/portal/validators";
import type { ClientRecord, ReportRecord } from "@/lib/portal/types";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Edit report · FullStack Studio",
};

export default async function EditReportPage({ params }: Props) {
  const { id } = await params;
  const session = await requireAdmin();
  let report: ReportRecord | null = null;
  let client: ClientRecord | null = null;

  if (session.kind !== "ready") {
    if (!(session.kind === "unconfigured" && showPreview())) {
      return <Blocked session={session} />;
    }
    const sample = sampleReport(id);
    if (!sample) return <Blocked session={session} />;
    report = sample.report;
    client = sample.client;
  } else {
    const result = await getReport(id);
    if (!result.ok) return <QueryError reason={result.reason} />;
    if (!result.data) notFound();
    report = result.data.report;
    client = result.data.client;
  }

  return (
    <>
      {session.kind === "unconfigured" ? (
        <>
          <Blocked session={session} />
          <PreviewNote />
        </>
      ) : null}
      <div className={session.kind === "unconfigured" ? "mt-12" : undefined}>
        <div className="space-y-6">
          <BackLink href={`/admin/clients/${client.id}#reports`}>← {client.company_name}</BackLink>
          <PageIntro
            eyebrow={client.company_name}
            title="Edit report"
            action={
              isUuid(report.id) ? (
                <ConfirmForm
                  action={deleteReport.bind(null, report.id, client.id)}
                  message="Delete this report? The client will no longer see it."
                  label="Delete report"
                />
              ) : null
            }
          />
          <SectionCard title="Report" description="Changes go live for the client when published.">
            <ReportForm
              key={report.updated_at}
              action={updateReport.bind(null, report.id, client.id)}
              report={report}
              submitLabel="Save report"
            />
          </SectionCard>
          <SectionCard
            title="Saved version"
            description={
              report.status === "published"
                ? "This is what the client sees."
                : "Clients cannot see this draft."
            }
          >
            <ReportView report={report} />
          </SectionCard>
        </div>
      </div>
    </>
  );
}
