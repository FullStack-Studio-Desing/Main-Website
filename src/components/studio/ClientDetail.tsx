import Link from "next/link";
import {
  createPayment,
  createProject,
  createReport,
  deletePayment,
  savePortalLogin,
} from "@/lib/portal/actions";
import { createInvoice } from "@/lib/portal/billing-actions";
import { formatDate, formatUsd } from "@/lib/portal/format";
import { isUuid } from "@/lib/portal/validators";
import type {
  ClientRecord,
  InvoiceRecord,
  PaymentMethodRecord,
  PaymentRecord,
  PortalLogin,
  ProjectRecord,
  ReportRecord,
} from "@/lib/portal/types";
import { AccessForm } from "@/components/studio/AccessForm";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { InvoiceForm } from "@/components/studio/InvoiceForm";
import { InvoiceList } from "@/components/studio/InvoiceList";
import { PaymentForm } from "@/components/studio/PaymentForm";
import { PaymentMethodList } from "@/components/studio/PaymentMethodList";
import { PaymentStatusSelect } from "@/components/studio/PaymentStatusSelect";
import { ClientProjects } from "@/components/studio/ProjectList";
import { ProjectForm } from "@/components/studio/ProjectForm";
import { ReportForm } from "@/components/studio/ReportForm";
import { BackLink, PageIntro, Section, StatusBadge } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ClientDetail({
  client,
  payments,
  projects,
  reports,
  invoices,
  paymentMethods,
  login,
}: {
  client: ClientRecord;
  payments: PaymentRecord[];
  projects: ProjectRecord[];
  reports: ReportRecord[];
  invoices: InvoiceRecord[];
  paymentMethods: PaymentMethodRecord[];
  login: PortalLogin | null;
}) {
  const real = isUuid(client.id);

  return (
    <>
      <BackLink href="/admin/clients">← Clients</BackLink>
      <div className="mt-6">
        <PageIntro
          eyebrow={client.contact_name}
          title={client.company_name}
          lede={[client.email, client.phone].filter(Boolean).join(" · ")}
          action={
            <Button asChild variant="brand">
              <Link href={`/admin/clients/${client.id}/edit`}>Edit client</Link>
            </Button>
          }
        />
      </div>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <Card className="border-0 bg-forest text-white shadow-none">
          <CardContent className="p-8 sm:p-10">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portal login</CardTitle>
            <CardDescription>
              {login
                ? `${login.email} can sign in and see this plan, its payments, and published reports.`
                : "Create a login so this client can open their own portal."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccessForm
              action={savePortalLogin.bind(null, client.id)}
              login={login}
              defaultEmail={client.email}
            />
          </CardContent>
        </Card>
      </div>

      {client.billing_notes ? (
        <p className="mt-6 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
          {client.billing_notes}
        </p>
      ) : null}

      <Section
        id="projects"
        title="Projects"
        lede="Track deliverables and retainers for this client."
      >
        <ClientProjects clientId={client.id} projects={projects} />
        {real ? <ProjectForm action={createProject.bind(null, client.id)} /> : null}
      </Section>

      <Section
        id="billing"
        title="Cards on file"
        lede="Clients add Mercado Pago cards in their portal. Charge them from invoices below."
      >
        <PaymentMethodList clientId={client.id} methods={paymentMethods} />
      </Section>

      <Section
        id="invoices"
        title="Invoices"
        lede="Send one-time or recurring invoices and charge the card on file with Mercado Pago."
      >
        <InvoiceList invoices={invoices} />
        {real ? (
          <InvoiceForm
            action={createInvoice.bind(null, client.id)}
            paymentMethods={paymentMethods}
            defaultAmount={client.monthly_amount}
            defaultTitle={`${client.plan_name} retainer`}
          />
        ) : null}
      </Section>

      <Section
        id="payments"
        title="Payments"
        lede="Manual payment records plus Mercado Pago charges from invoices."
      >
        {payments.length === 0 ? (
          <p className="text-base text-body">No payments yet.</p>
        ) : (
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <p className="text-base font-medium text-foreground">
                      {formatUsd(payment.amount)}
                      {payment.period_label ? ` · ${payment.period_label}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
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
            </CardContent>
          </Card>
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
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/admin/reports/${report.id}`}
                  className="flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                >
                  <span>
                    <span className="block text-base font-medium text-foreground">{report.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {report.period_label}
                    </span>
                  </span>
                  <StatusBadge status={report.status} />
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
        <div className="mt-8">
          <Separator />
          <h3 className="mt-8 text-lg font-medium text-foreground">New report</h3>
          <div className="mt-5">
            <ReportForm action={createReport.bind(null, client.id)} submitLabel="File report" />
          </div>
        </div>
      </Section>
    </>
  );
}
