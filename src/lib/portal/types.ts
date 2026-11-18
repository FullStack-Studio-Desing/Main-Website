export type Role = "admin" | "client";
export type ClientStatus = "active" | "paused" | "archived";
export type PlanId = "starter" | "growth" | "scale" | "custom";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type ReportStatus = "draft" | "published";
export type ProjectStatus =
  | "planning"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";
export type InvoiceStatus = "draft" | "sent" | "paid" | "failed" | "void";
export type InvoiceBillingType = "one_time" | "recurring";
export type PaymentMethodStatus = "active" | "removed";
export type TaxIdType = "RFC" | "CURP";

export type ActionState = {
  error?: string;
  notice?: string;
  password?: string;
} | null;

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  client_id: string | null;
};

export type ClientRecord = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  status: ClientStatus;
  plan_id: PlanId;
  plan_name: string;
  monthly_amount: number;
  currency: string;
  billing_notes: string | null;
  started_on: string | null;
  mp_customer_id: string | null;
  tax_id_type: TaxIdType | null;
  tax_id_number: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentRecord = {
  id: string;
  client_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paid_on: string | null;
  period_label: string | null;
  method: string | null;
  reference: string | null;
  notes: string | null;
  invoice_id: string | null;
  mp_order_id: string | null;
  created_at: string;
};

export type PaymentMethodRecord = {
  id: string;
  client_id: string;
  mp_customer_id: string;
  mp_card_id: string;
  brand: string | null;
  last_four: string | null;
  exp_month: number | null;
  exp_year: number | null;
  holder_name: string | null;
  is_default: boolean;
  status: PaymentMethodStatus;
  created_at: string;
  updated_at: string;
};

export type InvoiceRecord = {
  id: string;
  client_id: string;
  payment_method_id: string | null;
  payment_id: string | null;
  number: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  billing_type: InvoiceBillingType;
  status: InvoiceStatus;
  period_label: string | null;
  due_on: string | null;
  next_charge_on: string | null;
  mp_order_id: string | null;
  sent_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type InvoiceListItem = InvoiceRecord & {
  company_name: string;
};

export type ReportRecord = {
  id: string;
  client_id: string;
  title: string;
  period_label: string;
  summary: string | null;
  traffic: string | null;
  campaigns: string | null;
  pipeline: string | null;
  actions: string | null;
  status: ReportStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectRecord = {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  started_on: string | null;
  due_on: string | null;
  budget: number | null;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectListItem = ProjectRecord & {
  company_name: string;
};

export type PaymentListItem = PaymentRecord & {
  company_name: string;
};

export type PortalLogin = {
  id: string;
  email: string;
  full_name: string | null;
};

export type ClientListItem = ClientRecord & {
  latest_payment: Pick<
    PaymentRecord,
    "status" | "amount" | "currency" | "paid_on"
  > | null;
};

export type DirectoryStats = {
  active: number;
  collected: number;
  reports: number;
  projects: number;
  monthLabel: string;
};
