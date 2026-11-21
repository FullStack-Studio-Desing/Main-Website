import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocked, QueryError } from "@/components/studio/Blocked";
import { InvoiceAdminActions } from "@/components/studio/invoice/InvoiceAdminActions";
import { InvoicePreview } from "@/components/studio/invoice/InvoicePreview";
import { RefundDialog } from "@/components/studio/RefundDialog";
import { BackLink, PageIntro, Section, StatusBadge } from "@/components/studio/ui";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  chargeInvoice,
  markInvoicePaidManuallyForm,
  sendInvoice,
  voidInvoiceWithResult,
} from "@/lib/portal/billing-actions";
import { formatCharge, formatDate, formatUsd } from "@/lib/portal/format";
import { getInvoiceDetail } from "@/lib/portal/invoice-queries";
import { requireAdmin } from "@/lib/portal/session";
import { isUuid } from "@/lib/portal/validators";

export const metadata: Metadata = {
  title: "Invoice · FullStack Studio",
};

export default async function InvoiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string | string[] }>;
}) {
  const session = await requireAdmin();
  if (session.kind !== "ready") return <Blocked session={session} />;

  const { id } = await params;
  if (!isUuid(id)) notFound();
  const result = await getInvoiceDetail(id);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data) notFound();

  const { invoice, client, project, payments, hasCardOnFile } = result.data;
  const query = await searchParams;
  const notice = typeof query.notice === "string" ? query.notice.slice(0, 300) : undefined;
  const payPath = invoice.public_token ? `/pay/${invoice.public_token}` : null;

  return (
    <>
      <BackLink href="/admin/invoices">← All invoices</BackLink>
      <div className="mt-4">
        <PageIntro
          eyebrow={invoice.number}
          title={invoice.title}
          lede={`${formatUsd(invoice.amount)} · ${client.company_name}${project ? ` · ${project.name}` : ""}`}
        />
      </div>

      <div className="mt-6">
        <InvoiceAdminActions
          number={invoice.number}
          amount={invoice.amount}
          status={invoice.status}
          payPath={payPath}
          hasCardOnFile={hasCardOnFile}
          notice={notice}
          send={sendInvoice.bind(null, client.id, invoice.id)}
          charge={chargeInvoice.bind(null, client.id, invoice.id)}
          markPaid={markInvoicePaidManuallyForm.bind(null, client.id, invoice.id)}
          voidInvoice={voidInvoiceWithResult.bind(null, client.id, invoice.id)}
        />
        {!payPath ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No pay link yet. Run the invoice pay-link SQL migration to generate one.
          </p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <InvoicePreview
          invoice={{
            number: invoice.number,
            title: invoice.title,
            description: invoice.description,
            amount: invoice.amount,
            status: invoice.status,
            billingType: invoice.billing_type,
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
              <StatusBadge status={invoice.status} />
            </Detail>
            <Detail label="Client">
              <Link href={`/admin/clients/${client.id}`} className="font-medium underline-offset-4 hover:underline">
                {client.company_name}
              </Link>
            </Detail>
            {project ? (
              <Detail label="Project">
                <Link href={`/admin/projects/${project.id}`} className="font-medium underline-offset-4 hover:underline">
                  {project.name}
                </Link>
              </Detail>
            ) : null}
            <Detail label="Created">{formatDate(invoice.created_at)}</Detail>
            <Detail label="Sent">{invoice.sent_at ? formatDate(invoice.sent_at) : "Not sent"}</Detail>
            <Detail label="Paid">{invoice.paid_at ? formatDate(invoice.paid_at) : "Not paid"}</Detail>
            {invoice.mp_order_id ? (
              <Detail label="Mercado Pago order">
                <span className="break-all font-mono text-xs">{invoice.mp_order_id}</span>
              </Detail>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Section title="Payment history" lede="Every charge and manual payment linked to this invoice.">
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
                    <TableHead className="hidden md:table-cell">Reference</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="w-0">
                      <span className="sr-only">Refund</span>
                    </TableHead>
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
                            {payment.fx_rate ? ` @ ${payment.fx_rate.toFixed(4)}` : ""}
                          </span>
                        ) : null}
                        {payment.refunded_amount ? (
                          <span className="block text-xs text-muted-foreground">
                            {formatUsd(payment.refunded_amount)} refunded
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{payment.method ?? "—"}</TableCell>
                      <TableCell className="hidden max-w-[16rem] truncate font-mono text-xs md:table-cell">
                        {payment.reference ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.status === "paid" || payment.status === "partially_refunded" ? (
                          <RefundDialog
                            paymentId={payment.id}
                            amount={payment.amount}
                            refundedAmount={payment.refunded_amount ?? 0}
                            viaMercadoPago={Boolean(payment.mp_order_id)}
                          />
                        ) : null}
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
