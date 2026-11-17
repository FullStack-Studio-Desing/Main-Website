# FullStack Studio Design

Marketing site for **FullStack Studio Design**: websites, marketing, sales growth, AI automation, and custom CRMs on flat monthly plans. Built with Next.js 15, Tailwind, and Framer Motion. English only.

Visual system: **sculptural green optimism** — light paper chapters, forest-green dark chapters, neon reserved for actions and short emphasis.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Single-page site: hero, services, process, pricing (3 plans), proof, closing, contact form |
| `/services` | Services index |
| `/services/[slug]` | Service detail (websites, marketing, sales-growth, ai-automation, custom-crm) |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/api/contact` | Contact form endpoint (nodemailer, needs `EMAIL_SENDER`, `EMAIL_PASSWORD`, `EMAIL_RECEIVER` env vars) |
| `/login` | Studio and client sign-in |
| `/admin` | Studio admin: clients, plans, payments, and reports |
| `/portal` | Client portal: current plan, payments, and published reports |

## Client portal

Copy `.env.example` to `.env.local` and fill in the Supabase URL, anon key, service role key, and `PORTAL_ADMIN_EMAILS`. Run `supabase/migrations/20261117120000_client_portal.sql` once in the Supabase SQL editor. Create your user under Authentication → Users with auto-confirm on. Clients only see their own plan, payments, and published reports.

Old routes (`/services`, `/packages`, `/blog`, `/faq`, `/contact`) permanently redirect to the matching home-page section (see `next.config.ts`).

## Plans

- **Starter** $999/mo: basic SEO, one managed campaign, weekly report
- **Growth** $1,500/mo: full SEO, Google + Meta ads, landing pages, strategy calls
- **Scale** $2,500/mo: AI automation, custom CRM, funnels, dedicated manager

## Structure

- Copy and data: `src/data/site-copy.ts` (single source of truth for all site text)
- Design tokens: `src/app/globals.css` + `tailwind.config.ts`
- Sections: `src/components/sections/`
- Fonts: Inter (Aeonik stand-in), Lilita One (display), Instrument Serif (accent)

The services wide card uses a brand-native browser preview until a real client screenshot is available.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
