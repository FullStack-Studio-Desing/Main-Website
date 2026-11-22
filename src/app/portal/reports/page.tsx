import type { Metadata } from "next";
import Link from "next/link";
import { FileBarChart } from "lucide-react";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { EmptyState, PageIntro } from "@/components/studio/ui";
import { formatDate } from "@/lib/portal/format";
import { getPortalHome } from "@/lib/portal/queries";
import { samplePortal, showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";
import type { ReportRecord } from "@/lib/portal/types";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reports · FullStack Studio",
};

export default async function PortalReportsPage() {
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const data = samplePortal();
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12 space-y-6">
            <PageIntro title="Reports" lede="Published monthly reads from the studio." />
            <ReportsGrid reports={data.reports} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) {
    return <PageIntro title="Reports" lede="Your login is not linked to a company yet." />;
  }

  const result = await getPortalHome(session.profile.client_id);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data) {
    return <PageIntro title="Reports" lede="We could not find your company record." />;
  }

  return (
    <div className="space-y-6">
      <PageIntro title="Reports" lede="Published monthly reads from the studio." />
      <ReportsGrid reports={result.data.reports} />
    </div>
  );
}

function ReportsGrid({ reports }: { reports: ReportRecord[] }) {
  const published = reports.filter((report) => report.status === "published");

  if (published.length === 0) {
    return (
      <EmptyState
        icon={<FileBarChart />}
        title="No reports yet"
        description="The first published report will show up here."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {published.map((report) => (
        <Link key={report.id} href={`/portal/reports/${report.id}`} className="group block">
          <Card className="h-full transition-colors group-hover:bg-muted/30">
            <CardContent className="space-y-2 p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {report.period_label}
              </p>
              <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:underline">
                {report.title}
              </h3>
              {report.summary ? (
                <p className="line-clamp-2 text-sm text-muted-foreground">{report.summary}</p>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Published {report.published_at ? formatDate(report.published_at) : "—"}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}