# Story 3: Production readiness

**Epic:** Support Tickets Completion
**Status:** Code complete; blocked on Diego (dashboard setup)
**Points:** 2

## User Story

As the **studio**, I want ticket files and emails working on the live site, with abandoned uploads cleaned up automatically.

## Acceptance Criteria

Tech spec AC 10, 11, 12.

## Tasks

### Code (Dev)
- [x] Create `vercel.json` with the daily cleanup cron (`0 4 * * *`)
- [x] Cron route returns 401 in production when `CRON_SECRET` is unset
- [x] `r2-tickets-cors.json`: production origin and localhost, `PUT`, `Content-Type`
- [x] `.env.example` and `docs/r2-tickets.md`: final env var list

### Setup (Diego)
- [ ] Create the R2 bucket, apply CORS and lifecycle, create a scoped token (`docs/r2-tickets.md`)
- [ ] Verify the sending domain in Resend
- [ ] Add `R2_*`, `RESEND_FROM`, `SUPPORT_NOTIFY_EMAIL` and `CRON_SECRET` in Vercel (Production and Preview)
- [ ] Redeploy, then run the acceptance matrix in production
