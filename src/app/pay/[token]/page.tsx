import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, CircleSlash } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { InvoicePreview } from "@/components/studio/invoice/InvoicePreview";
import { PayInvoiceForm } from "@/components/studio/invoice/PayInvoiceForm";
import { brand } from "@/data/site-copy";
import { formatCharge, formatDate } from "@/lib/portal/format";
import { getUsdQuote, toChargeAmount } from "@/server/billing/fx";
import { isPayToken, loadInvoiceByToken } from "@/server/billing/invoice-pay";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Invoice · ${brand.shortName}`,
  robots: { index: false, follow: false, nocache: true },
  // Keep the private token out of Referer headers sent to other sites.
  referrer: "strict-origin-when-cross-origin",
};

export default async function PayInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!isPayToken(token)) notFound();
  const invoice = await loadInvoiceByToken(token);
  if (!invoice) notFound();

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
    const chargeNote =
      quote && quote.currency !== "USD"
        ? `Mercado Pago processes this in Mexican pesos (${formatCharge(
            toChargeAmount(invoice.amount, quote),
            quote.currency,
          )} at today's rate). Your bank converts it back to US dollars.`
        : null;
    footer = (
      <PayInvoiceForm
        token={token}
        amount={invoice.amount}
        email={invoice.email}
        defaultName={invoice.contactName}
        chargeNote={chargeNote}
      />
    );
  } else {
    footer = (
      <div className="flex items-start gap-3">
        <CircleSlash className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        <div>
          <p className="font-medium text-foreground">This invoice is not open for payment</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoice.status === "void"
              ? "It was cancelled by the studio."
              : "It has not been issued yet."}{" "}
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
      <Link href="/" className="flex w-fit items-center gap-2.5 text-foreground">
        <LogoMark className="h-7 w-7" tone="ink" />
        <span className="text-lg font-semibold tracking-tight">{brand.shortName}</span>
      </Link>
      <div className="mx-auto w-full max-w-xl flex-1 py-8 sm:py-12">
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
          footer={footer}
          publicView
        />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {brand.name} · {brand.email}
        </p>
      </div>
    </main>
  );
}
