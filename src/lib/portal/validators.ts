import { paymentMethods, portalPlans } from "@/lib/portal/plans";
import type {
  ClientStatus,
  PaymentStatus,
  PlanId,
  ReportStatus,
} from "@/lib/portal/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clientStatuses: ClientStatus[] = ["active", "paused", "archived"];
const paymentStatuses: PaymentStatus[] = ["paid", "pending", "failed", "refunded"];
const reportStatuses: ReportStatus[] = ["draft", "published"];

export function isUuid(value: string) {
  return UUID_RE.test(value);
}

function raw(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function text(value: string, max: number) {
  return value.slice(0, max).trim();
}

function oneOf<T extends string>(value: string, allowed: readonly T[]): T | null {
  return allowed.includes(value as T) ? (value as T) : null;
}

export function parseClient(formData: FormData) {
  const company = text(raw(formData, "company_name"), 120);
  const contact = text(raw(formData, "contact_name"), 120);
  const email = raw(formData, "email").toLowerCase();
  const phone = text(raw(formData, "phone"), 40);
  const status = oneOf(raw(formData, "status"), clientStatuses);
  const planId = oneOf(raw(formData, "plan_id"), portalPlans.map((plan) => plan.id));
  const planName = text(raw(formData, "plan_name"), 80);
  const notes = text(raw(formData, "billing_notes"), 4000);
  const started = raw(formData, "started_on");
  const amount = Number(raw(formData, "monthly_amount").replace(/[$,]/g, ""));

  if (!company) return { error: "Enter the company name." };
  if (!contact) return { error: "Enter the contact name." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email." };
  if (!status) return { error: "Choose a status." };
  if (!planId) return { error: "Choose a plan." };
  if (!planName) return { error: "Enter the plan name clients will see." };
  if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000) {
    return { error: "Enter a monthly amount." };
  }
  if (started && !/^\d{4}-\d{2}-\d{2}$/.test(started)) {
    return { error: "Enter a valid start date." };
  }

  return {
    value: {
      company_name: company,
      contact_name: contact,
      email,
      phone: phone || null,
      status,
      plan_id: planId as PlanId,
      plan_name: planName,
      monthly_amount: Math.round(amount * 100) / 100,
      currency: "USD",
      billing_notes: notes || null,
      started_on: started || null,
    },
  };
}

export function parsePayment(formData: FormData) {
  const amount = Number(raw(formData, "amount").replace(/[$,]/g, ""));
  const status = oneOf(raw(formData, "status"), paymentStatuses);
  const paidOn = raw(formData, "paid_on");
  const period = text(raw(formData, "period_label"), 80);
  const method = oneOf(raw(formData, "method"), paymentMethods);
  const reference = text(raw(formData, "reference"), 120);
  const notes = text(raw(formData, "notes"), 4000);

  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) {
    return { error: "Enter a payment amount." };
  }
  if (!status) return { error: "Choose a payment status." };
  if (paidOn && !/^\d{4}-\d{2}-\d{2}$/.test(paidOn)) {
    return { error: "Enter a valid payment date." };
  }

  return {
    value: {
      amount: Math.round(amount * 100) / 100,
      currency: "USD",
      status,
      paid_on: paidOn || null,
      period_label: period || null,
      method,
      reference: reference || null,
      notes: notes || null,
    },
  };
}

export function parseReport(formData: FormData) {
  const title = text(raw(formData, "title"), 140);
  const period = text(raw(formData, "period_label"), 80);
  const summary = text(raw(formData, "summary"), 8000);
  const traffic = text(raw(formData, "traffic"), 8000);
  const campaigns = text(raw(formData, "campaigns"), 8000);
  const pipeline = text(raw(formData, "pipeline"), 8000);
  const actions = text(raw(formData, "actions"), 8000);
  const status = oneOf(raw(formData, "status"), reportStatuses);

  if (!title) return { error: "Enter a report title." };
  if (!period) return { error: "Enter the week or month this report covers." };
  if (!status) return { error: "Choose whether this report is a draft or published." };
  if (![summary, traffic, campaigns, pipeline, actions].some(Boolean)) {
    return { error: "Write a summary or at least one section." };
  }

  return {
    value: {
      title,
      period_label: period,
      summary: summary || null,
      traffic: traffic || null,
      campaigns: campaigns || null,
      pipeline: pipeline || null,
      actions: actions || null,
      status,
    },
  };
}

export function parseLogin(formData: FormData) {
  const email = raw(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid login email." };
  if (password && (password.length < 8 || password.length > 72)) {
    return { error: "Passwords need to be 8 to 72 characters." };
  }
  return { value: { email, password: password || null } };
}

export function parsePaymentStatus(value: string) {
  return oneOf(value, paymentStatuses);
}
