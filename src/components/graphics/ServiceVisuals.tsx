"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ServiceSlug } from "@/data/site-copy";
import { serviceIcons } from "@/components/graphics/serviceIcons";
import { StickerBurst, StickerOrbit } from "@/components/graphics/BrandStickers";

const ease = [0.16, 1, 0.3, 1] as const;

const scenes: Record<
  ServiceSlug,
  { label: string; lines: string[]; metric: string; metricLabel: string }
> = {
  websites: {
    label: "Live site",
    lines: ["Clear offer", "Fast load", "Book path"],
    metric: "24/7",
    metricLabel: "Closing window",
  },
  "app-development": {
    label: "Native app",
    lines: ["iOS", "Android", "Ship v1"],
    metric: "1 job",
    metricLabel: "Home-screen product",
  },
  marketing: {
    label: "Demand mix",
    lines: ["Search lift", "Paid tests", "Weekly read"],
    metric: "MoM",
    metricLabel: "Compounding traffic",
  },
  "sales-growth": {
    label: "Funnel",
    lines: ["Visit", "Follow-up", "Booked"],
    metric: "1 path",
    metricLabel: "Click to revenue",
  },
  "ai-automation": {
    label: "Automation",
    lines: ["Qualify", "Route", "Handoff"],
    metric: "Hrs",
    metricLabel: "Back each week",
  },
  "ai-employees": {
    label: "AI teammate",
    lines: ["Train", "Own role", "Escalate"],
    metric: "24/7",
    metricLabel: "Coverage on the job",
  },
  "custom-crm": {
    label: "Pipeline",
    lines: ["Stage", "Owner", "Forecast"],
    metric: "1 truth",
    metricLabel: "Shared pipeline",
  },
};

/** Page-specific hero graphic for service detail pages. */
export function ServiceHeroVisual({
  slug,
  icon,
}: {
  slug: ServiceSlug;
  icon: string;
}) {
  const reduce = useReducedMotion();
  const Glyph = serviceIcons[icon];
  const scene = scenes[slug];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0.01, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.14, ease }}
      className="relative mx-auto w-full max-w-[480px] lg:max-w-[520px]"
      aria-hidden
    >
      <div
        className="relative overflow-hidden rounded-[24px] bg-white shadow-form-lift ring-1 ring-rule transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 sm:rounded-[28px]"
      >
        <header className="flex items-center justify-between gap-4 border-b border-rule px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper ring-1 ring-rule">
              {Glyph ? (
                <Glyph size={24} weight="duotone" className="text-forest" />
              ) : null}
            </span>
            <span className="truncate text-xs font-medium uppercase tracking-[0.14em] text-muted">
              {scene.label}
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
            <span
              className="h-2 w-2 rounded-full bg-neon-active ring-2 ring-[color-mix(in_srgb,var(--color-neon-active)_35%,transparent)]"
              aria-hidden
            />
            Live
          </span>
        </header>

        <ol className="divide-y divide-rule px-5 sm:px-6">
          {scene.lines.map((line, i) => (
            <motion.li
              key={line}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 + i * 0.06, ease }}
              className="flex items-center gap-4 py-4 sm:gap-5 sm:py-[18px]"
            >
              <span className="w-7 shrink-0 font-mono text-sm font-medium tracking-[0.06em] text-neon-active">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base font-medium leading-snug tracking-[-0.01em] text-ink sm:text-[17px]">
                {line}
              </span>
            </motion.li>
          ))}
        </ol>

        <div className="grid grid-cols-[auto_1fr] border-t border-rule">
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.38, ease }}
            className="flex w-[88px] items-center justify-center border-r border-rule bg-forest sm:w-[100px]"
          >
            {Glyph ? (
              <Glyph size={32} weight="duotone" className="text-neon" />
            ) : null}
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.42, ease }}
            className="flex flex-col justify-center bg-paper px-5 py-5 sm:px-6 sm:py-6"
          >
            <p className="font-display text-[32px] uppercase leading-[0.92] tracking-[-0.02em] text-ink sm:text-[40px]">
              {scene.metric}
            </p>
            <p className="mt-2 text-sm font-medium leading-snug text-muted">
              {scene.metricLabel}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/** Capability stack graphic for the services index hero. */
export function ServicesIndexVisual({
  items,
}: {
  items: { slug: string; shortLabel: string; category: string; icon: string }[];
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0.01, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, delay: 0.18, ease }}
      className="relative mx-auto w-full max-w-[520px]"
      aria-hidden
    >
      <StickerOrbit className="pointer-events-none absolute -right-8 -top-6 h-40 w-40" />
      <StickerBurst
        className="pointer-events-none absolute left-2 top-10 h-8 w-8"
        tone="neon"
      />

      <div className="relative space-y-3">
        {items.map((item, i) => {
          const Glyph = serviceIcons[item.icon];
          return (
            <motion.div
              key={item.slug}
              initial={reduce ? false : { opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.22 + i * 0.06, ease }}
              className="flex items-center gap-4 rounded-[22px] bg-white/10 px-4 py-3.5 ring-1 ring-white/10 backdrop-blur-md"
              style={{ marginLeft: `${(i % 3) * 12}px` }}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neon/15 ring-1 ring-[color-mix(in_srgb,var(--color-neon)_30%,transparent)]">
                {Glyph ? (
                  <Glyph size={26} weight="duotone" className="text-neon" />
                ) : null}
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
                  {item.category}
                </span>
                <span className="mt-0.5 block font-display text-[22px] uppercase leading-none tracking-[-0.01em] text-white sm:text-[26px]">
                  {item.shortLabel}
                </span>
              </span>
              <span className="ml-auto font-mono text-xs text-neon/80">
                {String(i + 1).padStart(2, "0")}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}