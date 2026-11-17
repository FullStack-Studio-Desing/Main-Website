import nodemailer from "nodemailer";

const emailed = new Set<string>();

export async function notifyPaidOrder(input: {
  orderId: string;
  planName: string;
  amountLabel: string;
  email: string;
  status: string;
}) {
  if (!input.orderId || emailed.has(input.orderId)) return;
  const user = process.env.EMAIL_SENDER;
  const pass = process.env.EMAIL_PASSWORD;
  const to = process.env.EMAIL_RECEIVER;
  if (!user || !pass || !to) return;

  emailed.add(input.orderId);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: user,
      to,
      subject: `Mercado Pago payment ${input.status}: ${input.planName}`,
      text: [
        `Plan: ${input.planName}`,
        `Amount: ${input.amountLabel}`,
        `Payer: ${input.email}`,
        `Order: ${input.orderId}`,
        `Status: ${input.status}`,
      ].join("\n"),
    });
  } catch (error) {
    emailed.delete(input.orderId);
    console.error("[mercadopago] payment email failed", error instanceof Error ? error.message : "unknown");
  }
}
