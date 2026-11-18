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
      initial={reduce ? false : { opacity: 0.01, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, delay: 0.16, ease }}
      className="relative mx-auto w-full max-w-[520px]"
      aria-hidden
    >
      <StickerOrbit className="pointer-events-none absolute -left-10 -top-8 h-36 w-36 opacity-70" />
      <StickerBurst
        className="pointer-events-none absolute -right-2 top-8 h-9 w-9"
        tone="neon"
      />

      <div className="relative overflow-hidden rounded-[28px] bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-xl sm:rounded-[32px] sm:p-6">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(104,239,63,0.35) 0%, transparent 70%)",
          }}
        />

        <div className="relative flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-neon/15 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.1em] text-neon ring-1 ring-[color-mix(in_srgb,var(--color-neon)_30%,transparent)]">
            {Glyph ? <Glyph size={14} weight="duotone" /> : null}
            {scene.label}
          </span>
          <span className="font-mono text-xs tracking-[0.08em] text-sage">
            LIVE
          </span>
        </div>

        <div className="relative mt-6 grid grid-cols-[1.1fr_0.9fr] gap-4">
          <div className="space-y-3">
            {scene.lines.map((line, i) => (
              <motion.div
                key={line}
                initial={reduce ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.28 + i * 0.07, ease }}
                className="flex items-center gap-3 rounded-2xl bg-white/10 px-3.5 py-3 ring-1 ring-white/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neon/20 font-mono text-xs text-neon">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-fog">{line}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4, ease }}
            className="flex flex-col justify-between rounded-[24px] bg-forest p-4 ring-1 ring-white/10"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, #3e5b43 0%, #122314 62%)",
            }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neon/15 ring-1 ring-[color-mix(in_srgb,var(--color-neon)_35%,transparent)]">
              {Glyph ? (
                <Glyph size={28} weight="duotone" className="text-neon" />
              ) : null}
            </div>
            <div className="mt-8">
              <p className="font-display text-[36px] uppercase leading-none tracking-[-0.02em] text-neon">
                {scene.metric}
              </p>
              <p className="mt-2 text-sm font-medium leading-snug text-sage">
                {scene.metricLabel}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-neon"
            initial={reduce ? { width: "72%" } : { width: "0%" }}
            animate={{ width: "72%" }}
            transition={{ duration: 1.1, delay: 0.55, ease }}
          />
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
