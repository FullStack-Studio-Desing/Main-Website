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
    <article className="max-w-[720px]">
      <p className="text-sm font-medium text-muted-foreground">{report.period_label}</p>
      <h1 className="mt-3 font-display text-[36px] uppercase leading-[0.95] tracking-[-0.02em] text-ink sm:text-[48px]">
        {report.title}
      </h1>
      {report.published_at ? (
        <p className="mt-4 text-sm text-muted-foreground">Filed {formatDate(report.published_at)}</p>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Draft</p>
      )}
      {report.summary ? (
        <p className="mt-8 whitespace-pre-wrap text-lg leading-relaxed text-body">{report.summary}</p>
      ) : null}
      <div className="mt-12 space-y-10">
        {written.map((section) => (
          <section key={section.key}>
            <h2 className="font-display text-[28px] uppercase leading-none tracking-[-0.02em] text-ink">
              {section.title}
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-body">
              {report[section.key]}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
