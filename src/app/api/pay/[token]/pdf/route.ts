import { NextRequest, NextResponse } from "next/server";
import { renderInvoicePdf } from "@/server/billing/invoice-pdf";
import { isPayToken, loadInvoiceByToken } from "@/server/billing/invoice-pay";
import { statementDescriptor } from "@/server/billing/orders";

export const dynamic = "force-dynamic";

/** GET /api/pay/<token>/pdf — the invoice as a downloadable PDF. Same access as the pay link. */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!isPayToken(token)) return new NextResponse(null, { status: 404 });
  const invoice = await loadInvoiceByToken(token);
  if (!invoice || invoice.status === "draft") return new NextResponse(null, { status: 404 });

  const bytes = await renderInvoicePdf(invoice, { descriptor: statementDescriptor() });
  const filename = `${invoice.number.replace(/[^A-Za-z0-9-]/g, "")}.pdf`;
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
