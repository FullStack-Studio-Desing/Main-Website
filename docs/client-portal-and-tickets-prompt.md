# Build prompt: Client Portal v2 + Support Tickets

> Paste this whole document into your coding agent (or follow it yourself) from the repo root.
> It describes **what exists today**, **what to build**, **how it must look and behave**, and **how to verify it**.
> Work in phases (section 12). Do not skip the acceptance checks.

---

## 0. Role and ground rules

You are a senior full-stack engineer extending the **FullStack Studio** CRM, a Next.js 15 (App Router) + Supabase + shadcn/ui app in this repo. You will:

1. Turn the client portal (`/portal`) from a single long page into a **full client dashboard** that mirrors what the admin CRM manages, scoped to that client.
2. Add a **support ticket system**: clients open tickets per project with a title, description and attachments; admins triage, change status and reply; both sides talk in a threaded conversation.
3. Store ticket attachments in **Cloudflare R2**, set up with **Wrangler**.

Rules:

- **Match the existing code.** Read the files named in section 1 before writing anything. Same naming, same comment density, same patterns (server actions + `ActionState`, `requireAdmin` / `requireClient`, query helpers that return `{ ok, data } | { ok: false, reason }`, RLS on every table).
- **shadcn/ui only** for UI primitives (`src/components/ui/*`). Use the existing theme tokens. No new color palette, no gradients, no decorative "AI" styling.
- **Security first:** every table gets RLS. Clients only ever see their own rows. Never trust a `client_id` or `project_id` from the browser; always derive or verify it on the server.
- **Everything works on a phone (390px)** with no sideways page scroll.
- **Money is USD** everywhere in the UI. Charges convert to MXN at payment time; that already exists, so don't touch it.
- Every migration is **idempotent** ("safe to run again"), like the existing ones in `supabase/migrations/`.
- Finish each phase with `npx tsc --noEmit -p .`, `npx eslint <changed files>` and a browser check at 1440px and 390px.

---

## 1. What exists today (read these first)

### Stack
- Next.js 15 App Router, React 19, TypeScript, Tailwind 3 + `tailwindcss-animate`, shadcn/ui (new-york, neutral), lucide icons, framer-motion, sonner toasts.
- Supabase (Postgres + Auth + RLS). Server client: `src/lib/supabase/server.ts`; service-role client (server only): `src/lib/supabase/admin.ts`.
- Mercado Pago Orders API (Checkout API) for card payments; Resend for email; Cloudflare R2 already serves **public** site media (`src/lib/media.ts`, bucket `mainwebsite`).

### Auth and roles
- `profiles.role` is `admin` or `client`; `profiles.client_id` links a client login to a company.
- `src/lib/portal/session.ts`: `requireAdmin()`, `requireClient()` return a session with `kind: "ready" | "unconfigured" | "schema" | ...`.
- SQL helpers used by every policy: `public.is_admin()`, `public.current_client_id()`.

### Data (see `supabase/migrations/*`)
| Table | What it holds |
|---|---|
| `clients` | Company, contact, plan, monthly amount, tax ID, `mp_customer_id` |
| `client_contacts`, `client_people` | Extra emails/phones and people with roles |
| `projects` | Per-client projects: status, dates, budget, notes |
| `project_tasks` | Tasks per project: status `todo/in_progress/blocked/done`, priority, due date |
| `project_updates` | Activity log; `visible_to_client` controls portal visibility |
| `invoices` | Unique `number` (`INV-YYYYMMDD-XXXXXX`), `public_token` pay link, status incl. `refunded/partially_refunded`, optional `project_id` |
| `payments` | Ledger in USD + `charge_currency/charge_amount/fx_rate`, `refunded_amount`, optional `invoice_id/project_id` |
| `payment_refunds` | Refund log |
| `payment_methods` | Cards on file (MP customer + card id, brand, last four, expiry, default) |
| `reports` | Monthly reports; clients see `published` ones |

### Key code to reuse
- Admin pages: `src/app/admin/**`. Portal: `src/app/portal/**` (today only `page.tsx` + `reports/[id]`).
- Shell + nav: `src/components/studio/shell.tsx` (sidebar on desktop, Sheet on mobile, avatar menu). Nav items accept an `icon` key.
- Shared studio UI: `src/components/studio/ui.tsx` (`PageIntro`, `Section`, `SectionCard`, `StatCard`, `EmptyState`, `StatusBadge`, `Field`, `Alert`, `BackLink`).
- Dialog forms: `src/components/studio/FormDialog.tsx`; hash-driven tabs: `HashTabs.tsx`; table search/filter: `FilterBar.tsx`.
- Project workspace: `src/components/studio/project/*`, including `PortalProjectActivity.tsx` (already shows progress + client-visible updates in the portal).
- Invoices: `src/components/studio/invoice/*` (`InvoicePreview`, `PayInvoiceForm`, `CardPreview`, `StatementPreview`, `InvoiceShareActions`), PDF route `src/app/api/pay/[token]/pdf/route.ts`.
- Saved cards: `src/server/billing/saved-cards.ts`. Payment methods UI: `PaymentMethodForm.tsx`, `PaymentMethodList.tsx`.
- Email: `src/server/billing/invoice-mail.ts` (Resend pattern to copy for ticket emails).

---

## 2. Design system (applies to every new screen)

The CRM and portal share one look: **calm, neutral, editorial**. Think Linear or Stripe dashboard, not a template.

- **Theme scope:** every portal/admin page renders inside `.studio-app` (neutral shadcn tokens in `src/app/globals.css`). Pop-ups render outside it, so **every** `DialogContent`, `SheetContent`, `SelectContent`, `PopoverContent`, `DropdownMenuContent` and `AlertDialogContent` must get `className="studio-app ..."`.
- **Color:** use tokens only (`bg-background`, `bg-muted/40`, `text-muted-foreground`, `border`, `bg-accent`, `text-destructive`). The brand forest green `#13241a` is reserved for the card preview and email buttons; don't spread it.
- **Type:** existing sans (`var(--font-sans)`). Page title = `PageIntro` (text-2xl/3xl semibold, tight tracking). Section titles text-base semibold. Body text-sm. Labels/meta text-xs `text-muted-foreground`. Money and IDs use `tabular-nums`; IDs (`INV-…`, `TCK-…`) use `font-mono text-[13px]`.
- **Layout:** content max width ~`max-w-6xl`; page padding from the shell. Cards (`Card`) with `p-6` (`sm:p-8` for hero cards). 4-up `StatCard` rows on desktop → 2-up on tablet → 1-up on phone.
- **Status badges:** always `StatusBadge` (add new keys to the map in `ui.tsx`). Ticket statuses in section 6.3.
- **Tables:** shadcn `Table` inside a `Card` with `overflow-hidden`; secondary columns `hidden sm:table-cell` / `hidden md:table-cell`; rows clickable when they lead somewhere; empty states use `EmptyState` with an icon, a one-line title and one helpful sentence.
- **Motion:** subtle only. 150–200ms ease-out for hovers and accordions; spring for dialogs (shadcn default). Respect `prefers-reduced-motion`.
- **Copy:** plain, direct English. Buttons say what they do ("Open ticket", "Send reply", "Pay $1,500.00 USD"). No exclamation marks except success toasts.
- **Feedback:** sonner toasts for success/failure of actions (a `Toaster` is mounted in the admin and portal layouts). Inline `Alert tone="error"` inside forms for validation errors.
- **Accessibility:** labels on every input, `aria-live` on async status text, keyboard-reachable everything, visible focus rings, 44px touch targets on mobile.

---

## 3. Client portal v2: information architecture

Replace the single-page portal with a sidebar app (same `StudioShell` the admin uses). Nav (with icons):

| Nav item | Route | Purpose |
|---|---|---|
| Overview | `/portal` | At-a-glance dashboard |
| Projects | `/portal/projects` | All their projects |
| Support | `/portal/tickets` | Tickets (new) |
| Invoices | `/portal/invoices` | Everything billed, pay links, PDFs |
| Payments | `/portal/payments` | Receipts, refunds |
| Payment methods | `/portal/payment-methods` | Saved cards |
| Reports | `/portal/reports` | Published monthly reports |
| Company | `/portal/company` | Their company profile, contacts, people (read-only) |

Header avatar menu: email, "View site", "Sign out" (already in the shell).

Show a **badge count** on nav items that need attention: Invoices = unpaid count, Support = tickets with an unread studio reply.

Preview mode: when Supabase is unconfigured in development (`showPreview()`), every portal page must render with sample data, like the admin does (`src/lib/portal/sample.ts`, `project-sample.ts`). Add sample tickets.

---

## 4. Client portal v2: pages in detail

### 4.1 Overview `/portal`
- `PageIntro`: eyebrow "Welcome back", title = company name, lede = plan name and monthly amount in USD.
- **StatCards (4):** "Amount due" (sum of unpaid invoices, with count) · "Active projects" (with "x tasks open") · "Open tickets" (with "x awaiting your reply") · "Paid this year" (net of refunds).
- **Action strip** (only when relevant): unpaid invoice → card with number, amount, due date (red if overdue) and a primary "Pay now" button (links to `/pay/<public_token>`). A ticket waiting on the client → "The studio replied to TCK-0042" with "View".
- **Projects:** up to 3 project cards (name, status badge, progress bar from tasks, "x of y tasks done", due date) + "View all".
- **Latest updates:** the 5 newest `project_updates` where `visible_to_client`, as a timeline (kind badge, project name, relative date). Reuse `PortalProjectActivity` pieces.
- **Recent activity:** last 5 events across payments, invoices and tickets ("Paid INV-… $1,500.00", "Ticket TCK-0042 marked Resolved").
- Empty state for a brand-new client: friendly "Your workspace is ready" with links to Support and Company.

### 4.2 Projects `/portal/projects` and `/portal/projects/[id]`
- List: cards (not a table) on all sizes: name, status, progress, due date, last update date. Filter chips: Active / Completed / All.
- Detail: header with name, status badge, dates, budget (if set), progress.
  - **Tabs:** Overview (description, key dates, progress, open tasks preview) · Tasks (read-only list grouped Open/Done with status, priority, due; overdue in red) · Updates (client-visible timeline) · Billing (invoices + payments linked to this project, totals invoiced vs paid) · Support (this project's tickets + "Open ticket" pre-selecting the project).
  - Clients **cannot** edit tasks. Tasks are read-only (RLS already allows select only).

### 4.3 Support (tickets) `/portal/tickets`: see section 6.

### 4.4 Invoices `/portal/invoices` and `/portal/invoices/[id]`
- Table: number (mono), title, project, issued, due, amount (USD), status. Filters: Unpaid / Paid / All + search.
- Row actions: **Pay** (opens `/pay/<public_token>`), **Download PDF** (`/api/pay/<token>/pdf`), **Copy link**.
- Detail page reuses `InvoicePreview` + the statement preview + payment history (payments linked to the invoice, including refunds).
- Never show `draft` or `void` invoices (RLS already hides drafts; hide void in the query).

### 4.5 Payments `/portal/payments`
- Table: date, description (invoice number/title or period), method ("Mastercard •••• 0366", "Bank transfer"), amount USD, status (`paid`, `partially_refunded`, `refunded`, `pending`).
- Under the amount, for converted charges: small "Charged MX$19,010.26" (same pattern as the admin `PaymentList`).
- Row → receipt view: amount, date, method, invoice link, refunds list with amounts and dates.
- StatCards: Paid this year · Refunded · Pending.

### 4.6 Payment methods `/portal/payment-methods`
- List saved cards as small card tiles (brand, •••• last four, expiry, "Default" badge). Actions: **Set as default**, **Remove** (AlertDialog confirm; uses existing `removePaymentMethod`).
- "Add a card" opens a Dialog with the existing `PaymentMethodForm` (MP.js tokenization) and the live `CardPreview` above it.
- Explain in one line: "Cards are stored by Mercado Pago. You'll still enter the security code when paying."
- Expired cards: show an "Expired" badge and hide them from the pay page.

### 4.7 Reports `/portal/reports`
- Grid of report cards (title, period, published date, 2-line summary). Detail page exists (`/portal/reports/[id]`); restyle it to match.

### 4.8 Company `/portal/company`
- Read-only: company name, contact, email, phone, plan, start date, tax ID (masked except last 4), contacts and people lists.
- "Need to change something?" → button that opens a **pre-filled support ticket** (category "Account").

---

## 5. Admin additions (outside tickets)
- Admin nav: add **Support** (`/admin/tickets`) between Projects and Invoices, with a badge = tickets in `open` + `awaiting_studio`.
- Dashboard (`/admin`): add a StatCard "Open tickets" and a list "Needs a reply" (5 oldest tickets awaiting the studio, with age).
- Client detail: add a **Support** tab (that client's tickets).
- Project workspace: add a **Support** tab (that project's tickets) next to Tasks / Updates / Billing.

---

## 6. Support tickets: full specification

### 6.1 User stories
**Client**
1. Open a ticket: pick the **project** (required if they have more than one; auto-selected and shown read-only if exactly one; "General / no project" allowed), choose a **category**, write a **title** and **description**, set **priority**, attach **images and files**.
2. See all their tickets, filter by status and project, search by title or number.
3. Open a ticket and see the conversation; reply with text and attachments.
4. Get an email when the studio replies or changes the status.
5. Mark a ticket **resolved** or reopen it.

**Admin**
1. Inbox of all tickets across clients with filters (status, priority, client, project, category, assignee) and sorting (newest, oldest waiting, priority).
2. Open a ticket: full conversation, attachments, client and project context, status, priority, assignee.
3. Reply publicly (client sees it) or add an **internal note** (client never sees it).
4. Change status and priority, assign to an admin, link the ticket to a project task (optional "Create task from ticket").
5. Get an email when a client opens or replies to a ticket.

### 6.2 Fields
| Field | Rules |
|---|---|
| Number | Human ID `TCK-0001`, sequential, unique (Postgres sequence). Shown in mono everywhere |
| Project | Must belong to the ticket's client (verify server-side). Nullable = "General" |
| Category | `bug`, `change_request`, `question`, `content_update`, `billing`, `account`, `other` |
| Title | 3–140 chars, required |
| Description | 10–8000 chars, required, plain text with line breaks (render with `whitespace-pre-line`; linkify URLs safely) |
| Priority | `low`, `normal` (default), `high`, `urgent`. Clients may choose low/normal/high; only admins can set `urgent` |
| Attachments | Up to **10 files per message**, **25 MB each**. Allowed: images (png, jpg, jpeg, webp, gif, heic), pdf, txt, csv, doc/docx, xls/xlsx, ppt/pptx, zip, mp4/mov (≤25 MB). Validate type + size client-side **and** server-side |

### 6.3 Statuses and flow
| Status | Meaning | Badge |
|---|---|---|
| `open` | New, nobody from the studio has replied | default (dark) |
| `awaiting_studio` | Client replied; ball is in the studio's court | secondary |
| `awaiting_client` | Studio replied/asked something; ball is in the client's court | outline |
| `in_progress` | Studio is working on it | secondary |
| `resolved` | Done; client can reopen within 14 days | outline + check icon |
| `closed` | Locked (auto after 14 days resolved, or admin closes) | outline muted |

Automatic transitions (do them in the server action, not the browser):
- Client creates → `open`. Client replies → `awaiting_studio` (unless `in_progress`, which stays).
- Admin public reply → `awaiting_client` unless the admin picked another status in the same submit.
- Client "Mark resolved" → `resolved`. Client replies on `resolved` → reopens to `awaiting_studio`. `closed` cannot be replied to by clients ("Open a new ticket" link instead).
- Every status change writes a **system event** into the conversation ("Diego changed status to In progress · 2h ago").

### 6.4 Data model (new migration `supabase/migrations/2026112x_support_tickets.sql`)

```sql
create sequence if not exists public.ticket_number_seq;

create table if not exists public.tickets (
  id uuid primary key default extensions.gen_random_uuid(),
  number text not null unique default ('TCK-' || lpad(nextval('public.ticket_number_seq')::text, 4, '0')),
  client_id uuid not null references public.clients (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  category text not null default 'question'
    check (category in ('bug','change_request','question','content_update','billing','account','other')),
  title text not null check (char_length(btrim(title)) between 3 and 140),
  description text not null check (char_length(btrim(description)) between 10 and 8000),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  status text not null default 'open'
    check (status in ('open','awaiting_studio','awaiting_client','in_progress','resolved','closed')),
  assigned_to uuid references public.profiles (id) on delete set null,
  task_id uuid references public.project_tasks (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  last_message_at timestamptz not null default now(),
  client_last_read_at timestamptz,
  studio_last_read_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_messages (
  id uuid primary key default extensions.gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade, -- denormalized for RLS
  author_id uuid references public.profiles (id) on delete set null,
  author_role text not null check (author_role in ('client','admin','system')),
  kind text not null default 'reply' check (kind in ('reply','internal_note','event')),
  body text check (body is null or char_length(body) <= 8000),
  event jsonb, -- for kind='event': {"type":"status","from":"open","to":"in_progress"}
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create table if not exists public.ticket_attachments (
  id uuid primary key default extensions.gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  message_id uuid references public.ticket_messages (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  uploaded_by uuid references public.profiles (id) on delete set null,
  r2_key text not null unique,            -- tickets/<client_id>/<ticket_id>/<uuid>/<safe-filename>
  file_name text not null check (char_length(file_name) between 1 and 200),
  content_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 26214400),
  width int, height int,                  -- images only, for layout without shift
  status text not null default 'pending' check (status in ('pending','ready','rejected')),
  created_at timestamptz not null default now()
);
```

Indexes: `tickets (client_id, last_message_at desc)`, `tickets (status, last_message_at desc)`, `tickets (project_id)`, `ticket_messages (ticket_id, created_at)`, `ticket_attachments (message_id)`. Triggers: `set_updated_at` on `tickets`; a trigger on `ticket_messages` insert that sets `tickets.last_message_at = now()`.

**RLS (copy the existing style exactly):**
- `tickets`: admins all; clients `select` where `client_id = current_client_id()`; clients `insert` with check `client_id = current_client_id()`; clients `update` only via server actions using the service role (simpler and safer than column-level policies: keep client updates out of RLS entirely).
- `ticket_messages`: admins all; clients `select` where `client_id = current_client_id() and kind <> 'internal_note'`; clients `insert` with check `client_id = current_client_id() and author_role = 'client' and kind = 'reply'`.
- `ticket_attachments`: admins all; clients `select` own rows **whose message is not an internal note**; inserts happen through server actions.
- `revoke all ... from anon` on all three.

Add the new types to `src/lib/portal/types.ts` (`TicketStatus`, `TicketPriority`, `TicketCategory`, `TicketRecord`, `TicketMessageRecord`, `TicketAttachmentRecord`) and badge entries in `ui.tsx` (`open`, `awaiting_studio` → "Waiting on studio", `awaiting_client` → "Waiting on you" / admin: "Waiting on client", `in_progress`, `resolved`, `closed`, `bug`…).

### 6.5 Attachments on Cloudflare R2 (via Wrangler)

**Use a separate, private bucket.** The existing `mainwebsite` bucket is public site media; client files must never be public.

Setup (document these commands in `docs/r2-tickets.md` as you run them):
```bash
npx wrangler login
npx wrangler r2 bucket create fssd-ticket-files
npx wrangler r2 bucket cors set fssd-ticket-files --file r2-tickets-cors.json
# Lifecycle: abort incomplete multipart uploads after 1 day
npx wrangler r2 bucket lifecycle add fssd-ticket-files abort-multipart --abort-multipart-days 1
```
`r2-tickets-cors.json`: allow `PUT`, `GET`, `HEAD` from the site origins only (`https://<your-domain>`, `http://localhost:3000`), allowed headers `content-type`, expose `ETag`, max age 3600. **Not `*`.**

Create an **R2 API token** (Cloudflare dashboard → R2 → Manage API tokens) scoped to Object Read & Write on `fssd-ticket-files` only. Env vars (server-only, never `NEXT_PUBLIC_`):
```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_TICKETS_BUCKET=fssd-ticket-files
```
Add them to `.env.local` and to the hosting provider. Never print them.

**Upload flow (direct-to-R2 with presigned URLs, so big files never pass through Next.js):**
1. Client picks files → browser validates type/size → calls server action `requestTicketUploads(ticketId | "draft", files: {name, type, size}[])`.
2. Server: `requireClient()` (or admin), verifies the ticket belongs to the caller's client (or creates a draft upload scope for a new ticket), re-validates type/size/count, inserts `ticket_attachments` rows with `status='pending'`, and returns a **presigned PUT URL per file** (expires in 10 minutes) for key `tickets/<client_id>/<ticket_id>/<uuid>/<sanitized-name>`.
   - Sign with the S3-compatible endpoint `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com` using `aws4fetch` (tiny) or `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`, region `auto`. Put this in `src/server/storage/r2.ts` (server-only): `presignPut(key, contentType, size)`, `presignGet(key, filename, disposition)`, `headObject(key)`, `deleteObject(key)`.
3. Browser `PUT`s each file directly to R2 with `fetch` and an upload progress bar (use `XMLHttpRequest` for progress events), max 3 in parallel.
4. Browser calls `confirmTicketUploads(attachmentIds)` → server `HEAD`s each object, checks size matches and content type is allowed, then flips `status='ready'` (or `rejected` and deletes the object).
5. When the message is submitted, the server links `ready` attachments to the new `message_id`. Pending attachments older than 24h are garbage-collected (a small cron/route or Supabase scheduled function that deletes the R2 object and the row).

**Download/preview flow:** never store or expose public URLs. A route `GET /api/tickets/attachments/[id]` checks access (admin, or the owning client and the message isn't an internal note), then `302`s to a presigned GET URL valid for 5 minutes with `response-content-disposition` (`inline` for images/PDF, `attachment` otherwise). Image thumbnails in the conversation use the same route.

**Security checks:** sanitize filenames (keep `[A-Za-z0-9._-]`, max 120 chars); never trust browser `type`; reject executables (`.exe`, `.js`, `.sh`, `.bat`, `.msi`, `.dmg`, `.apk`, `.html`, `.svg`; SVG can carry scripts); serve everything with `X-Content-Type-Options: nosniff`; rate-limit upload requests per user.

> Alternative if you'd rather keep credentials out of Next.js: a small Cloudflare **Worker** with an R2 binding (`wrangler.toml` → `[[r2_buckets]] binding = "TICKETS" bucket_name = "fssd-ticket-files"`), deployed with `npx wrangler deploy`, that accepts uploads authorized by a short-lived HMAC token minted by Next.js. Presigned URLs are simpler; pick one and document it.

### 6.6 Client UI: `/portal/tickets`
- `PageIntro`: title "Support", lede "Ask for changes, report a problem or ask a question. We reply within one business day.", action button **"Open ticket"**.
- Filters: status chips (All · Open · Waiting on you · Resolved), project select (only if >1 project), search.
- List (cards on mobile, table on desktop): number (mono), title, project, status badge, last activity (relative), **unread dot** if `last_message_at > client_last_read_at` and the last message is from the studio.
- Empty state: icon `LifeBuoy`, "No tickets yet", "Open one whenever you need something from the studio.", plus the button.

**New ticket** (`/portal/tickets/new`, full page on mobile; Dialog/Sheet acceptable on desktop):
1. **Project**: shadcn `Select` listing the client's projects (active first, completed under a "Completed" group) + "General (not about a project)". If only one project: show it as read-only text with a "Change" link only if "General" is allowed. Pre-select from `?project=<id>`.
2. **Category**: segmented chips with icons (Bug, Change request, Question, Content update, Billing, Account, Other).
3. **Title**: Input with counter (140).
4. **Description**: Textarea (auto-grow, min 6 rows) with counter (8000) and a helper line: "Include links, steps to reproduce, or what you expected."
5. **Priority**: radio chips Low / Normal / High with one-line hints.
6. **Attachments**: dropzone (drag & drop + click + paste images from the clipboard), file list with thumbnails for images, file icon + size for others, per-file progress bar, remove button, error per file ("Too large: 31 MB, max 25 MB").
7. Submit **"Open ticket"** (disabled while uploads are in progress). On success: toast "Ticket TCK-0042 opened" → redirect to the ticket page.
- Draft safety: keep title/description in `sessionStorage` until submitted (wrapped in try/catch).

**Ticket page** (`/portal/tickets/[number]`, URL uses the human number, resolved server-side within the client's scope):
- Header: number (mono), title, status badge, project link, category, opened date, priority.
- Two columns on desktop: **conversation (left, wide)** + **details panel (right)**: status, project, category, priority, opened, last update, "Mark resolved" / "Reopen" buttons. One column on mobile with details collapsed into an accordion at the top.
- **Conversation**: original description as the first message; then messages oldest → newest. Client messages right-aligned subtle bubble; studio messages left-aligned with the studio logo avatar and the admin's name; **system events** as centered small muted lines with an icon. Attachments under each message: image thumbnails in a grid (click → lightbox Dialog with prev/next and download), files as compact rows (icon, name, size, download).
- **Composer** at the bottom (sticky on mobile): textarea, attach button + paste/drag support, "Send reply" (⌘/Ctrl+Enter). Hidden with a notice when `closed`.
- Mark `client_last_read_at = now()` when the page is viewed.
- Live updates: subscribe with Supabase Realtime to `ticket_messages` for this ticket (filtered by `ticket_id`) and append new messages; fall back to `router.refresh()` on focus.

### 6.7 Admin UI: `/admin/tickets`
- `PageIntro` "Support" + StatCards: Open · Waiting on studio · Waiting on client · Resolved this week (and "Median first reply time" if cheap to compute).
- **Inbox table**: number, title (+ first line of description muted), client, project, category, priority (colored dot: urgent red, high amber, normal neutral, low muted), status, assignee avatar, last activity, age (red if waiting on studio > 24h). Unread dot when the last message is from the client and newer than `studio_last_read_at`.
- Filters (`FilterBar` + Selects): status (default: everything except closed), priority, client, project (depends on client), category, assignee (Me / Unassigned / anyone). Sort: Waiting longest (default), Newest, Priority. Saved in the URL query so links are shareable.
- Bulk actions (checkbox column): change status, assign, close.
- "New ticket" for the admin too (on behalf of a client: pick client → project).

**Admin ticket page** `/admin/tickets/[number]`:
- Same conversation layout as the client, plus **internal notes** rendered with a yellow-tinted background, a lock icon and the label "Internal note · only the studio sees this".
- Composer with a **Reply / Internal note** toggle (Tabs). Reply has a "Set status" select next to the send button (default "Waiting on client"); "Send & resolve" shortcut.
- Right panel: client card (company, contact, email, link to client), project card (status, progress, link), **status** select, **priority** select, **assignee** select (admins), category, created/updated, attachments gallery (all files in the ticket), and **"Create task from ticket"** (creates a `project_tasks` row with the ticket title + link back, stores `task_id`, posts a system event).
- Every change (status/priority/assignee/category) is an immediate server action + toast + system event.
- Mark `studio_last_read_at = now()` on view.

### 6.8 Server actions (`src/lib/portal/ticket-actions.ts`, `"use server"`)
Client: `createTicket`, `replyToTicket`, `resolveTicket`, `reopenTicket`, `requestTicketUploads`, `confirmTicketUploads`, `markTicketRead`.
Admin: `adminReply` (reply or internal note + optional status), `setTicketStatus`, `setTicketPriority`, `assignTicket`, `setTicketCategory`, `createTaskFromTicket`, `bulkUpdateTickets`, `adminCreateTicket`.
Each one: auth gate → validate (lengths, enums) → ownership check (`client_id` from the session or the ticket row, `project_id` must belong to that client) → write → system event if state changed → email → `revalidatePath` for the affected portal/admin pages → `ActionState` with `notice` or `error`.
Queries in `src/lib/portal/ticket-queries.ts`: `listClientTickets`, `getClientTicket(number)`, `listAdminTickets(filters)`, `getAdminTicket(number)`, `ticketCounts()`; attachments returned with their download route URLs, never raw R2 keys.

### 6.9 Notifications (Resend; copy `invoice-mail.ts` style)
- To the studio (`PORTAL_ADMIN_EMAILS` or a new `SUPPORT_NOTIFY_EMAIL`): "New ticket TCK-0042 from Northwind: <title>" and "Northwind replied on TCK-0042".
- To the client (company email + the author): "The studio replied on TCK-0042" and "TCK-0042 is now Resolved". Include the message excerpt (first 300 chars, HTML-escaped), the project name and a button to `/portal/tickets/TCK-0042`. **Never** include internal notes.
- Batch: don't send more than one email per ticket per recipient per 5 minutes (store `last_notified_at` per side, or skip if the previous email is newer).
- Until the Resend domain is verified, sending to non-studio addresses fails: catch and log it, never fail the action because of email.

---

## 7. Validation and edge cases (must handle)
- Client with **zero projects**: project select shows only "General".
- Client with **one project**: auto-selected.
- Project later deleted: ticket keeps working with "General" (FK `on delete set null`).
- Client tries a `project_id` from another client (tampered request) → rejected with "That project could not be found."
- Upload interrupted / tab closed → pending rows garbage-collected; the ticket can still be submitted without them.
- Attachment over 25 MB, 11th file, disallowed type → per-file error, others continue.
- Replying to a `closed` ticket → blocked server-side.
- Internal note must never appear in client queries, emails, realtime payloads or attachment downloads (test this explicitly).
- Very long descriptions and unbroken strings (URLs) wrap (`break-words`).
- Timezones: show dates in the viewer's locale; "relative" times update without reload.

---

## 8. Performance
- Paginate inbox and client lists (25 per page, cursor on `last_message_at`).
- Conversations load the latest 50 messages first with "Load earlier".
- Thumbnails: request images with width hints if you add a resize step; otherwise lazy-load (`loading="lazy"`) and reserve space with stored `width/height`.
- Counts for nav badges in one cheap query (`ticketCounts`) cached per request.

---

## 9. Security checklist
- [ ] RLS on `tickets`, `ticket_messages`, `ticket_attachments`; `anon` revoked.
- [ ] Clients can't read internal notes or their attachments (SQL test + UI test).
- [ ] All IDs from the browser re-checked server-side against the session's client.
- [ ] R2 bucket private; API token scoped to that bucket; presigned URLs short-lived; CORS limited to site origins.
- [ ] Filenames sanitized; dangerous types rejected; `nosniff` on downloads.
- [ ] Rate limits on create/reply/upload (per user, in-memory is fine to start).
- [ ] No secrets in client bundles (`grep -r "R2_SECRET" .next/static` must be empty after build).

---

## 10. Acceptance criteria
1. A client with 3 projects opens a ticket choosing project #2, category Bug, priority High, with 2 images and 1 PDF; it appears in their list and in the admin inbox with the right project, and the attachments preview and download for both sides.
2. Admin replies publicly with a screenshot and sets status "In progress"; the client sees the reply, the image and a system event; the client gets an email (or a logged failure while Resend is in test mode).
3. Admin adds an internal note with a file; the client cannot see the note or download the file, even by calling `/api/tickets/attachments/<id>` directly (403).
4. Client replies → status becomes "Waiting on studio", admin unread dot appears.
5. Client marks resolved → resolved; replying again reopens it.
6. "Create task from ticket" creates a task in the right project and links back.
7. All portal pages from section 4 render with real data and in preview mode; no sideways scroll at 390px; tsc and eslint clean; `next build` passes.

---

## 11. Test plan
- **SQL/RLS:** with a client JWT, select from `ticket_messages` where `kind='internal_note'` → 0 rows; insert a ticket for another `client_id` → denied.
- **Server actions:** unit-style scripts in `.verify/` (like the existing payment tests) that create a ticket, reply, upload via presigned URL, confirm, and download.
- **Browser (Playwright MCP):** the 7 acceptance flows at 1440px and 390px; screenshot each step into `.verify/tickets/`.
- **Manual:** paste a screenshot into the composer, drag a 30 MB file (rejected), lose network mid-upload (recovers).

---

## 12. Delivery phases
1. **Migration + types + RLS** (and sample data for preview mode).
2. **R2 storage module + Wrangler setup + upload/download routes** (test with a script before any UI).
3. **Client portal shell + Overview + Projects + Invoices + Payments + Payment methods + Reports + Company** (section 4).
4. **Client tickets**: list, new ticket, ticket page, uploads, realtime.
5. **Admin tickets**: inbox, ticket page, internal notes, status/priority/assignee, create task, dashboard/nav badges, client/project tabs.
6. **Emails + rate limits + cleanup job.**
7. **QA pass** (sections 9–11), then commit per phase with clear messages.

Deliverables: migration file(s), `src/server/storage/r2.ts`, `src/lib/portal/ticket-actions.ts`, `ticket-queries.ts`, `src/app/portal/**` pages, `src/app/admin/tickets/**`, `src/components/studio/tickets/*` (TicketList, TicketForm, AttachmentDropzone, Conversation, MessageBubble, AttachmentGrid, Lightbox, TicketDetailsPanel, StatusSelect…), `src/app/api/tickets/attachments/[id]/route.ts`, `docs/r2-tickets.md`, updated `docs/crm-plan.md`.
