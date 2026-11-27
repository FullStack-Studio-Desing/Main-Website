import { Resend } from "resend";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function excerpt(text: string, max = 300) {
  const trimmed = text.replace(/\s+/g, " ").trim();
  return trimmed.length <= max ? trimmed : `${trimmed.slice(0, max - 1)}…`;
}

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

function supportInbox(): string[] {
  const raw = process.env.SUPPORT_NOTIFY_EMAIL?.trim() || process.env.PORTAL_ADMIN_EMAILS?.trim() || "";
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

const lastSent = new Map<string, number>();
const COOLDOWN_MS = 5 * 60 * 1000;

function shouldSend(key: string) {
  const now = Date.now();
  const prev = lastSent.get(key) ?? 0;
  if (now - prev < COOLDOWN_MS) return false;
  lastSent.set(key, now);
  return true;
}

async function sendMail(input: {
  to: string[];
  subject: string;
  html: string;
  text: string;
  cooldownKey: string;
}): Promise<void> {
  if (!input.to.length) return;
  if (!shouldSend(input.cooldownKey)) return;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.RESEND_FROM?.trim() || "FullStack Studio Design <onboarding@resend.dev>";
  if (!apiKey) {
    console.warn("[ticket-mail] RESEND_API_KEY missing");
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
  if (error) console.warn("[ticket-mail]", error.message);
}

export async function notifyStudioNewTicket(input: {
  number: string;
  companyName: string;
  title: string;
  description: string;
}) {
  const url = `${siteOrigin()}/admin/tickets/${encodeURIComponent(input.number)}`;
  await sendMail({
    to: supportInbox(),
    cooldownKey: `studio:new:${input.number}`,
    subject: `New ticket ${input.number} from ${input.companyName}: ${input.title}`,
    html: `
      <p><strong>${escapeHtml(input.companyName)}</strong> opened ${escapeHtml(input.number)}.</p>
      <p>${escapeHtml(input.title)}</p>
      <p style="white-space:pre-line">${escapeHtml(excerpt(input.description))}</p>
      <p><a href="${escapeHtml(url)}">Open in CRM</a></p>`,
    text: `New ${input.number}: ${input.title}\n${excerpt(input.description)}\n${url}`,
  });
}

export async function notifyStudioClientReply(input: {
  number: string;
  companyName: string;
  body: string;
}) {
  const url = `${siteOrigin()}/admin/tickets/${encodeURIComponent(input.number)}`;
  await sendMail({
    to: supportInbox(),
    cooldownKey: `studio:reply:${input.number}`,
    subject: `${input.companyName} replied on ${input.number}`,
    html: `
      <p>${escapeHtml(input.companyName)} replied on ${escapeHtml(input.number)}.</p>
      <p style="white-space:pre-line">${escapeHtml(excerpt(input.body))}</p>
      <p><a href="${escapeHtml(url)}">Open in CRM</a></p>`,
    text: `${input.companyName} replied on ${input.number}\n${excerpt(input.body)}\n${url}`,
  });
}

export async function notifyClientStudioReply(input: {
  number: string;
  to: string[];
  projectName: string | null;
  body: string;
  /** Set when the same reply also resolved or closed the ticket. */
  status?: "resolved" | "closed" | null;
}) {
  const url = `${siteOrigin()}/portal/tickets/${encodeURIComponent(input.number)}`;
  const suffix = input.status ? ` · ${statusLabel[input.status]}` : "";
  await sendMail({
    to: input.to,
    cooldownKey: `client:reply:${input.number}`,
    subject: `The studio replied on ${input.number}${suffix}`,
    html: `
      <p>There is a new reply on ${escapeHtml(input.number)}${input.projectName ? ` (${escapeHtml(input.projectName)})` : ""}.</p>
      <p style="white-space:pre-line">${escapeHtml(excerpt(input.body))}</p>
      <p><a href="${escapeHtml(url)}">View ticket</a></p>`,
    text: `Reply on ${input.number}\n${excerpt(input.body)}\n${url}`,
  });
}

const statusLabel = {
  awaiting_client: "Waiting on you",
  resolved: "Resolved",
  closed: "Closed",
} as const;

export async function notifyClientTicketReceived(input: {
  number: string;
  to: string[];
  title: string;
}) {
  const url = `${siteOrigin()}/portal/tickets/${encodeURIComponent(input.number)}`;
  await sendMail({
    to: input.to,
    cooldownKey: `client:received:${input.number}`,
    subject: `We received ${input.number}: ${input.title}`,
    html: `
      <p>Thanks. We received ${escapeHtml(input.number)} and will reply in the portal.</p>
      <p>${escapeHtml(input.title)}</p>
      <p><a href="${escapeHtml(url)}">View ticket</a></p>`,
    text: `We received ${input.number}: ${input.title}\n${url}`,
  });
}

export async function notifyClientStatusChange(input: {
  number: string;
  to: string[];
  status: keyof typeof statusLabel;
}) {
  const url = `${siteOrigin()}/portal/tickets/${encodeURIComponent(input.number)}`;
  const lines = {
    awaiting_client: "The studio needs something from you to keep going.",
    resolved: "This ticket is marked resolved. Reopen it from the portal within 14 days if you need more help.",
    closed: "This ticket is closed. Open a new ticket from the portal if you need anything else.",
  } as const;
  await sendMail({
    to: input.to,
    cooldownKey: `client:status:${input.number}:${input.status}`,
    subject: `${input.number} · ${statusLabel[input.status]}`,
    html: `
      <p>${escapeHtml(input.number)}: ${escapeHtml(lines[input.status])}</p>
      <p><a href="${escapeHtml(url)}">View ticket</a></p>`,
    text: `${input.number}: ${lines[input.status]}\n${url}`,
  });
}

export async function notifyStudioClientResolved(input: {
  number: string;
  companyName: string;
}) {
  const url = `${siteOrigin()}/admin/tickets/${encodeURIComponent(input.number)}`;
  await sendMail({
    to: supportInbox(),
    cooldownKey: `studio:resolved:${input.number}`,
    subject: `${input.companyName} resolved ${input.number}`,
    html: `
      <p>${escapeHtml(input.companyName)} marked ${escapeHtml(input.number)} resolved.</p>
      <p><a href="${escapeHtml(url)}">Open in CRM</a></p>`,
    text: `${input.companyName} resolved ${input.number}\n${url}`,
  });
}

export async function notifyStudioClientReopened(input: {
  number: string;
  companyName: string;
}) {
  const url = `${siteOrigin()}/admin/tickets/${encodeURIComponent(input.number)}`;
  await sendMail({
    to: supportInbox(),
    cooldownKey: `studio:reopened:${input.number}`,
    subject: `${input.companyName} reopened ${input.number}`,
    html: `
      <p>${escapeHtml(input.companyName)} reopened ${escapeHtml(input.number)}.</p>
      <p><a href="${escapeHtml(url)}">Open in CRM</a></p>`,
    text: `${input.companyName} reopened ${input.number}\n${url}`,
  });
}
