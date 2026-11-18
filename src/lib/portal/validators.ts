import { paymentMethods, portalPlans } from "@/lib/portal/plans";
import type {
  ClientStatus,
  InvoiceBillingType,
  InvoiceStatus,
  PaymentStatus,
  PlanId,
  ProjectStatus,
  ReportStatus,
  TaxIdType,
} from "@/lib/portal/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clientStatuses: ClientStatus[] = ["active", "paused", "archived"];
const paymentStatuses: PaymentStatus[] = ["paid", "pending", "failed", "refunded"];
const reportStatuses: ReportStatus[] = ["draft", "published"];
const projectStatuses: ProjectStatus[] = [
  "planning",
  "active",
  "paused",
  "completed",
  "cancelled",
];
const invoiceStatuses: InvoiceStatus[] = ["draft", "sent", "paid", "failed", "void"];
const invoiceBillingTypes: InvoiceBillingType[] = ["one_time", "recurring"];
const taxIdTypes: TaxIdType[] = ["RFC", "CURP"];

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
  const hasTaxFields = formData.has("tax_id_type") || formData.has("tax_id_number");
  const taxIdTypeRaw = raw(formData, "tax_id_type");
  const taxIdType = taxIdTypeRaw ? oneOf(taxIdTypeRaw, taxIdTypes) : null;
  const taxIdNumber = text(raw(formData, "tax_id_number"), 40).toUpperCase();

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
  if (hasTaxFields) {
    if (taxIdTypeRaw && !taxIdType) return { error: "Choose RFC or CURP." };
    if (taxIdNumber && !taxIdType) return { error: "Choose RFC or CURP for the tax ID." };
    if (taxIdType && !validTaxId(taxIdType, taxIdNumber)) {
      return { error: `Enter a valid ${taxIdType}.` };
    }
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
      ...(hasTaxFields
        ? {
            tax_id_type: taxIdType,
            tax_id_number: taxIdNumber || null,
          }
        : {}),
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

export function parseProject(formData: FormData) {
  const name = text(raw(formData, "name"), 140);
  const description = text(raw(formData, "description"), 4000);
  const status = oneOf(raw(formData, "status"), projectStatuses);
  const started = raw(formData, "started_on");
  const due = raw(formData, "due_on");
  const notes = text(raw(formData, "notes"), 4000);
  const budgetRaw = raw(formData, "budget").replace(/[$,]/g, "");
  const budget = budgetRaw === "" ? null : Number(budgetRaw);
  const clientId = raw(formData, "client_id");

  if (!name) return { error: "Enter the project name." };
  if (!status) return { error: "Choose a project status." };
  if (started && !/^\d{4}-\d{2}-\d{2}$/.test(started)) {
    return { error: "Enter a valid start date." };
  }
  if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) {
    return { error: "Enter a valid due date." };
  }
  if (budget !== null && (!Number.isFinite(budget) || budget < 0 || budget > 10_000_000)) {
    return { error: "Enter a valid budget." };
  }
  if (clientId && !isUuid(clientId)) {
    return { error: "Choose a client for this project." };
  }

  return {
    value: {
      name,
      description: description || null,
      status,
      started_on: started || null,
      due_on: due || null,
      budget: budget === null ? null : Math.round(budget * 100) / 100,
      currency: "USD",
      notes: notes || null,
      ...(clientId ? { client_id: clientId } : {}),
    },
  };
}

export function parseProjectStatus(value: string) {
  return oneOf(value, projectStatuses);
}

export function parseInvoice(formData: FormData) {
  const title = text(raw(formData, "title"), 140);
  const description = text(raw(formData, "description"), 4000);
  const amount = Number(raw(formData, "amount").replace(/[$,]/g, ""));
  const billingType = oneOf(raw(formData, "billing_type"), invoiceBillingTypes);
  const period = text(raw(formData, "period_label"), 80);
  const dueOn = raw(formData, "due_on");
  const nextChargeOn = raw(formData, "next_charge_on");
  const paymentMethodId = raw(formData, "payment_method_id");
  const clientId = raw(formData, "client_id");
  const chargeNow = raw(formData, "charge_now") === "1" || raw(formData, "charge_now") === "on";
  const sendEmail = raw(formData, "send_email") === "1" || raw(formData, "send_email") === "on";

  if (!title) return { error: "Enter an invoice title." };
  if (!billingType) return { error: "Choose one-time or recurring." };
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) {
    return { error: "Enter an invoice amount." };
  }
  if (dueOn && !/^\d{4}-\d{2}-\d{2}$/.test(dueOn)) {
    return { error: "Enter a valid due date." };
  }
  if (nextChargeOn && !/^\d{4}-\d{2}-\d{2}$/.test(nextChargeOn)) {
    return { error: "Enter a valid next charge date." };
  }
  if (paymentMethodId && !isUuid(paymentMethodId)) {
    return { error: "Choose a valid payment method." };
  }
  if (clientId && !isUuid(clientId)) {
    return { error: "Choose a client for this invoice." };
  }

  return {
    value: {
      title,
      description: description || null,
      amount: Math.round(amount * 100) / 100,
      currency: "USD",
      billing_type: billingType,
      period_label: period || null,
      due_on: dueOn || null,
      next_charge_on:
        billingType === "recurring"
          ? nextChargeOn || dueOn || null
          : null,
      payment_method_id: paymentMethodId || null,
      ...(clientId ? { client_id: clientId } : {}),
      charge_now: chargeNow,
      send_email: sendEmail,
    },
  };
}

export function parseInvoiceStatus(value: string) {
  return oneOf(value, invoiceStatuses);
}

function validTaxId(type: TaxIdType, number: string) {
  if (type === "RFC") return /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(number);
  return /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/.test(number);
}
