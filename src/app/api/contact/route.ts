import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, budget, message, service } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Email content - Clean professional template
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: process.env.EMAIL_RECEIVER,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #e5e5e5;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 25px; font-weight: 600;">
            New Contact Form Submission
          </h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; width: 120px; font-size: 14px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <a href="mailto:${email}" style="color: #1a1a1a; font-weight: 500;">${email}</a>
              </td>
            </tr>
            ${company ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Company</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 500;">${company}</td>
            </tr>
            ` : ''}
            ${service ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Service</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 500;">${service}</td>
            </tr>
            ` : ''}
            ${budget ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Budget</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: 500;">${budget}</td>
            </tr>
            ` : ''}
          </table>

          <div style="margin-top: 25px;">
            <h3 style="color: #1a1a1a; margin-bottom: 12px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</h3>
            <div style="color: #333; line-height: 1.7; background: #f9f9f9; padding: 20px; border-radius: 6px; font-size: 15px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            This email was sent from the FullStack Studio Design contact form.
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send auto-reply to the user
    const autoReplyOptions = {
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: "Thanks for reaching out to FullStack Studio Design!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #e5e5e5;">
          <h2 style="color: #1a1a1a; margin-bottom: 25px; font-weight: 600;">
            Thanks for reaching out, ${name}!
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
            FullStack Studio Design. Websites, marketing, sales growth, AI automation, and custom CRMs.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(autoReplyOptions);

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
