import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { brand } from "@/data/site-copy";
import { formatCharge, formatDate, formatUsd } from "@/lib/portal/format";
import type { PublicInvoice } from "@/server/billing/invoice-pay";

const INK = rgb(0.07, 0.09, 0.08);
const MUTED = rgb(0.42, 0.45, 0.43);
const LINE = rgb(0.88, 0.89, 0.88);
const BAND = rgb(0.96, 0.965, 0.96);
const FOREST = rgb(0.075, 0.141, 0.102);

const STATUS_LABEL: Record<string, string> = {
  sent: "DUE",
  failed: "DUE",
  paid: "PAID",
  refunded: "REFUNDED",
  partially_refunded: "PARTLY REFUNDED",
  void: "VOID",
  draft: "DRAFT",
};

/** Standard PDF fonts are WinAnsi: swap characters they cannot encode. */
function safe(text: string) {
  return text
    .replace(/[−–]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E -ÿ—•…\n]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  for (const paragraph of safe(text).split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > width && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    lines.push(line);
  }
  return lines;
}

/** A one-page Letter PDF of the invoice, matching the pay page layout. */
export async function renderInvoicePdf(
  invoice: PublicInvoice,
  options: { descriptor: string },
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Invoice ${invoice.number}`);
  pdf.setAuthor(brand.name);
  pdf.setSubject(invoice.title);

  const page = pdf.addPage([612, 792]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);
  const left = 56;
  const right = 556;
  const width = right - left;

  const text = (
    value: string,
    x: number,
    y: number,
    opts: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; align?: "left" | "right" } = {},
  ) => {
    const font = opts.font ?? regular;
    const size = opts.size ?? 10;
    const content = safe(value);
    const drawX = opts.align === "right" ? x - font.widthOfTextAtSize(content, size) : x;
    page.drawText(content, { x: drawX, y, size, font, color: opts.color ?? INK });
  };
  const rule = (y: number) => page.drawLine({ start: { x: left, y }, end: { x: right, y }, thickness: 0.75, color: LINE });

  const settled = ["paid", "refunded", "partially_refunded"].includes(invoice.status);
  const due = settled || invoice.status === "void" ? 0 : invoice.amount;

  // Summary band
  page.drawRectangle({ x: 0, y: 612, width: 612, height: 180, color: BAND });
  drawLogo(page, left - 2, 760, 0.8);
  text(brand.name, left + 32, 748, { font: bold, size: 13 });
  text(brand.email, left + 32, 735, { size: 9, color: MUTED });
  drawBadge(page, bold, STATUS_LABEL[invoice.status] ?? invoice.status.toUpperCase(), right, 740);

  text(settled ? "Amount paid" : "Amount due", left, 690, { size: 10, color: MUTED });
  const big = formatUsd(invoice.amount);
  text(big, left, 652, { font: bold, size: 34 });
  text("USD", left + bold.widthOfTextAtSize(big, 34) + 8, 654, { size: 13, color: MUTED });
  text(
    settled
      ? `Paid${invoice.paidAt ? ` ${formatDate(invoice.paidAt)}` : ""}`
      : invoice.status === "void"
        ? "This invoice was cancelled"
        : invoice.dueOn
          ? `Due ${formatDate(invoice.dueOn)}`
          : "Due on receipt",
    left,
    632,
    { size: 10, color: MUTED },
  );

  // Meta row
  let y = 580;
  const meta: [string, string, PDFFont][] = [
    ["Invoice", invoice.number, mono],
    ["Issued", formatDate(invoice.issuedOn), bold],
    ["Due", invoice.dueOn ? formatDate(invoice.dueOn) : "On receipt", bold],
    ["Currency", "US dollars", bold],
  ];
  const col = width / 4;
  meta.forEach(([label, value, font], i) => {
    text(label, left + col * i, y, { size: 9, color: MUTED });
    text(value, left + col * i, y - 15, { font, size: font === mono ? 9.5 : 10 });
  });

  // From / Billed to
  y = 520;
  text("FROM", left, y, { font: bold, size: 8, color: MUTED });
  text(brand.name, left, y - 16, { font: bold, size: 10 });
  text(brand.email, left, y - 30, { size: 10, color: MUTED });
  const billX = left + width / 2;
  text("BILLED TO", billX, y, { font: bold, size: 8, color: MUTED });
  text(invoice.companyName, billX, y - 16, { font: bold, size: 10 });
  let billY = y - 30;
  if (invoice.contactName) {
    text(invoice.contactName, billX, billY, { size: 10, color: MUTED });
    billY -= 14;
  }
  text(invoice.email, billX, billY, { size: 10, color: MUTED });

  // Line item table
  y = 440;
  page.drawRectangle({ x: left, y: y - 6, width, height: 22, color: BAND });
  text("DESCRIPTION", left + 12, y, { font: bold, size: 8, color: MUTED });
  text("AMOUNT", right - 12, y, { font: bold, size: 8, color: MUTED, align: "right" });
  y -= 30;
  text(invoice.title, left + 12, y, { font: bold, size: 10.5 });
  text(formatUsd(invoice.amount), right - 12, y, { font: bold, size: 10.5, align: "right" });
  y -= 15;
  text(
    `${invoice.billingType === "recurring" ? "Recurring" : "One-time"}${invoice.periodLabel ? ` - ${invoice.periodLabel}` : ""}`,
    left + 12,
    y,
    { size: 9.5, color: MUTED },
  );
  if (invoice.description) {
    for (const line of wrap(invoice.description, regular, 9.5, width - 140).slice(0, 8)) {
      y -= 14;
      text(line, left + 12, y, { size: 9.5, color: MUTED });
    }
  }
  y -= 22;
  rule(y);

  // Totals
  const totals: [string, string][] = [["Subtotal", `${formatUsd(invoice.amount)} USD`]];
  if (settled) {
    totals.push([`Paid${invoice.paidAt ? ` ${formatDate(invoice.paidAt)}` : ""}`, `-${formatUsd(invoice.amount)} USD`]);
  }
  if (invoice.status === "refunded" || invoice.status === "partially_refunded") {
    totals.push(["Refund", invoice.status === "refunded" ? "Refunded in full" : "Partly refunded"]);
  }
  for (const [label, value] of totals) {
    y -= 18;
    text(label, left + 12, y, { size: 10, color: MUTED });
    text(value, right - 12, y, { size: 10, color: MUTED, align: "right" });
  }
  y -= 14;
  rule(y);
  y -= 22;
  text("Amount due", left + 12, y, { font: bold, size: 11 });
  text(`${formatUsd(due)} USD`, right - 12, y, { font: bold, size: 15, align: "right" });

  // Statement note
  y -= 48;
  text("ON YOUR CARD STATEMENT", left, y, { font: bold, size: 8, color: MUTED });
  y -= 16;
  text(options.descriptor, left, y, { font: mono, size: 10 });
  const charged = invoice.charged && invoice.charged.currency !== "USD" ? invoice.charged : null;
  const note = charged
    ? `Processed by Mercado Pago in Mexico as ${formatCharge(charged.amount, charged.currency)}; your bank converts it to US dollars. The name may show a Mercado Pago prefix.`
    : "Card payments are processed by Mercado Pago. The name may show a Mercado Pago prefix.";
  for (const line of wrap(note, regular, 9, width)) {
    y -= 13;
    text(line, left, y, { size: 9, color: MUTED });
  }

  text(`${brand.name} - ${brand.email}`, 306 - regular.widthOfTextAtSize(safe(`${brand.name} - ${brand.email}`), 8.5) / 2, 40, {
    size: 8.5,
    color: MUTED,
  });

  return pdf.save();
}

/** The stacked-diamond mark from LogoMark (32×32 viewBox), drawn as strokes. */
function drawLogo(page: PDFPage, x: number, y: number, scale: number) {
  const paths = [
    "M16 3.5 L26.5 9.5 L16 15.5 L5.5 9.5 Z",
    "M5.5 14.2 L16 20.2 L26.5 14.2",
    "M5.5 18.9 L16 24.9 L26.5 18.9",
  ];
  for (const path of paths) {
    page.drawSvgPath(path, { x, y, scale, borderColor: FOREST, borderWidth: 2.2 });
  }
}

function drawBadge(page: PDFPage, font: PDFFont, label: string, rightEdge: number, y: number) {
  const size = 8;
  const padX = 8;
  const w = font.widthOfTextAtSize(label, size) + padX * 2;
  page.drawRectangle({ x: rightEdge - w, y: y - 5, width: w, height: 18, color: INK, opacity: 0.9 });
  page.drawText(label, { x: rightEdge - w + padX, y: y + 1, size, font, color: rgb(1, 1, 1) });
}
