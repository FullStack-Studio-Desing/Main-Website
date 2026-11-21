import type { ReactNode } from "react";
import { LogoMark } from "@/components/LogoMark";
import { StatusBadge } from "@/components/studio/ui";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { brand } from "@/data/site-copy";
import { formatDate, formatUsd } from "@/lib/portal/format";
import { cn } from "@/lib/utils";

export type InvoicePreviewData = {
  number: string;
  title: string;
  description: string | null;
  amount: number;
  status: string;
  billingType: "one_time" | "recurring";
  issuedOn: string;
  dueOn: string | null;
  periodLabel: string | null;
  paidAt: string | null;
  companyName: string;
  contactName: string | null;
  email: string;
};

/** Every amount on an invoice is in US dollars; say so explicitly. */
function usd(amount: number) {
  return `${formatUsd(amount)} USD`;
}

/** Shared invoice layout for the public pay page and the admin detail page. */
export function InvoicePreview({
  invoice,
  footer,
  className,
  publicView = false,
}: {
  invoice: InvoicePreviewData;
  footer?: ReactNode;
  className?: string;
  /** Clients see "Due" instead of internal sent/failed states. */
  publicView?: boolean;
}) {
  const settled =
    invoice.status === "paid" || invoice.status === "refunded" || invoice.status === "partially_refunded";
  const due = settled || invoice.status === "void" ? 0 : invoice.amount;
  const open = invoice.status === "sent" || invoice.status === "failed";

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Summary band: who it's from, the number, and the one figure that matters. */}
      <div className="border-b bg-muted/50 px-6 py-6 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8" tone="ink" />
            <div className="leading-tight">
              <p className="font-semibold tracking-tight text-foreground">{brand.name}</p>
              <p className="text-xs text-muted-foreground">{brand.email}</p>
            </div>
          </div>
          {publicView && open ? (
            <Badge variant="secondary">Due</Badge>
          ) : (
            <StatusBadge status={invoice.status} />
          )}
        </div>

        <div className="mt-8 flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">
            {settled ? "Amount paid" : invoice.status === "void" ? "Invoice amount" : "Amount due"}
          </p>
          <p className="text-4xl font-semibold tabular-nums tracking-tight text-foreground">
            {formatUsd(invoice.amount)}
            <span className="ml-2 align-middle text-base font-medium text-muted-foreground">USD</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {settled
              ? `Paid${invoice.paidAt ? ` ${formatDate(invoice.paidAt)}` : ""}`
              : invoice.status === "void"
                ? "This invoice was cancelled"
                : invoice.dueOn
                  ? `Due ${formatDate(invoice.dueOn)}`
                  : "Due on receipt"}
          </p>
        </div>
      </div>

      <CardContent className="space-y-8 px-6 py-6 sm:px-8">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm sm:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
          <Meta label="Invoice" className="col-span-2 sm:col-span-1">
            <span className="font-mono text-[13px]">{invoice.number}</span>
          </Meta>
          <Meta label="Issued">{formatDate(invoice.issuedOn)}</Meta>
          <Meta label="Due">{invoice.dueOn ? formatDate(invoice.dueOn) : "On receipt"}</Meta>
          <Meta label="Currency">US dollars</Meta>
        </dl>

        <div className="grid gap-6 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">From</p>
            <p className="mt-2 font-medium text-foreground">{brand.name}</p>
            <p className="text-muted-foreground">{brand.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Billed to</p>
            <p className="mt-2 font-medium text-foreground">{invoice.companyName}</p>
            {invoice.contactName ? <p className="text-muted-foreground">{invoice.contactName}</p> : null}
            <p className="break-all text-muted-foreground">{invoice.email}</p>
          </div>
        </div>

        <div className="rounded-lg border">
          <div className="flex justify-between gap-4 border-b bg-muted/40 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span>Description</span>
            <span>Amount</span>
          </div>
          <div className="flex items-start justify-between gap-4 px-4 py-4 text-sm">
            <div className="min-w-0">
              <p className="font-medium text-foreground">{invoice.title}</p>
              <p className="mt-0.5 text-muted-foreground">
                {invoice.billingType === "recurring" ? "Recurring" : "One-time"}
                {invoice.periodLabel ? ` · ${invoice.periodLabel}` : ""}
              </p>
              {invoice.description ? (
                <p className="mt-2 whitespace-pre-line text-muted-foreground">{invoice.description}</p>
              ) : null}
            </div>
            <p className="shrink-0 font-medium tabular-nums text-foreground">{formatUsd(invoice.amount)}</p>
          </div>

          <dl className="space-y-2 border-t px-4 py-4 text-sm">
            <Total label="Subtotal">{usd(invoice.amount)}</Total>
            {settled ? (
              <Total label={`Paid${invoice.paidAt ? ` ${formatDate(invoice.paidAt)}` : ""}`}>
                −{usd(invoice.amount)}
              </Total>
            ) : null}
            {invoice.status === "refunded" || invoice.status === "partially_refunded" ? (
              <Total label="Refund">
                {invoice.status === "refunded" ? "Refunded in full" : "Partly refunded"}
              </Total>
            ) : null}
            <div className="flex items-baseline justify-between gap-4 border-t pt-3">
              <dt className="font-medium text-foreground">Amount due</dt>
              <dd className="text-lg font-semibold tabular-nums tracking-tight text-foreground">{usd(due)}</dd>
            </div>
          </dl>
        </div>
      </CardContent>

      {footer ? <CardFooter className="block border-t px-6 py-6 sm:px-8">{footer}</CardFooter> : null}
    </Card>
  );
}

function Meta({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-medium text-foreground">{children}</dd>
    </div>
  );
}

function Total({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-muted-foreground">
      <dt>{label}</dt>
      <dd className="tabular-nums">{children}</dd>
    </div>
  );
}
