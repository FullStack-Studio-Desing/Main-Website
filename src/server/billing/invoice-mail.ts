import { Resend } from "resend";
import { formatUsd } from "@/server/billing/plans";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendInvoiceEmail(input: {
  to: string;
  companyName: string;
  invoiceNumber: string;
  title: string;
  amount: number;
  billingType: "one_time" | "recurring";
  portalUrl: string;
  charged: boolean;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.RESEND_FROM?.trim() || "FullStack Studio Design <onboarding@resend.dev>";
  if (!apiKey) {
    return { ok: false, message: "Add RESEND_API_KEY before sending invoices by email." };
  }

  const amountLabel = formatUsd(input.amount);
  const kind = input.billingType === "recurring" ? "Recurring" : "One-time";
  const subject = input.charged
    ? `Payment received · ${input.invoiceNumber}`
    : `Invoice ${input.invoiceNumber} from FullStack Studio`;
  const headline = input.charged
    ? "We charged the card on file."
    : "Your invoice is ready.";
  const bodyLine = input.charged
    ? `${amountLabel} was charged to the payment method on file for ${escapeHtml(input.companyName)}.`
    : `Open your portal to review invoice ${escapeHtml(input.invoiceNumber)} and keep a card on file for future charges.`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [input.to],
    subject,
    html: `
      <div style="font-family: ui-sans-serif, system-ui, sans-serif; line-height: 1.5; color: #122018;">
        <p style="margin:0 0 12px;">${escapeHtml(headline)}</p>
        <p style="margin:0 0 12px;"><strong>${escapeHtml(input.title)}</strong></p>
        <p style="margin:0 0 12px;">
          ${escapeHtml(input.invoiceNumber)} · ${kind} · ${amountLabel}
        </p>
        <p style="margin:0 0 18px;">${bodyLine}</p>
        <p style="margin:0;">
          <a href="${escapeHtml(input.portalUrl)}" style="color:#1f6b4a;">Open client portal</a>
        </p>
      </div>
    `,
    text: [
      headline,
      input.title,
      `${input.invoiceNumber} · ${kind} · ${amountLabel}`,
      bodyLine.replace(/<[^>]+>/g, ""),
      input.portalUrl,
    ].join("\n"),
  });

  if (error) {
    console.error("[invoice] email failed", error.message);
    return { ok: false, message: "The invoice email could not be sent." };
  }
  return { ok: true };
}
