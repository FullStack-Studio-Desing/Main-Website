# FullStack Studio Design

Next.js site for **FullStack Studio Design** — copy from `minifolio-site-copy.txt` (US/Canada), built with [Aceternity UI](https://ui.aceternity.com/components) components.

## Pages (routes)

| Route | Description |
|-------|-------------|
| `/` | Home — hero, about, services, packages, portfolio, testimonials, FAQ, contact, marquee |
| `/about` | About Us — breadcrumb, about section, testimonials |
| `/services` | Services — breadcrumb, all 6 services (Wobble Cards) with full copy |
| `/packages` | Packages — breadcrumb, all 4 packages (Card Spotlight) |
| `/portfolio` | Portfolio — breadcrumb, 6 featured projects |
| `/contact` | Contact — breadcrumb, contact form + info |
| `/faq` | FAQ — breadcrumb, accordion, “Contact Us” CTA, testimonials |
| `/blog` | Blog — breadcrumb, 3 posts (Card Spotlight) |
| `/privacy` | Privacy Policy — placeholder content |
| `/terms` | Terms of Service — placeholder content |
| 404 | Custom not-found — “Back To Home” + “Contact Me” |

Header and Footer are in the root layout and appear on every page. Each page (except home and 404) has a **Breadcrumb** (Home > Page Title).

## Aceternity UI components used

- `Spotlight` – hero
- `MovingBorder` – CTAs (header, hero, packages, contact)
- `BentoGrid` / `BentoGridItem` – about values, portfolio
- `WobbleCard` – service cards
- `CardSpotlight` – package cards
- `InfiniteMovingCards` – testimonials
- `Accordion` – FAQ
- `Marquee` – above footer

Copy and data: `src/data/site-copy.ts` (from `minifolio-site-copy.txt`).

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
