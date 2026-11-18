"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarCheck } from "@phosphor-icons/react";
import { closing } from "@/data/site-copy";
import { btnPrimary } from "@/components/buttons";
import {
  StickerBurst,
  StickerPill,
} from "@/components/graphics/BrandStickers";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Closing() {
  const reduce = useReducedMotion();

  return (
    <section
      id="closing"
      className="relative scroll-mt-24 overflow-hidden bg-forest py-20 lg:py-28"
      aria-labelledby="closing-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 72% 20%, rgba(104,239,63,0.16) 0%, transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-[320px] w-[320px] rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(62,91,67,0.7) 0%, transparent 70%)",
        }}
      />
      <StickerBurst
        className="pointer-events-none absolute right-[8%] top-16 hidden h-10 w-10 sm:block lg:right-[12%] lg:top-20"
        tone="neon"
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 22, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.7, ease: easeOut }}
        className="relative mx-auto max-w-[1536px] px-6 sm:px-10"
      >
        <div className="group relative overflow-hidden rounded-[28px] bg-white/[0.04] ring-1 ring-white/10 transition-[box-shadow] duration-300 hover:ring-[color-mix(in_srgb,var(--color-neon)_35%,transparent)] lg:rounded-[32px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-neon transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
          />

          <div className="grid grid-cols-1 gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12 lg:px-12 lg:py-16">
            <div className="min-w-0">
              <StickerPill tone="neon">
                <CalendarCheck size={16} weight="duotone" />
                Ready when you are
              </StickerPill>

              <h2
                id="closing-heading"
                className="mt-6 max-w-[640px] font-display text-[40px] uppercase leading-[0.88] tracking-[-0.02em] text-white sm:text-[52px] lg:text-[64px] lg:leading-[0.85] xl:text-[72px]"
              >
                {closing.lineStart}{" "}
                <span className="text-neon">{closing.lineEmphasis}</span>
              </h2>
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.55, delay: 0.08, ease: easeOut }}
              className="flex shrink-0 lg:justify-end lg:pb-1"
            >
              <Link
                href="/contact"
                className={`${btnPrimary} group/btn w-full sm:w-auto`}
              >
                {closing.cta}
                <ArrowRight
                  size={20}
                  weight="bold"
                  className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}