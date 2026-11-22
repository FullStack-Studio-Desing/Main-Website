import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocked, QueryError } from "@/components/studio/Blocked";
import { InvoicePreview } from "@/components/studio/invoice/InvoicePreview";
import { InvoiceShareActions } from "@/components/studio/invoice/InvoiceShareActions";
import { BackLink, PageIntro, Section, StatusBadge } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCharge, formatDate, formatUsd } from "@/lib/portal/format";
import { getInvoiceDetail } from "@/lib/portal/invoice-queries";
import { samplePortal, showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";
import type { PaymentRecord } from "@/lib/portal/types";
import { isUuid } from "@/lib/portal/validators";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Invoice · FullStack Studio",
};

export default async function PortalInvoicePage({ params }: Props) {
  const { id } = await params;
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const home = samplePortal();
      const invoice = home.invoices.find((item) => item.id === id);
      if (!invoice || invoice.status === "draft" || invoice.status === "void") {
        return <Blocked session={session} />;
      }
      return (
        <PortalInvoiceView
          invoice={invoice}
          client={home.client}
          project={home.projects[0] ?? null}
          payments={home.payments.filter((p) => p.invoice_id === invoice.id)}
          payPath="/pay/sample-token"
        />
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) notFound();
  if (!isUuid(id)) notFound();

  const result = await getInvoiceDetail(id);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data || result.data.invoice.client_id !== session.profile.client_id) notFound();
  const { invoice, client, project, payments } = result.data;
  if (invoice.status === "draft" || invoice.status === "void") notFound();

  const payPath = invoice.public_token ? `/pay/${invoice.public_token}` : null;

  return (
    <PortalInvoiceView
      invoice={invoice}
      client={client}
      project={project}
      payments={payments}
      payPath={payPath}
    />
  );
}

function PortalInvoiceView({
  invoice,
  client,
  project,
  payments,
  payPath,
}: {
  invoice: {
    id: string;
    number: string;
    title: string;
    description: string | null;
    amount: number;
    status: string;
    billing_type: string;
    sent_at: string | null;
    due_on: string | null;
    period_label: string | null;
    paid_at: string | null;
    created_at: string;
  };
  client: { company_name: string; contact_name: string | null; email: string };
  project: { id: string; name: string } | null;
  payments: PaymentRecord[];
  payPath: string | null;
}) {
  const payable = invoice.status === "sent" || invoice.status === "failed";

  return (
    <>
      <BackLink href="/portal/invoices">← Invoices</BackLink>
      <div className="mt-4">
        <PageIntro
          eyebrow={invoice.number}
          title={invoice.title}
          lede={`${formatUsd(invoice.amount)}${project ? ` · ${project.name}` : ""}`}
          action={
            payPath && payable ? (
              <Button asChild>
                <Link href={payPath}>Pay {formatUsd(invoice.amount)}</Link>
              </Button>
            ) : (
              <StatusBadge status={invoice.status as never} />
            )
          }
        />
      </div>

      {payPath ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <InvoiceShareActions pdfPath={`/api/pay/${payPath.replace("/pay/", "")}/pdf`} number={invoice.number} />
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <InvoicePreview
          invoice={{
            number: invoice.number,
            title: invoice.title,
            description: invoice.description,
            amount: invoice.amount,
            status: invoice.status as never,
            billingType: invoice.billing_type as never,
            issuedOn: invoice.sent_at ?? invoice.created_at,
            dueOn: invoice.due_on,
            periodLabel: invoice.period_label,
            paidAt: invoice.paid_at,
            companyName: client.company_name,
            contactName: client.contact_name,
            email: client.email,
          }}
        />

        <Card className="h-fit">
          <CardContent className="space-y-4 p-6 text-sm">
            <Detail label="Status">
              <StatusBadge status={invoice.status as never} />
            </Detail>
            {project ? (
              <Detail label="Project">
                <Link
                  href={`/portal/projects/${project.id}`}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  {project.name}
                </Link>
              </Detail>
            ) : null}
            <Detail label="Issued">{formatDate(invoice.sent_at ?? invoice.created_at)}</Detail>
            <Detail label="Due">{invoice.due_on ? formatDate(invoice.due_on) : "Not set"}</Detail>
            <Detail label="Paid">{invoice.paid_at ? formatDate(invoice.paid_at) : "Not paid"}</Detail>
          </CardContent>
        </Card>
      </div>

      <Section title="Payment history" lede="Charges linked to this invoice.">
        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payments recorded for this invoice yet.</p>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden sm:table-cell">Method</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.paid_on ?? payment.created_at)}</TableCell>
                      <TableCell className="tabular-nums">
                        {formatUsd(payment.amount)}
                        {payment.charge_amount && payment.charge_currency && payment.charge_currency !== "USD" ? (
                          <span className="block text-xs text-muted-foreground">
                            Charged {formatCharge(payment.charge_amount, payment.charge_currency)}
                          </span>
                        ) : null}
                        {payment.refunded_amount ? (
                          <span className="block text-xs text-muted-foreground">
                            {formatUsd(payment.refunded_amount)} refunded
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{payment.method ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={payment.status as never} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </Section>
    </>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{children}</span>
    </div>
  );
}