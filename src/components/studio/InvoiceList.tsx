import Link from "next/link";
import { chargeInvoice, voidInvoice } from "@/lib/portal/billing-actions";
import { formatDate, formatUsd } from "@/lib/portal/format";
import { loadInvoiceTokens } from "@/lib/portal/invoice-queries";
import type { InvoiceListItem, InvoiceRecord } from "@/lib/portal/types";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { CopyPayLinkButton } from "@/components/studio/invoice/CopyPayLinkButton";
import { StatusBadge } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function InvoiceActions({
  clientId,
  invoice,
  payPath,
}: {
  clientId: string;
  invoice: InvoiceRecord;
  payPath: string | null;
}) {
  const open = invoice.status === "draft" || invoice.status === "sent" || invoice.status === "failed";
  return (
    <div className="flex flex-wrap items-center gap-3">
      {payPath && invoice.status !== "void" ? (
        <CopyPayLinkButton path={payPath} label="" variant="ghost" size="icon" className="h-8 w-8" />
      ) : null}
      {open ? (
        <>
          <form
            action={async (formData) => {
              "use server";
              await chargeInvoice(clientId, invoice.id, formData);
            }}
          >
            <Button type="submit" size="sm">
              Charge card
            </Button>
          </form>
          <ConfirmForm
            action={async (formData) => {
              "use server";
              await voidInvoice(clientId, invoice.id, formData);
            }}
            message={`Void invoice ${invoice.number}?`}
            label="Void"
          />
        </>
      ) : null}
    </div>
  );
}

export async function InvoiceList({
  invoices,
  showCompany = false,
  adminActions = true,
}: {
  invoices: Array<InvoiceRecord | InvoiceListItem>;
  showCompany?: boolean;
  adminActions?: boolean;
}) {
  if (invoices.length === 0) {
    return <p className="text-sm text-muted-foreground">No invoices yet.</p>;
  }

  // queries.ts does not map public_token, so look the pay tokens up here.
  const missing = invoices.filter((invoice) => !invoice.public_token).map((invoice) => invoice.id);
  const tokens = await loadInvoiceTokens(missing);
  const payPathFor = (invoice: InvoiceRecord) => {
    const token = invoice.public_token ?? tokens[invoice.id];
    return token ? `/pay/${token}` : null;
  };

  return (
    <Card>
      <CardContent className="divide-y divide-border p-0">
        {invoices.map((invoice) => {
          const payPath = payPathFor(invoice);
          const payable = invoice.status === "sent" || invoice.status === "failed";
          const summary = (
            <>
              <p className="text-base font-medium text-foreground">
                {formatUsd(invoice.amount)}
                {" · "}
                {invoice.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {invoice.number}
                {showCompany && "company_name" in invoice ? ` · ${invoice.company_name}` : ""}
                {invoice.period_label ? ` · ${invoice.period_label}` : ""}
                {" · "}
                {invoice.billing_type === "recurring" ? "Recurring" : "One-time"}
                {invoice.due_on ? ` · due ${formatDate(invoice.due_on)}` : ""}
              </p>
            </>
          );

          return (
            <div
              key={invoice.id}
              className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              {adminActions ? (
                <Link
                  href={`/admin/invoices/${invoice.id}`}
                  className="-m-2 rounded-md p-2 transition-colors hover:bg-muted/50"
                >
                  {summary}
                </Link>
              ) : (
                <div>{summary}</div>
              )}
              <div className="flex flex-col items-start gap-3 sm:items-end">
                <StatusBadge status={invoice.status} />
                {adminActions ? (
                  <InvoiceActions clientId={invoice.client_id} invoice={invoice} payPath={payPath} />
                ) : payPath && (payable || invoice.status === "paid" || invoice.status === "refunded" || invoice.status === "partially_refunded") ? (
                  <Button asChild size="sm" variant={payable ? "default" : "outline"}>
                    <Link href={payPath}>{payable ? `Pay ${formatUsd(invoice.amount)}` : "Receipt"}</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
