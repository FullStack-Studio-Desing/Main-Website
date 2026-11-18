"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ServiceSlug } from "@/data/site-copy";
import { services } from "@/data/site-copy";
import { serviceIcons } from "@/components/graphics/serviceIcons";
import { StickerBurst, StickerOrbit } from "@/components/graphics/BrandStickers";
import { mediaUrl } from "@/lib/media";

const ease = [0.16, 1, 0.3, 1] as const;

/** Desktop/widgets 1–7 map to services in site-copy order; 8 reserved. */
const serviceWidgetIndex: Record<ServiceSlug, number> = Object.fromEntries(
  services.map((service, i) => [service.slug, i + 1]),
) as Record<ServiceSlug, number>;

function widgetSrc(slug: ServiceSlug) {
  return mediaUrl(`/images/services/widgets/${serviceWidgetIndex[slug]}.png`);
}

/** 3D widget hero for every service detail page. */
export function ServiceHeroVisual({
  slug,
}: {
  slug: ServiceSlug;
  icon?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0.01, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.14, ease }}
      className="relative mx-auto w-full max-w-[520px] lg:max-w-[580px]"
      aria-hidden
    >
      <div className="relative aspect-square w-full">
        <Image
          src={widgetSrc(slug)}
          alt=""
          fill
          priority={slug === "websites"}
          sizes="(max-width: 1024px) 90vw, 580px"
          className="object-contain object-center drop-shadow-[0_24px_48px_rgba(0,0,0,0.35)]"
        />
      </div>
    </motion.div>
  );
}

/** @deprecated Use ServiceHeroVisual — kept for any lingering imports. */
export function WebsitesServiceHeroVisual(_props: { icon: string }) {
  return <ServiceHeroVisual slug="websites" />;
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
