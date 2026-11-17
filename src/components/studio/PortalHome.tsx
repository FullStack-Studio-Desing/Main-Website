import Link from "next/link";
import { formatDate, formatUsd } from "@/lib/portal/format";
import type { ClientRecord, PaymentRecord, ReportRecord } from "@/lib/portal/types";
import { PageIntro, Section, StatusBadge } from "@/components/studio/ui";

export function PortalHome({
  client,
  payments,
  reports,
}: {
  client: ClientRecord;
  payments: PaymentRecord[];
  reports: ReportRecord[];
}) {
  return (
    <>
      <PageIntro
        eyebrow="Your plan"
        title={client.company_name}
        lede={`${client.plan_name} · ${formatUsd(client.monthly_amount)} a month`}
      />

      <section className="mt-10 rounded-shell bg-forest p-8 text-white sm:p-10">
        <p className="text-sm text-white/60">Current plan</p>
        <h2 className="mt-3 font-display text-[40px] uppercase leading-[0.95] tracking-[-0.02em] sm:text-[56px]">
          {client.plan_name}
        </h2>
        <p className="mt-5 flex items-baseline gap-2">
          <span className="font-display text-[32px] leading-none text-neon">
            {formatUsd(client.monthly_amount)}
          </span>
          <span className="text-base text-white/60">/ month</span>
        </p>
        <p className="mt-4 text-sm text-white/70">
          {client.started_on ? `Started ${formatDate(client.started_on)}` : "Start date not set"}
          {" · "}
          {client.status === "active" ? "Active" : client.status === "paused" ? "Paused" : "Archived"}
        </p>
      </section>

      <Section id="payments" title="Payments" lede="Each charge the studio has recorded for this plan.">
        {payments.length === 0 ? (
          <p className="text-base text-body">No payments recorded yet.</p>
        ) : (
          <div className="border-t border-rule">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-start justify-between gap-4 border-b border-rule py-4">
                <div>
                  <p className="text-base font-medium text-ink">
                    {formatUsd(payment.amount)}
                    {payment.period_label ? ` · ${payment.period_label}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {payment.paid_on ? formatDate(payment.paid_on) : formatDate(payment.created_at)}
                    {payment.method ? ` · ${payment.method}` : ""}
                    {payment.reference ? ` · ${payment.reference}` : ""}
                  </p>
                  {payment.notes ? <p className="mt-2 text-sm leading-relaxed text-body">{payment.notes}</p> : null}
                </div>
                <StatusBadge status={payment.status} />
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section id="reports" title="Reports" lede="Weekly reads on what the plan earned and what happens next.">
        {reports.length === 0 ? (
          <p className="text-base text-body">No reports yet. The first one will show up here.</p>
        ) : (
          <div className="border-t border-rule">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/portal/reports/${report.id}`}
                className="flex items-start justify-between gap-4 border-b border-rule py-4 transition-colors duration-200 hover:bg-white"
              >
                <span>
                  <span className="block text-base font-medium text-ink">{report.title}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {report.period_label}
                    {report.published_at ? ` · ${formatDate(report.published_at)}` : ""}
                  </span>
                </span>
                <span className="text-sm font-medium text-moss">Read</span>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
