import { formatDate } from "@/lib/portal/format";
import type { ReportRecord } from "@/lib/portal/types";

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
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{report.title}</h1>
      {report.published_at ? (
        <p className="mt-2 text-sm text-muted-foreground">Filed {formatDate(report.published_at)}</p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Draft</p>
      )}
      {report.summary ? (
        <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
          {report.summary}
        </p>
      ) : null}
      <div className="mt-10 space-y-8">
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
