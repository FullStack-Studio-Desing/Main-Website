import Link from "next/link";
import { formatDate, formatUsd } from "@/lib/portal/format";
import type {
  ClientRecord,
  InvoiceRecord,
  PaymentMethodRecord,
  PaymentRecord,
  ReportRecord,
} from "@/lib/portal/types";
import { InvoiceList } from "@/components/studio/InvoiceList";
import { PaymentMethodForm } from "@/components/studio/PaymentMethodForm";
import { PaymentMethodList } from "@/components/studio/PaymentMethodList";
import { PageIntro, Section, StatusBadge } from "@/components/studio/ui";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PortalHome({
  client,
  payments,
  reports,
  invoices,
  paymentMethods,
}: {
  client: ClientRecord;
  payments: PaymentRecord[];
  reports: ReportRecord[];
  invoices: InvoiceRecord[];
  paymentMethods: PaymentMethodRecord[];
}) {
  return (
    <>
      <PageIntro
        eyebrow="Your plan"
        title={client.company_name}
        lede={`${client.plan_name} · ${formatUsd(client.monthly_amount)} a month`}
      />

      <Card className="mt-10 border-0 bg-forest text-white shadow-none">
        <CardContent className="p-8 sm:p-10">
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
        </CardContent>
      </Card>

      <Section
        id="billing"
        title="Payment method"
        lede="Keep a Mercado Pago card on file for one-time and recurring charges."
      >
        <PaymentMethodList clientId={client.id} methods={paymentMethods} />
        <PaymentMethodForm
          defaultTaxIdType={client.tax_id_type}
          defaultTaxIdNumber={client.tax_id_number}
        />
      </Section>

      <Section id="invoices" title="Invoices" lede="Invoices the studio has sent or charged.">
        <InvoiceList invoices={invoices} adminActions={false} />
      </Section>

      <Section id="payments" title="Payments" lede="Each charge the studio has recorded for this plan.">
        {payments.length === 0 ? (
          <p className="text-base text-body">No payments recorded yet.</p>
        ) : (
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-start justify-between gap-4 px-5 py-4"
                >
                  <div>
                    <p className="text-base font-medium text-foreground">
                      {formatUsd(payment.amount)}
                      {payment.period_label ? ` · ${payment.period_label}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {payment.paid_on ? formatDate(payment.paid_on) : formatDate(payment.created_at)}
                      {payment.method ? ` · ${payment.method}` : ""}
                      {payment.reference ? ` · ${payment.reference}` : ""}
                    </p>
                    {payment.notes ? (
                      <p className="mt-2 text-sm leading-relaxed text-body">{payment.notes}</p>
                    ) : null}
                  </div>
                  <StatusBadge status={payment.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </Section>

      <Section id="reports" title="Reports" lede="Weekly reads on what the plan earned and what happens next.">
        {reports.length === 0 ? (
          <p className="text-base text-body">No reports yet. The first one will show up here.</p>
        ) : (
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/portal/reports/${report.id}`}
                  className="flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                >
                  <span>
                    <span className="block text-base font-medium text-foreground">{report.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {report.period_label}
                      {report.published_at ? ` · ${formatDate(report.published_at)}` : ""}
                    </span>
                  </span>
                  <Button asChild variant="link" className="h-auto p-0 text-moss">
                    <span>Read</span>
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </Section>
    </>
  );
}
