import { formatDate } from "@/lib/portal/format";
import type { ReportRecord } from "@/lib/portal/types";
import { StatusBadge } from "@/components/studio/ui";
import { Separator } from "@/components/ui/separator";

const sections = [
  { key: "traffic", title: "Traffic and lead quality" },
  { key: "campaigns", title: "Campaign and SEO movement" },
  { key: "pipeline", title: "Conversion and pipeline" },
  { key: "actions", title: "Actions for the coming week" },
] as const;

export function ReportView({ report }: { report: ReportRecord }) {
  const written = sections.filter((section) => report[section.key]);

  return (
    <article className="max-w-2xl">
      <p className="text-sm text-muted-foreground">{report.period_label}</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {report.title}
      </h1>
      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <StatusBadge status={report.status} />
        {report.published_at ? <span>Filed {formatDate(report.published_at)}</span> : null}
      </div>
      {report.summary ? (
        <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
          {report.summary}
        </p>
      ) : null}
      {written.length > 0 ? <Separator className="my-8" /> : null}
      <div className="space-y-8">
        {written.map((section) => (
          <section key={section.key}>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{section.title}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {report[section.key]}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
