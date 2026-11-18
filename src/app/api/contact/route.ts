import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.RESEND_TO;
    const from =
      process.env.RESEND_FROM ||
      "FullStack Studio Design <onboarding@resend.dev>";

    if (!apiKey || !to) {
      console.error("Missing RESEND_API_KEY or RESEND_TO");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, company, budget, message, service } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const safeName = escapeHtml(String(name));
    const safeEmail = escapeHtml(String(email));
    const safeCompany = company ? escapeHtml(String(company)) : "";
    const safeService = service ? escapeHtml(String(service)) : "";
    const safeBudget = budget ? escapeHtml(String(budget)) : "";
    const safeMessage = escapeHtml(String(message)).replace(/\n/g, "<br>");

    const resend = new Resend(apiKey);

    const { error: notifyError } = await resend.emails.send({
      from,
      to: [to],
      replyTo: String(email),
      subject: `New Contact Form Submission from ${String(name)}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #e5e5e5;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 25px; font-weight: 600;">
            New Contact Form Submission
          </h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; width: 120px; font-size: 14px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 500;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <a href="mailto:${safeEmail}" style="color: #1a1a1a; font-weight: 500;">${safeEmail}</a>
              </td>
            </tr>
            ${
              safeCompany
                ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Company</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 500;">${safeCompany}</td>
            </tr>
            `
                : ""
            }
            ${
              safeService
                ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Service</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 500;">${safeService}</td>
            </tr>
            `
                : ""
            }
            ${
              safeBudget
                ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Budget</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 500;">${safeBudget}</td>
            </tr>
            `
                : ""
            }
          </table>

          <div style="margin-top: 25px;">
            <h3 style="color: #1a1a1a; margin-bottom: 12px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</h3>
            <div style="color: #333; line-height: 1.7; background: #f9f9f9; padding: 20px; border-radius: 6px; font-size: 15px;">
              ${safeMessage}
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            This email was sent from the FullStack Studio Design contact form.
          </div>
        </div>
      `,
    });

    if (notifyError) {
      console.error("Resend notify error:", notifyError);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    const { error: autoReplyError } = await resend.emails.send({
      from,
      to: [String(email)],
      subject: "Thanks for reaching out to FullStack Studio Design!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #e5e5e5;">
          <h2 style="color: #1a1a1a; margin-bottom: 25px; font-weight: 600;">
            Thanks for reaching out, ${safeName}!
          </h2>

          <p style="color: #333; line-height: 1.8; margin-bottom: 20px; font-size: 15px;">
            We've received your message and will get back to you within 24 hours.
          </p>

          <p style="color: #333; line-height: 1.8; margin-bottom: 20px; font-size: 15px;">
            In the meantime, feel free to check out our services and plans at
            <a href="https://fullstackstudiodesign.com" style="color: #1a1a1a; font-weight: 500;">fullstackstudiodesign.com</a>.
          </p>

          <p style="color: #666; margin-top: 30px; font-size: 15px;">
            Best regards,<br>
            <strong style="color: #1a1a1a;">The FullStack Studio Design Team</strong>
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            FullStack Studio Design. Websites, apps, marketing, sales, AI, and CRMs.
          </div>
        </div>
      `,
    });

    if (autoReplyError) {
      // Sandbox / unverified domain often blocks auto-reply to arbitrary addresses.
      console.warn("Resend auto-reply skipped:", autoReplyError);
    }

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
