# FSSD Main Website - Epic Breakdown

**Date:** 2026-11-27
**Project Level:** 1
**Source:** [tech-spec.md](./tech-spec.md)

---

## Epic: Support Tickets Completion

**Slug:** `support-tickets-completion`

### Goal

Clients can attach screenshots and files to any ticket message and are told by email about every change that needs their attention. The studio can see those files and runs the queue with reliable notifications, on production infrastructure.

### Scope

Attachments (create, client reply, admin reply, internal notes), the client and studio email rules, reliable delivery with `after()`, and production setup (R2, Resend, Vercel Cron). Exclusions are listed under "Out of Scope" in the tech spec.

### Success Criteria

- All 12 acceptance criteria in `tech-spec.md` pass in production
- At least one real client ticket with an attachment completes the full loop: create, studio reply, resolved email
- No `pending` attachment rows older than 48 hours after the first cron run

### Dependencies

- R2 bucket `fssd-ticket-files`, scoped token, CORS (Diego, in the Cloudflare dashboard)
- Verified sending domain in Resend (Diego)
- Support tickets migration applied in production Supabase

---

## Stories

| # | Story | Points | Depends on |
|---|---|---|---|
| 1 | [Ticket attachments end to end](./stories/story-support-tickets-completion-1.md) | 5 | none |
| 2 | [Client and studio status emails](./stories/story-support-tickets-completion-2.md) | 3 | none (can run in parallel with 1) |
| 3 | [Production readiness](./stories/story-support-tickets-completion-3.md) | 2 | 1, 2, and the dashboard setup |

**Total:** 10 points, about 2 to 3 focused days.

### Implementation Sequence

1. Story 1 and Story 2 (code, can be built in parallel; they touch different functions in `ticket-actions.ts`)
2. Diego completes the dashboard setup (R2, Resend, Vercel env)
3. Story 3: cron, CORS, docs, production verification
