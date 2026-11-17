import Link from "next/link";
import { createPayment, createReport, deletePayment, savePortalLogin } from "@/lib/portal/actions";
import { formatDate, formatUsd } from "@/lib/portal/format";
import { isUuid } from "@/lib/portal/validators";
import type { ClientRecord, PaymentRecord, PortalLogin, ReportRecord } from "@/lib/portal/types";
import { AccessForm } from "@/components/studio/AccessForm";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { PaymentForm } from "@/components/studio/PaymentForm";
import { PaymentStatusSelect } from "@/components/studio/PaymentStatusSelect";
import { ReportForm } from "@/components/studio/ReportForm";
import { BackLink, PageIntro, Section, StatusBadge } from "@/components/studio/ui";
import { btnInverse } from "@/components/buttons";

export function ClientDetail({
  client,
  payments,
  reports,
  login,
}: {
  client: ClientRecord;
  payments: PaymentRecord[];
  reports: ReportRecord[];
  login: PortalLogin | null;
}) {
  const real = isUuid(client.id);

  return (
    <>
      <BackLink href="/admin">← Clients</BackLink>
      <div className="mt-6">
        <PageIntro
          eyebrow={client.contact_name}
          title={client.company_name}
          lede={[client.email, client.phone].filter(Boolean).join(" · ")}
          action={
            <Link href={`/admin/clients/${client.id}/edit`} className={btnInverse}>
              Edit client
            </Link>
          }
        />
      </div>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <section className="rounded-shell bg-forest p-8 text-white sm:p-10">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-white/60">Current plan</p>
            <StatusBadge status={client.status} />
          </div>
          <h2 className="mt-4 font-display text-[40px] uppercase leading-[0.95] tracking-[-0.02em] sm:text-[52px]">
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
          </p>
        </section>

        <section className="rounded-shell border border-rule bg-white p-6 sm:p-8">
          <h2 className="text-lg font-medium text-ink">Portal login</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {login
              ? `${login.email} can sign in and see this plan, its payments, and published reports.`
              : "Create a login so this client can open their own portal."}
          </p>
          <AccessForm
            action={savePortalLogin.bind(null, client.id)}
            login={login}
            defaultEmail={client.email}
          />
        </section>
      </div>

      {client.billing_notes ? (
        <p className="mt-6 max-w-[68ch] text-sm leading-relaxed text-muted">{client.billing_notes}</p>
      ) : null}

      <Section
        id="payments"
        title="Payments"
        lede="Add each payment the client should see. Card checkouts on the marketing site are not filed here on their own."
      >
        {payments.length === 0 ? (
          <p className="text-base text-body">No payments yet.</p>
        ) : (
          <div className="border-t border-rule">
            {payments.map((payment) => (
              <div key={payment.id} className="grid gap-3 border-b border-rule py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-base font-medium text-ink">
                    {formatUsd(payment.amount)}
                    {payment.period_label ? ` · ${payment.period_label}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {payment.paid_on ? formatDate(payment.paid_on) : "No date"}
                    {payment.method ? ` · ${payment.method}` : ""}
                    {payment.reference ? ` · ${payment.reference}` : ""}
                  </p>
                  {payment.notes ? (
                    <p className="mt-2 text-sm leading-relaxed text-body">{payment.notes}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-4">
                  {real ? (
                    <PaymentStatusSelect
                      clientId={client.id}
                      paymentId={payment.id}
                      status={payment.status}
                    />
                  ) : (
                    <StatusBadge status={payment.status} />
                  )}
                  {real ? (
                    <ConfirmForm
                      action={deletePayment.bind(null, client.id, payment.id)}
                      message={`Delete this ${formatUsd(payment.amount)} payment?`}
                      label="Delete"
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
        <PaymentForm action={createPayment.bind(null, client.id)} />
      </Section>

      <Section
        id="reports"
        title="Reports"
        lede="Published reports show up in the client portal. Drafts stay here."
      >
        {reports.length === 0 ? (
          <p className="text-base text-body">No reports yet.</p>
        ) : (
          <div className="border-t border-rule">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/admin/reports/${report.id}`}
                className="flex items-start justify-between gap-4 border-b border-rule py-4 transition-colors duration-200 hover:bg-white"
              >
                <span>
                  <span className="block text-base font-medium text-ink">{report.title}</span>
                  <span className="mt-1 block text-sm text-muted">{report.period_label}</span>
                </span>
                <StatusBadge status={report.status} />
              </Link>
            ))}
          </div>
        )}
        <div className="mt-8 border-t border-rule pt-8">
          <h3 className="text-lg font-medium text-ink">New report</h3>
          <div className="mt-5">
            <ReportForm action={createReport.bind(null, client.id)} submitLabel="File report" />
          </div>
        </div>
      </Section>
    </>
  );
}
