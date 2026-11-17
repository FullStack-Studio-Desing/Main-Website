import type {
  ClientRecord,
  PaymentRecord,
  PortalLogin,
  ReportRecord,
} from "@/lib/portal/types";

export function showPreview() {
  return process.env.NODE_ENV === "development";
}

const northwind: ClientRecord = {
  id: "sample-northwind",
  company_name: "Northwind Supply",
  contact_name: "Lena Ortiz",
  email: "lena@northwind.example",
  phone: "(415) 555-0148",
  status: "active",
  plan_id: "growth",
  plan_name: "Growth",
  monthly_amount: 1500,
  currency: "USD",
  billing_notes: "Media spend is billed by the ad platforms. Strategy call on the first Tuesday.",
  started_on: "2026-09-01",
  created_at: "2026-09-01T15:00:00.000Z",
  updated_at: "2026-11-10T15:00:00.000Z",
};

const bright: ClientRecord = {
  id: "sample-bright",
  company_name: "Bright Parcel Co.",
  contact_name: "Jon Hale",
  email: "jon@brightparcel.example",
  phone: null,
  status: "paused",
  plan_id: "starter",
  plan_name: "Starter",
  monthly_amount: 999,
  currency: "USD",
  billing_notes: null,
  started_on: "2026-07-15",
  created_at: "2026-07-15T15:00:00.000Z",
  updated_at: "2026-10-01T15:00:00.000Z",
};

const payments: PaymentRecord[] = [
  {
    id: "sample-payment-nov",
    client_id: northwind.id,
    amount: 1500,
    currency: "USD",
    status: "pending",
    paid_on: null,
    period_label: "November 2026",
    method: "Card",
    reference: null,
    notes: "Invoice sent Nov 1.",
    created_at: "2026-11-01T15:00:00.000Z",
  },
  {
    id: "sample-payment-oct",
    client_id: northwind.id,
    amount: 1500,
    currency: "USD",
    status: "paid",
    paid_on: "2026-10-02",
    period_label: "October 2026",
    method: "Card",
    reference: "MP-10442",
    notes: null,
    created_at: "2026-10-02T15:00:00.000Z",
  },
];

const reports: ReportRecord[] = [
  {
    id: "sample-report-draft",
    client_id: northwind.id,
    title: "Week of Nov 17",
    period_label: "Week of Nov 17, 2026",
    summary: "Draft. Numbers land Friday.",
    traffic: null,
    campaigns: null,
    pipeline: null,
    actions: "Confirm the two stale proposals before the report is published.",
    status: "draft",
    published_at: null,
    created_at: "2026-11-17T15:00:00.000Z",
    updated_at: "2026-11-17T15:00:00.000Z",
  },
  {
    id: "sample-report-nov10",
    client_id: northwind.id,
    title: "What the ads earned",
    period_label: "Week of Nov 10, 2026",
    summary:
      "Google search paid for itself. The Meta prospecting set did not, and the repair page is still dropping mobile visitors.",
    traffic:
      "Organic sessions were flat at 1,140. Paid search brought 86 inquiries at $41 each, down from $54 the week before. Direct traffic is mostly returning customers.",
    campaigns:
      "The emergency-repair search campaign spent $3,520 and booked 11 calls. The Meta lookalike spent $900 and booked one. That ad set should pause on Monday.",
    pipeline:
      "14 form fills, 9 booked calls, and 4 proposals went out. Two proposals have been open since Nov 3 with no follow-up logged.",
    actions:
      "Pause the Meta lookalike. Rewrite the mobile hero on the repair page. Call the two stale proposals on Tuesday.",
    status: "published",
    published_at: "2026-11-14T18:00:00.000Z",
    created_at: "2026-11-14T18:00:00.000Z",
    updated_at: "2026-11-14T18:00:00.000Z",
  },
  {
    id: "sample-report-nov3",
    client_id: northwind.id,
    title: "Search is carrying the week",
    period_label: "Week of Nov 3, 2026",
    summary: "Paid search produced the calls. Organic moved on the repair pages and nowhere else.",
    traffic: "Organic sessions rose to 1,160. The repair hub page picked up 40 more visits than the week before.",
    campaigns: "Search spend was $3,100 for 8 booked calls. Display was turned off after two days of weak inquiries.",
    pipeline: "11 form fills and 8 booked calls. One proposal closed on Thursday.",
    actions: "Keep the search budget. Ship the mobile hero test that was queued last Friday.",
    status: "published",
    published_at: "2026-11-07T18:00:00.000Z",
    created_at: "2026-11-07T18:00:00.000Z",
    updated_at: "2026-11-07T18:00:00.000Z",
  },
];

const login: PortalLogin = {
  id: "sample-login",
  email: "lena@northwind.example",
  full_name: "Lena Ortiz",
};

export function sampleDirectory() {
  return {
    clients: [
      { ...northwind, latest_payment: {
        status: payments[0].status,
        amount: payments[0].amount,
        currency: payments[0].currency,
        paid_on: payments[0].paid_on,
      } },
      { ...bright, latest_payment: null },
    ],
    stats: {
      active: 1,
      collected: 1500,
      reports: 2,
      monthLabel: "November",
    },
  };
}

export function sampleBundle(id: string) {
  const client = id === northwind.id ? northwind : id === bright.id ? bright : null;
  if (!client) return null;
  return {
    client,
    payments: payments.filter((payment) => payment.client_id === client.id),
    reports: reports.filter((report) => report.client_id === client.id),
    login: client.id === northwind.id ? login : null,
  };
}

export function samplePortal() {
  return {
    client: northwind,
    payments,
    reports: reports.filter((report) => report.status === "published"),
  };
}

export function sampleReport(id: string) {
  const report = reports.find((item) => item.id === id);
  if (!report) return null;
  return { report, client: northwind };
}
