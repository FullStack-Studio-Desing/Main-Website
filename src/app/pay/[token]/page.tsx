import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, CircleSlash } from "lucide-react";
import { InvoicePreview } from "@/components/studio/invoice/InvoicePreview";
import { Card, CardContent } from "@/components/ui/card";
import { InvoiceShareActions } from "@/components/studio/invoice/InvoiceShareActions";
import { PayInvoiceForm } from "@/components/studio/invoice/PayInvoiceForm";
import { brand } from "@/data/site-copy";
import { formatCharge, formatDate } from "@/lib/portal/format";
import { StatementPreview, type StatementLine } from "@/components/studio/invoice/StatementPreview";
import { getUsdQuote, toChargeAmount } from "@/server/billing/fx";
import { statementDescriptor } from "@/server/billing/orders";
import { isPayToken, loadInvoiceByToken } from "@/server/billing/invoice-pay";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Invoice · ${brand.shortName}`,
  robots: { index: false, follow: false, nocache: true },
  // Keep the private token out of Referer headers sent to other sites.
  referrer: "strict-origin-when-cross-origin",
};

export default async function PayInvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!isPayToken(token)) notFound();
  const invoice = await loadInvoiceByToken(token);
  if (!invoice) notFound();

  const shortDate = (value: Date) =>
    new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "America/New_York" }).format(
      value,
    );

  let footer: React.ReactNode;
  if (invoice.status === "paid") {
    footer = (
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-foreground" aria-hidden />
        <div>
          <p className="font-medium text-foreground">
            Paid{invoice.paidAt ? ` on ${formatDate(invoice.paidAt)}` : ""}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Thank you. Keep this page as your receipt for {invoice.number}.
          </p>
          <div className="mt-4">
            <StatementPreview
              settled
              line={{
                descriptor: statementDescriptor(),
                date: shortDate(invoice.paidAt ? new Date(invoice.paidAt) : new Date()),
                usd: invoice.amount,
                chargedAs:
                  invoice.charged && invoice.charged.currency !== "USD"
                    ? formatCharge(invoice.charged.amount, invoice.charged.currency)
                    : null,
              }}
            />
          </div>
        </div>
      </div>
    );
  } else if (invoice.status === "refunded" || invoice.status === "partially_refunded") {
    footer = (
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-foreground" aria-hidden />
        <div>
          <p className="font-medium text-foreground">
            {invoice.status === "refunded" ? "Paid and refunded" : "Paid, partly refunded"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Refunds go back to the card that paid and can take 5–10 business days to appear. Questions? Email{" "}
            <a href={`mailto:${brand.email}`} className="underline underline-offset-4">
              {brand.email}
            </a>
            .
          </p>
        </div>
      </div>
    );
  } else if (invoice.payable) {
    const quote = await getUsdQuote();
    const statement: StatementLine = {
      descriptor: statementDescriptor(),
      date: shortDate(new Date()),
      usd: invoice.amount,
      chargedAs:
        quote && quote.currency !== "USD"
          ? formatCharge(toChargeAmount(invoice.amount, quote), quote.currency)
          : null,
    };
    footer = (
      <PayInvoiceForm
        token={token}
        amount={invoice.amount}
        email={invoice.email}
        defaultName={invoice.contactName}
        statement={statement}
        savedCards={invoice.savedCards}
      />
    );
  } else {
    footer = (
      <div className="flex items-start gap-3">
        <CircleSlash className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        <div>
          <p className="font-medium text-foreground">This invoice is not open for payment</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoice.status === "void" ? "It was cancelled by the studio." : "It has not been issued yet."}{" "}
            Questions? Email{" "}
            <a href={`mailto:${brand.email}`} className="underline underline-offset-4">
              {brand.email}
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="studio-app flex min-h-dvh flex-col bg-muted/40 px-4 py-6 text-foreground sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-xl flex-1 pb-8 sm:pb-12 lg:max-w-6xl">
        <div className="mb-3">
          <InvoiceShareActions pdfPath={`/api/pay/${token}/pdf`} number={invoice.number} />
        </div>
        {/* Wide screens: the payment column matches the invoice's height (same top and bottom line) and
            scrolls inside itself; its content is absolutely positioned so only the invoice sets the row height.
            Narrow: one column. */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-stretch">
          <InvoicePreview
            invoice={{
              number: invoice.number,
              title: invoice.title,
              description: invoice.description,
              amount: invoice.amount,
              status: invoice.status,
              billingType: invoice.billingType,
              issuedOn: invoice.issuedOn,
              dueOn: invoice.dueOn,
              periodLabel: invoice.periodLabel,
              paidAt: invoice.paidAt,
              companyName: invoice.companyName,
              contactName: invoice.contactName,
              email: invoice.email,
            }}
            publicView
          />
          <div className="lg:relative">
            <Card className="lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <CardContent className="p-6 sm:p-8">{footer}</CardContent>
            </Card>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {brand.name} · {brand.email}
        </p>
      </div>
    </main>
  );
}
