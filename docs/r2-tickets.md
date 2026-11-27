# Ticket attachments on Cloudflare R2

Support ticket files live in a **private** R2 bucket (`fssd-ticket-files` by default). They are never public; the app serves them through presigned URLs and `GET /api/tickets/attachments/[id]`.

Do not use the public `mainwebsite` media bucket for ticket files.

## Prerequisites

- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) installed (`npm i -g wrangler` or use `npx wrangler`).
- Cloudflare account with R2 enabled.
- `r2-tickets-cors.json` at the repo root (update `AllowedOrigins` if your production domain differs).

## One-time bucket setup

Authenticate once (opens a browser):

```bash
npx wrangler login
```

Create the bucket and apply CORS + lifecycle rules:

```bash
npx wrangler r2 bucket create fssd-ticket-files
npx wrangler r2 bucket cors set fssd-ticket-files --file r2-tickets-cors.json
```

`r2-tickets-cors.json` uses Wrangler’s nested `allowed` object (not AWS S3 PascalCase).

```bash
npx wrangler r2 bucket lifecycle add fssd-ticket-files abort-multipart --abort-multipart-days 1
```

## API token (S3-compatible credentials)

In the Cloudflare dashboard: **R2 → Manage R2 API tokens**. Create a token scoped to **Object Read & Write** on `fssd-ticket-files` only.

Add these to `.env.local` and your hosting environment (server-only, never `NEXT_PUBLIC_`):

```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_TICKETS_BUCKET=fssd-ticket-files
```

The Next.js helpers live in `src/server/storage/r2.ts` (`presignPut`, `presignGet`, `headObject`, `deleteObject`).

## CORS notes

Browsers upload directly to R2 with presigned `PUT` URLs, so origins must be listed explicitly in `r2-tickets-cors.json` (not `*`). Allowed methods: `PUT`, `GET`, `HEAD`. Allowed header: `content-type`. Exposed header: `ETag`.

## Verifying configuration

After setting env vars locally, restart `next dev`. Upload and download flows will fail with a clear server error until credentials and the bucket exist.
## Production checklist (Vercel)

Set these in Vercel → Settings → Environment Variables for **Production** and **Preview**, then redeploy:

| Var | Value |
|---|---|
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | Token scoped to Object Read & Write on `fssd-ticket-files` only |
| `R2_TICKETS_BUCKET` | `fssd-ticket-files` |
| `RESEND_FROM` | `FullStack Studio <support@your-verified-domain>`. `onboarding@resend.dev` only delivers to the Resend account owner, so clients receive nothing until a domain is verified. |
| `SUPPORT_NOTIFY_EMAIL` | Studio inbox for ticket alerts |
| `CRON_SECRET` | 32+ random characters. Vercel sends it as `Authorization: Bearer …` to cron routes. The cleanup route refuses to run in production without it. |

The daily cleanup cron (`0 4 * * *` UTC) is declared in `vercel.json` and removes `pending` uploads older than 24 hours. After deploying, confirm it under Settings → Cron Jobs.

Re-apply CORS after editing `r2-tickets-cors.json`:

```bash
npx wrangler r2 bucket cors set fssd-ticket-files --file r2-tickets-cors.json
```

Smoke test once the keys are set: `npx tsx .verify/test-ticket-attachments.ts`.
