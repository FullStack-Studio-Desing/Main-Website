import { chargeInvoice, voidInvoice } from "@/lib/portal/billing-actions";
import { formatDate, formatUsd } from "@/lib/portal/format";
import type { InvoiceListItem, InvoiceRecord } from "@/lib/portal/types";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { StatusBadge } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function InvoiceActions({
  clientId,
  invoice,
}: {
  clientId: string;
  invoice: InvoiceRecord;
}) {
  if (invoice.status === "paid" || invoice.status === "void") return null;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <form
        action={async (formData) => {
          "use server";
          await chargeInvoice(clientId, invoice.id, formData);
        }}
      >
        <Button type="submit" size="sm" variant="brand">
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
    </div>
  );
}

export function InvoiceList({
  invoices,
  showCompany = false,
  adminActions = true,
}: {
  invoices: Array<InvoiceRecord | InvoiceListItem>;
  showCompany?: boolean;
  adminActions?: boolean;
}) {
  if (invoices.length === 0) {
    return <p className="text-base text-body">No invoices yet.</p>;
  }

  return (
    <Card>
      <CardContent className="divide-y divide-border p-0">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
          >
            <div>
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
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <StatusBadge status={invoice.status} />
              {adminActions ? (
                <InvoiceActions clientId={invoice.client_id} invoice={invoice} />
              ) : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
