import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteReport, updateReport } from "@/lib/portal/actions";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { ReportForm } from "@/components/studio/ReportForm";
import { ReportView } from "@/components/studio/ReportView";
import { BackLink } from "@/components/studio/ui";
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
        <BackLink href={`/admin/clients/${client.id}`}>← {client.company_name}</BackLink>
        <p className="mt-6 text-sm font-medium text-muted">Edit report</p>
        <div className="mt-6">
          <ReportForm
            key={report.updated_at}
            action={updateReport.bind(null, report.id, client.id)}
            report={report}
            submitLabel="Save report"
          />
        </div>
        {isUuid(report.id) ? (
          <div className="mt-8">
            <ConfirmForm
              action={deleteReport.bind(null, report.id, client.id)}
              message="Delete this report? The client will no longer see it."
              label="Delete report"
            />
          </div>
        ) : null}
        <div className="mt-16 border-t border-rule pt-12">
          <p className="text-sm font-medium text-muted">
            {report.status === "published"
              ? "Saved version. This is what the client sees."
              : "Saved version. Clients cannot see this draft."}
          </p>
          <div className="mt-8">
            <ReportView report={report} />
          </div>
        </div>
      </div>
    </>
  );
}
