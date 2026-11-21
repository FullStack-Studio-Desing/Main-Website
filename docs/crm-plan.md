# CRM build plan — 2026-11-21

## Goal
One admin CRM where Diego manages every client, their projects (with tasks and updates),
every payment received, and invoices with unique IDs that clients can open and pay on the
site through Mercado Pago (Checkout API / Orders API). UI is shadcn (new-york, existing tokens).

## Audit — what existed before this pass
| Area | Status |
| --- | --- |
| Clients (company, contacts, people, plan, tax ID) | Done — `/admin/clients` |
| Projects (CRUD, status, budget, dates) | Done — `/admin/projects` |
| Project tasks | **Missing** |
| Project updates / activity log | **Missing** |
| Payments ledger (manual + MP) | Done — `/admin/payments` |
| Invoices with unique number `INV-YYYYMMDD-XXXXXX` | Done — `/admin/invoices` |
| Charge card on file from admin | Done |
| Public invoice page the client can pay without logging in | **Missing** |
| Webhook marks invoice paid + records payment | **Missing** (webhook only emails for plan checkout) |
| Invoice email links to the invoice | Links to `/portal` only |

## Foundation (done by lead)
- Migration `supabase/migrations/20261121120000_project_tasks_updates_invoice_links.sql`:
  `project_tasks`, `project_updates`, `invoices.public_token` (unguessable, unique),
  `invoices.project_id`, `payments.project_id`.
- Types in `src/lib/portal/types.ts`: `ProjectTaskRecord`, `ProjectUpdateRecord`, `TaskStatus`,
  `TaskPriority`, `ProjectUpdateKind`, `InvoiceRecord.public_token`.
- shadcn components added: tabs, dialog, alert-dialog, dropdown-menu, checkbox, sheet, tooltip,
  skeleton, progress, popover, scroll-area, switch, avatar, sonner.

## Workstreams (parallel, disjoint files)
### A — Project workspace (tasks + updates)
Project detail becomes a tabbed workspace: Overview, Tasks, Updates, Billing.
Owns: `src/lib/portal/project-actions.ts`, `src/lib/portal/project-queries.ts`,
`src/components/studio/project/*`, `src/app/admin/projects/[id]/page.tsx`.

### B — Invoice pay links + Mercado Pago
`/pay/[token]` public invoice page with card form (Orders API), records payment and marks invoice
paid; webhook reconciles `invoice_<id>` references; admin invoice detail page with copy-link;
emails link to the pay page.
Owns: `src/app/pay/**`, `src/app/api/pay/**`, `src/server/billing/invoice-pay.ts`,
`src/app/api/mercadopago/webhook/route.ts`, `src/server/billing/invoice-mail.ts`,
`src/lib/portal/billing-actions.ts`, `src/app/admin/invoices/**`, `src/components/studio/InvoiceList.tsx`,
`src/components/studio/InvoiceForm.tsx`, `src/components/studio/invoice/*`.

### C — shadcn polish of the rest of the CRM
Dashboard, clients list/detail, payments, projects list, shell/nav — consistent shadcn cards,
tables, badges, empty states, mobile.
Owns everything under `src/app/admin` and `src/components/studio` NOT listed in A or B.

## Not in scope this pass
- Applying the migration to the production Supabase project (Diego runs it).
- Invoice line items, taxes, PDF export.
