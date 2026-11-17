export type Role = "admin" | "client";
export type ClientStatus = "active" | "paused" | "archived";
export type PlanId = "starter" | "growth" | "scale" | "custom";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type ReportStatus = "draft" | "published";

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
  created_at: string;
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
  monthLabel: string;
};
