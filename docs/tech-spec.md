# FSSD Main Website - Technical Specification

**Author:** Diego
**Date:** 2026-11-27
**Project Level:** 1
**Change Type:** Feature completion (brownfield gap closure)
**Development Context:** Support tickets shipped in `9a3b14b` (2026-11-21) without client-facing attachments or complete status emails. This spec closes those gaps and makes the feature production-ready.

---

## Context

### Available Documents

| Document | Use |
|---|---|
| `docs/client-portal-and-tickets-prompt.md` | Original build brief for portal v2 and tickets |
| `docs/r2-tickets.md` | R2 bucket, CORS, lifecycle and token setup for ticket files |
| `docs/crm-plan.md` | CRM context (clients, projects, invoices) |
| `supabase/migrations/20261123000000_support_tickets.sql` | Ticket schema and RLS |

No product brief, research doc or `document-project` output exists. Brownfield context comes from direct code review.

### Project Stack

- Next.js 15.5.11 (App Router, Server Actions, Turbopack dev)
- React 19, TypeScript 5
- Supabase: `@supabase/supabase-js` 2.119, `@supabase/ssr` 0.12.7 (auth, Postgres, RLS)
- Cloudflare R2 through `@aws-sdk/client-s3` 3.1175 and `@aws-sdk/s3-request-presigner` 3.1175
- Resend 6.38.1 (transactional email)
- UI: Tailwind 3.4, shadcn/ui on Radix, `lucide-react`, `sonner` 2.0.8 toasts
- No unit-test framework is installed. Verification uses `tsx` scripts in `.verify/` (for example `.verify/test-tickets-smoke.ts`) plus Playwright MCP screenshots.

### Existing Codebase Structure

- `src/app/portal/tickets/*`: client list, new ticket and detail routes
- `src/app/admin/tickets/*`: admin list and detail routes
- `src/lib/portal/ticket-actions.ts`: every ticket server action (create, reply, status, uploads, bulk)
- `src/lib/portal/ticket-queries.ts`: reads; attachments are grouped by `message_id`, and only `status = 'ready'` rows are returned
- `src/server/storage/r2.ts`: `presignPut` (10 min), `presignGet` (5 min), `headObject`, `deleteObject`
- `src/app/api/tickets/attachments/[id]/route.ts`: permission-checked redirect to a presigned GET; images and PDFs are served inline, and internal-note files are hidden from clients
- `src/app/api/cron/ticket-upload-cleanup/route.ts`: deletes `pending` attachments older than 24 hours
- `src/server/billing/ticket-mail.ts`: Resend wrapper with a 5-minute in-memory cooldown per key
- `src/components/studio/tickets/*`: `TicketConversation`, `TicketFormPlaceholder`, `TicketList`

---

## The Change

### Problem Statement

Clients cannot attach screenshots or files to tickets, which is the main way they show a problem. The server pipeline for uploads exists but nothing calls it, and confirmed files are never linked to a message, so even a wired-up upload would never render. Status emails are incomplete: the client is not told when the studio changes a status without a reply, never gets a "we received your ticket" email, and gets a pointless "resolved" email when they resolve the ticket themselves (the studio is not told at all). In production, emails send from `onboarding@resend.dev`, which only delivers to the Resend account owner, so clients currently receive nothing.

### Proposed Solution

1. Build one reusable `TicketAttachmentPicker` client component that uploads files directly from the browser to R2 using the existing presign and confirm actions. Use it in the new-ticket form, the client reply box and the admin reply box.
2. Bind attachments to a message: `confirmTicketUploads` takes a `messageId` and sets `ticket_attachments.message_id`.
3. Render image attachments as thumbnails and other files as chips in `TicketConversation`.
4. Centralise client status emails in one `notifyClientStatusChange` helper. It fires for `awaiting_client`, `resolved` and `closed` only, and is skipped when the same action already sends a reply email.
5. Add `notifyClientTicketReceived` (confirmation on create) and `notifyStudioClientResolved` (studio told when the client resolves).
6. Send emails with `after()` from `next/server`, not bare `void` promises, so serverless functions don't drop them.
7. Production configuration: R2 bucket and token, a verified Resend domain, a scheduled cleanup cron.

### Scope

**In Scope:**

- Attachments on new tickets, client replies and admin replies (public replies and internal notes)
- Limits: 10 files per message, 25 MB per file, using the existing `ALLOWED_EXT` and `BLOCKED_EXT` lists (already enforced in `validateUploadMeta` and the DB check constraint)
- Thumbnails for `image/*` attachments, and file chips with name and size for everything else
- Client emails: ticket received, every studio public reply (existing), status changed to `awaiting_client`, `resolved` or `closed` (without a reply)
- Studio emails: new ticket (existing), client reply (existing), client resolved the ticket (new)
- Reliable email delivery via `after()`
- Cleanup cron scheduling, R2 and Resend production setup

**Out of Scope:**

- Emails for `open`, `awaiting_studio` and `in_progress` status changes (decided 2026-11-27: noise)
- Emailing individual portal users. Client emails keep going to `clients.email` (company email), matching invoices
- Attachments on `adminCreateTicket` (admin-created tickets)
- Image dimensions (`width` and `height` columns stay null)
- Replacing in-memory rate limiting and email cooldowns with a shared store
- Virus scanning of uploads
- Email preference settings and unsubscribe

---

## Implementation Details

### Source Tree Changes

| File | Action | Change |
|---|---|---|
| `src/components/studio/tickets/TicketAttachmentPicker.tsx` | CREATE | Client component: file input with drag and drop, per-file list with progress, remove button, client-side validation that mirrors the server limits. Exposes `uploadAll(ticketId, messageId): Promise<{ failed: string[] }>` through a ref. |
| `src/lib/portal/ticket-upload-client.ts` | CREATE | Browser helper `uploadTicketFiles(ticketId, messageId, files, onProgress)`: calls `requestTicketUploads`, PUTs each file to its presigned URL with `XMLHttpRequest` (for progress events), then calls `confirmTicketUploads(ids, messageId)`. |
| `src/lib/portal/ticket-limits.ts` | CREATE | Moves `MAX_FILES`, `MAX_FILE_BYTES`, `ALLOWED_EXT`, `BLOCKED_EXT` and `sanitizeFileName` out of `ticket-actions.ts`, so client and server share one source of truth. (A `"use server"` file can only export async functions.) |
| `src/lib/portal/ticket-actions.ts` | MODIFY | (a) Import limits from `ticket-limits.ts`. (b) `createTicket`, `replyToTicket` and `adminReply` return `ticketId` and `messageId` in their state. (c) `confirmTicketUploads(attachmentIds, messageId)` checks that the message belongs to the attachment's ticket and sets `message_id`. (d) Change `void notify…()` to `after(() => notify…())`. (e) `setTicketStatus` and `bulkUpdateTickets` call `notifyClientStatusChange`. (f) `resolveTicket` calls `notifyStudioClientResolved`, not `notifyClientTicketResolved`. (g) `createTicket` also calls `notifyClientTicketReceived`. (h) Allow an empty `body` in `replyToTicket` and `adminReply` when attachments are pending (see Technical Details). |
| `src/lib/portal/types.ts` | MODIFY | Add `TicketActionState = ActionState & { ticketId?: string; messageId?: string; number?: string }`. |
| `src/server/billing/ticket-mail.ts` | MODIFY | Add `notifyClientTicketReceived`, `notifyClientStatusChange` (replaces the body of `notifyClientTicketResolved` and covers `awaiting_client`, `resolved` and `closed`), and `notifyStudioClientResolved`. Delete `notifyClientTicketResolved`; after this change nothing calls it. |
| `src/components/studio/tickets/TicketFormPlaceholder.tsx` | RENAME, MODIFY | Rename to `TicketForm.tsx` (export `TicketForm`). Remove the "File attachments will appear here" notice, embed `TicketAttachmentPicker`, upload after the ticket is created, then redirect using `state.number`, not a regex on the notice. |
| `src/app/portal/tickets/new/page.tsx` | MODIFY | Import `TicketForm`. |
| `src/components/studio/tickets/TicketConversation.tsx` | MODIFY | Add the picker to the client and admin reply forms and remove the "Attachments will be available" notice. Render attachments as a thumbnail grid (`<img src={download_url}>`, `loading="lazy"`, links to full size) for `image/*`, and as chips for other types. |
| `src/components/studio/tickets/TicketDetailPlaceholder.tsx` | DELETE | Nothing imports it (checked 2026-11-27). |
| `vercel.json` | CREATE | `{"crons":[{"path":"/api/cron/ticket-upload-cleanup","schedule":"0 4 * * *"}]}` |
| `src/app/api/cron/ticket-upload-cleanup/route.ts` | MODIFY | Return 401 when `CRON_SECRET` is unset in production (`process.env.VERCEL_ENV === "production"`), so the endpoint can't be called anonymously. |
| `r2-tickets-cors.json` | MODIFY | Make sure `AllowedOrigins` includes the production domain and `http://localhost:3000`, with `PUT` and `Content-Type` allowed. |
| `.env.example` | MODIFY | Document `RESEND_FROM` with a verified-domain example, and `CRON_SECRET`. |
| `.verify/test-ticket-attachments.ts` | CREATE | Smoke script: presign, PUT a small PNG, confirm with a message id, assert `status = 'ready'` and `message_id` set, then clean up. |

### Technical Approach

**Upload flow (create ticket):**

1. The client picks files. The picker validates count, size and extension in the browser using `ticket-limits.ts`.
2. Submitting the form runs `createTicket` through `useActionState`. It returns `{ notice, ticketId, messageId, number }`.
3. A `useEffect` on `state.messageId` runs `picker.uploadAll(ticketId, messageId)`.
4. `uploadTicketFiles` calls `requestTicketUploads(ticketId, metas)`, which returns `[{ id, uploadUrl }]`.
5. Each file is PUT to its `uploadUrl` with header `Content-Type: file.type || "application/octet-stream"`. That header must match the signed `ContentType`. Up to 3 uploads run at once.
6. `confirmTicketUploads(successIds, messageId)` runs `headObject` and checks size, then sets `status = 'ready'` and `message_id`.
7. Redirect to `/portal/tickets/{number}`. If any file failed, show the toast `"Ticket opened. N file(s) failed to upload. Add them in a reply."`. The ticket is never rolled back because of a failed upload.

**Upload flow (reply):** same steps, using `replyToTicket` or `adminReply`, which return `messageId`. After confirming, call `router.refresh()` so the conversation picks up the attachments.

**Why presigned PUT:** Vercel caps serverless request bodies at 4.5 MB, so 25 MB files can't go through a server action. Direct browser-to-R2 upload with server-side `HEAD` verification is the only way to support the 25 MB limit.

**Email rules (client):**

| Trigger | Email | Notes |
|---|---|---|
| `createTicket` | `notifyClientTicketReceived` | "We received TCK-123", with a link to the ticket |
| `adminReply`, `kind = reply` | `notifyClientStudioReply` (existing) | Subject includes the status when the new status is `resolved` or `closed` (for example "The studio replied on TCK-123 · Resolved"). No separate status email. |
| `adminReply`, `kind = internal_note` | none | |
| `setTicketStatus` to `awaiting_client`, `resolved` or `closed` | `notifyClientStatusChange` | Skipped for any other target status |
| `bulkUpdateTickets` with `status` in that set | `notifyClientStatusChange` for each ticket | Cooldown key `client:status:{number}:{status}` |
| `resolveTicket` (client action) | none to the client; `notifyStudioClientResolved` to the studio | Fixes a current bug |
| `reopenTicket` (client action) | `notifyStudioClientReply`-style email to the studio: "{company} reopened TCK-123" | Reuse via a new `notifyStudioClientReopened` |

**Delivery:** wrap every notify call in `after(() => …)` (`import { after } from "next/server"`, stable since Next 15.1). The cooldown map stays in memory. It's acceptable as a burst guard but doesn't hold across instances (out of scope).

### Existing Patterns to Follow

- Server actions return `ActionState` (`{ error?, notice? }`) and never throw to the client. Database errors go through `safeDbError`.
- Gate every action with `clientGate()` or `adminGate()` first. Scope client queries by `client_id`.
- Use `raw(formData, key)` for trimmed form values and `oneOf()` for enum validation.
- Call `revalidateTicketPaths(number, clientId)` after every mutation.
- Client forms use `useActionState` plus a `sonner` toast in a `useEffect` on `state`. See `TicketFormPlaceholder.tsx` and `TicketConversation.tsx`.
- UI primitives come from `@/components/ui/*` (shadcn) and `@/components/studio/ui` (`Field`, `Alert`, `StatusBadge`). Icons come from `lucide-react`.
- Email HTML uses `escapeHtml` on every interpolated value, `excerpt()` for bodies, and `siteOrigin()` for links.
- Log with `console.error("[tickets] …")` or `console.warn("[ticket-mail] …")` prefixes.
- Error copy is short and second person, with no em dashes (house copy rule from the site redesign).

### Integration Points

- **Supabase:** `tickets`, `ticket_messages` and `ticket_attachments` tables. Attachment writes use `createAdminClient()` (service role) because RLS does not allow clients to insert attachment rows directly.
- **Cloudflare R2:** private bucket `fssd-ticket-files`. Key format: `tickets/{clientId}/{ticketId}/{fileId}/{safeName}`. Browser PUT needs CORS. Downloads always go through `/api/tickets/attachments/[id]`.
- **Resend:** `RESEND_API_KEY` and `RESEND_FROM`. The studio inbox comes from `SUPPORT_NOTIFY_EMAIL` (falling back to `PORTAL_ADMIN_EMAILS`), and the client address comes from `clients.email`.
- **Vercel Cron:** calls `/api/cron/ticket-upload-cleanup` daily with `Authorization: Bearer $CRON_SECRET`.

---

## Development Context

### Relevant Existing Code

- `src/lib/portal/ticket-actions.ts:450-652`: upload validation, `requestTicketUploads`, `confirmTicketUploads`
- `src/lib/portal/ticket-actions.ts:242-296`: `createTicket` (email call to convert to `after()`)
- `src/lib/portal/ticket-actions.ts:366-395`: `resolveTicket` (emails the wrong party)
- `src/lib/portal/ticket-actions.ts:713-741`: `setTicketStatus` (no email)
- `src/lib/portal/ticket-actions.ts:792-826`: `bulkUpdateTickets` (no email)
- `src/lib/portal/ticket-queries.ts:249-270`: attachments joined by `message_id`, `status = 'ready'`
- `src/app/api/tickets/attachments/[id]/route.ts`: inline vs attachment disposition, internal-note guard
- `src/server/storage/r2.ts:54-64`: `presignPut` signs `ContentType` and `ContentLength`
- `src/server/billing/ticket-mail.ts:43-70`: `sendMail` and cooldown

### Dependencies

**Framework/Libraries:** all already installed. No new packages.

- next 15.5.11 (`after` from `next/server`)
- @aws-sdk/client-s3 3.1175, @aws-sdk/s3-request-presigner 3.1175
- resend 6.38.1
- sonner 2.0.8, lucide-react 1.74

**Internal Modules:**

- `@/lib/portal/ticket-actions`, `@/lib/portal/ticket-queries`, `@/lib/portal/ticket-limits` (new)
- `@/server/storage/r2`, `@/server/billing/ticket-mail`
- `@/lib/supabase/admin`, `@/lib/supabase/server`, `@/lib/portal/session`

### Configuration Changes

Environment variables (`.env.local` and Vercel, server-only):

| Var | Value |
|---|---|
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | Token scoped to Object Read & Write on `fssd-ticket-files` only |
| `R2_TICKETS_BUCKET` | `fssd-ticket-files` |
| `RESEND_FROM` | `FullStack Studio <support@{verified-domain}>` |
| `SUPPORT_NOTIFY_EMAIL` | Studio inbox for ticket alerts |
| `CRON_SECRET` | Random 32+ characters |

New `vercel.json` for the cron. CORS update in `r2-tickets-cors.json`.

### Existing Conventions (Brownfield)

Conform to existing code: TypeScript strict, double quotes, semicolons, 2-space indentation, named exports, `@/` path alias, server-only modules import `"server-only"`, server actions live in `"use server"` files and export only async functions.

### Test Framework & Standards

No Jest or Vitest. The standard is `.verify/*.ts` scripts run with `npx tsx`, which load env through `@next/env`, plus manual Playwright screenshots saved to `.verify/`. `npm run lint` and `npm run build` must pass.

---

## Implementation Stack

Node 25 locally, Next.js 15.5.11, React 19, TypeScript 5, Tailwind 3.4.15, Supabase JS 2.119, AWS SDK v3 3.1175 (R2), Resend 6.38.1, ESLint 9 with `eslint-config-next` 15.

---

## Technical Details

- **Client-side validation mirrors the server limits** for fast feedback. The server stays authoritative (`validateUploadMeta`, the DB check `size_bytes <= 26214400`, `headObject` size match).
- **Content-Type match:** the browser must send exactly the `Content-Type` it reported in `requestTicketUploads`, or R2 rejects the signature with 403. Use `file.type || "application/octet-stream"` in both places.
- **HEIC:** allowed by extension but browsers can't render it inline. Treat it as a file chip, not a thumbnail (only render `<img>` for `image/png|jpeg|webp|gif`).
- **Message binding check:** `confirmTicketUploads` loads `ticket_messages` by `messageId` and requires `message.ticket_id === attachment.ticket_id`. Otherwise it rejects. Clients may only bind to messages they authored (`author_id = userId`); admins may bind to any message on the ticket.
- **Internal notes:** files on an internal note inherit its privacy. The download route already returns 404 to clients when `ticket_messages.kind = 'internal_note'`. Confirm queries filter them out for clients too.
- **Attachment-only replies:** if `body` is empty and the form posts `has_attachments=1`, store `body = null` and skip the "Write a reply first" check. `ticket_messages.body` is nullable with no minimum length, so no migration is needed. Emails then say "sent N file(s)", and the conversation renders the message with attachments only.
- **Partial failure:** a failed PUT leaves its row `pending`, and the cron deletes it after 24 hours. Never block ticket creation on uploads.
- **Concurrency:** at most 3 parallel PUTs, to stay responsive on mobile connections.
- **Double submit:** disable the submit button while the action is pending *and* while uploads are running.
- **Rate limits:** the existing `ticketRateLimit` covers create and reply. `requestTicketUploads` adds `ticketRateLimit("upload:{userId}", 60, 1h)`.
- **Security:** the bucket stays private, presigned PUT URLs expire in 10 minutes and GET URLs in 5. `BLOCKED_EXT` covers executables and `svg` and `html` (no XSS through inline rendering). File names are sanitised before they become R2 keys.

---

## Development Setup

```bash
git checkout agent-work         # or a feature branch off main
npm install
cp .env.example .env.local       # fill in Supabase, R2, Resend vars
npm run dev                      # http://localhost:3000
npx tsx .verify/test-tickets-smoke.ts
npx tsx .verify/test-ticket-attachments.ts   # new
npm run lint && npm run build
```

---

## Implementation Guide

### Setup Steps

1. Diego: create the R2 bucket, apply CORS and lifecycle, create a scoped token (follow `docs/r2-tickets.md`). Add the env vars locally and in Vercel.
2. Diego: verify the sending domain in Resend, then set `RESEND_FROM` and `SUPPORT_NOTIFY_EMAIL`.
3. Confirm the support tickets migration is applied in production Supabase.
4. Branch from `main`.

### Implementation Steps

**Story 1: Attachments end to end**

1. Extract `ticket-limits.ts`, then update the imports in `ticket-actions.ts`.
2. Add `messageId` to `confirmTicketUploads`, including the binding check.
3. Return `ticketId`, `messageId` and `number` from `createTicket`, `replyToTicket` and `adminReply`.
4. Build `ticket-upload-client.ts` and `TicketAttachmentPicker.tsx`.
5. Connect the picker to `TicketForm` and to both reply forms in `TicketConversation`.
6. Render thumbnails and chips in `TicketConversation`.
7. Write and run `.verify/test-ticket-attachments.ts`.

**Story 2: Status emails**

1. Add the new notify functions in `ticket-mail.ts`.
2. Wire them into `createTicket`, `setTicketStatus`, `bulkUpdateTickets`, `resolveTicket`, `reopenTicket` and `adminReply` (status suffix in the subject).
3. Convert every `void notify…` to `after(() => notify…)`.

**Story 3: Production readiness**

1. Add `vercel.json` with the cron, and harden the cron auth.
2. Update `r2-tickets-cors.json`, `.env.example` and `docs/r2-tickets.md`.
3. Run a full manual pass in production (see Acceptance Criteria).

### Testing Strategy

- Smoke scripts: existing `test-tickets-smoke.ts` plus new `test-ticket-attachments.ts`.
- Manual matrix (local, then production): client creates a ticket with 0, 1 and 10 files; tries an 11th file and a 26 MB file (rejected in the browser); uploads a `.exe` renamed to `.png` (passes the extension check, served as an attachment, never executed; acceptable); admin replies with files; admin adds an internal note with a file (client can't see the note or open its file URL); attachment-only reply.
- Email matrix: trigger each row of the email rules table and confirm one email per event at the right inbox, and none for `in_progress`.
- Screenshots of the form, picker states and the conversation at desktop and mobile width go in `.verify/`.

### Acceptance Criteria

1. Given a client on `/portal/tickets/new`, when they submit a title, description and 3 images, then the ticket opens, they land on `/portal/tickets/TCK-n`, and the 3 images show as thumbnails on the first message.
2. Given a file over 25 MB, or an 11th file, when it's added to the picker, then the picker rejects it with an inline error and doesn't upload it.
3. Given a disallowed extension (`.exe`, `.svg`, `.html`), when it's picked, then it's rejected in the browser, and also by the server if the browser check is bypassed.
4. Given an open ticket, when the client or the admin replies with files, then the files appear on that reply after the page refreshes, with no reload by the user.
5. Given an admin internal note with a file, when the client views the ticket or requests that file's URL, then the note is hidden and the URL returns 404.
6. Given a new ticket, then the client gets a "we received" email and the studio gets a "new ticket" email.
7. Given the admin sets status to `awaiting_client`, `resolved` or `closed` without a reply (single or bulk), then the client gets exactly one status email. Given `in_progress`, `open` or `awaiting_studio`, then no client email is sent.
8. Given an admin reply that also sets status to `resolved`, then the client gets one email (the reply, with the status in the subject), not two.
9. Given the client resolves or reopens their own ticket, then the studio is emailed and the client is not.
10. Given emails are sent in production, then they come from the verified domain and reach an external inbox (not only the Resend owner).
11. Given a `pending` attachment older than 24 hours, when the daily cron runs, then the row and its R2 object are deleted.
12. `npm run lint` and `npm run build` pass, and both `.verify` smoke scripts pass.

---

## Developer Resources

### File Paths Reference

- `src/components/studio/tickets/TicketAttachmentPicker.tsx` (new)
- `src/components/studio/tickets/TicketForm.tsx` (renamed from `TicketFormPlaceholder.tsx`)
- `src/components/studio/tickets/TicketConversation.tsx`
- `src/lib/portal/ticket-upload-client.ts` (new)
- `src/lib/portal/ticket-limits.ts` (new)
- `src/lib/portal/ticket-actions.ts`
- `src/lib/portal/ticket-queries.ts`
- `src/lib/portal/types.ts`
- `src/server/billing/ticket-mail.ts`
- `src/server/storage/r2.ts`
- `src/app/portal/tickets/new/page.tsx`
- `src/app/api/tickets/attachments/[id]/route.ts`
- `src/app/api/cron/ticket-upload-cleanup/route.ts`
- `vercel.json` (new), `r2-tickets-cors.json`, `.env.example`, `docs/r2-tickets.md`
- `.verify/test-ticket-attachments.ts` (new)

### Key Code Locations

- `requestTicketUploads`: `src/lib/portal/ticket-actions.ts:520`
- `confirmTicketUploads`: `src/lib/portal/ticket-actions.ts:594`
- `adminReply`: `src/lib/portal/ticket-actions.ts:654`
- `setTicketStatus`: `src/lib/portal/ticket-actions.ts:713`
- `sendMail`: `src/server/billing/ticket-mail.ts:43`
- Admin reply form: `src/components/studio/tickets/TicketConversation.tsx:221`

### Testing Locations

- `.verify/*.ts` (smoke scripts, `npx tsx`)
- `.verify/*.png` (screenshots)

### Documentation to Update

- `docs/r2-tickets.md`: final env var list, CORS origins, cron
- `.env.example`: `RESEND_FROM`, `SUPPORT_NOTIFY_EMAIL`, `CRON_SECRET`

---

## UX/UI Considerations

- **Picker:** dashed drop zone with the text "Drop files or browse · up to 10 files, 25 MB each". Selected files list below it with an icon (image or file), name, size and remove button. While uploading, each row shows a thin progress bar. Failed rows show a red message and a retry button.
- **Thumbnails:** grid of 96×96 tiles (`object-cover`, rounded) on desktop, 72×72 on mobile, 3 per row. Clicking one opens the full image in a new tab through `download_url`. Non-image files show as chips: icon, name, size.
- **Mobile:** the file input must accept the camera roll (`accept` = the allowed MIME list, `multiple`). The drop zone collapses to a "Add files" button under 640 px.
- **Accessibility:** the drop zone is a `<label>` for a visually hidden `<input type="file">`, so it's keyboard-focusable with a visible focus ring. Remove buttons have `aria-label="Remove {name}"`. Upload progress uses `role="progressbar"` with `aria-valuenow`. Thumbnails use the file name as `alt`.
- **Feedback:** submit label goes "Opening…" then "Uploading 2 of 3…". Success and partial-failure toasts via `sonner`.
- **Design system:** use the existing shadcn primitives and dark emerald theme tokens. No new colors.

---

## Testing Approach

- Follow the `.verify/` convention: one smoke script per backend flow, loading env through `@next/env` and using the service-role client.
- `test-ticket-attachments.ts` covers presign, PUT, confirm with `messageId`, the `ready` plus `message_id` assertion, the signed download URL returning 200, and cleanup (delete object and row).
- Email checks are manual, with `SUPPORT_NOTIFY_EMAIL` and a test client email set to inboxes Diego controls.
- Every acceptance criterion maps to a row in the manual matrix or a smoke script assertion.

---

## Deployment Strategy

### Deployment Steps

1. Complete the setup steps (R2, Resend, env vars in Vercel for Production and Preview).
2. Merge the feature branch to `main`. Vercel builds and deploys automatically.
3. In the Vercel dashboard, confirm the cron appears under Settings → Cron Jobs.
4. Run the acceptance matrix in production with a test client account.

### Rollback Plan

1. Revert the merge commit on `main` and push. Vercel redeploys the previous build.
2. No migration is involved, so there's nothing to roll back in the database. Attachment rows created in the meantime stay valid.
3. If only email is a problem, unset `RESEND_API_KEY` in Vercel to pause all ticket mail without redeploying code.

### Monitoring

- Vercel function logs: filter `[tickets]` and `[ticket-mail]` for presign, confirm and send failures.
- Resend dashboard: delivery and bounce rates for the support sender.
- Supabase: `select status, count(*) from ticket_attachments group by 1` weekly. A growing `rejected` count points to CORS or Content-Type mismatches.
- R2 dashboard: bucket size and operation counts.
