"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarCheck,
} from "@phosphor-icons/react";
import { services } from "@/data/site-copy";
import { btnPrimary } from "@/components/buttons";
import { serviceIcons } from "@/components/graphics/serviceIcons";
import {
  StickerBurst,
  StickerOrbit,
  StickerPill,
  StickerStack,
} from "@/components/graphics/BrandStickers";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function ServicesIndex() {
  const reduce = useReducedMotion();

  return (
    <>
      <section className="relative overflow-hidden rounded-b-[32px] bg-forest text-white md:rounded-b-none">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(62,91,67,0.55) 0%, transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/3 h-[360px] w-[360px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(104,239,63,0.2) 0%, transparent 70%)",
          }}
        />
        <StickerOrbit className="pointer-events-none absolute -left-8 top-40 hidden h-36 w-36 lg:block" />
        <StickerBurst
          className="pointer-events-none absolute right-[18%] top-36 hidden h-9 w-9 sm:block"
          tone="neon"
        />

        <div className="relative mx-auto flex max-w-[900px] flex-col items-center px-6 pb-16 pt-36 text-center sm:px-10 lg:pb-20 lg:pt-44">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.65, ease: easeOut }}
            className="mb-6"
          >
            <StickerPill tone="neon">
              <StickerStack className="h-4 w-4" tone="ink" />
              Five capabilities
            </StickerPill>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.06, ease: easeOut }}
            className="font-display text-[42px] uppercase leading-[0.9] tracking-[-0.02em] sm:text-[60px] lg:text-[76px] lg:leading-[0.88]"
          >
            Everything your growth{" "}
            <span className="text-neon">depends on</span>
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: easeOut }}
            className="mt-7 max-w-[540px] text-lg font-medium leading-snug text-fog sm:text-xl"
          >
            Websites, marketing, sales, AI, and CRM, built and run together,
            no hand-offs between agencies.
          </motion.p>
        </div>
      </section>

      <section className="bg-paper py-16 lg:py-24">
        <ul className="mx-auto max-w-[1100px] border-t border-rule px-6 sm:px-10">
          {services.map((service, i) => {
            const Glyph = serviceIcons[service.icon];
            return (
              <motion.li
                key={service.slug}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.04,
                  ease: easeOut,
                }}
                className="border-b border-rule"
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-start justify-between gap-5 py-7 transition-colors duration-200 active:opacity-90 sm:items-center sm:gap-8 sm:py-9"
                >
                  <span className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-6">
                    <span className="mt-0.5 flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-rule transition-transform duration-200 group-hover:scale-[1.04] group-active:scale-[0.97] sm:mt-0 sm:h-14 sm:w-14">
                      <Glyph
                        size={26}
                        weight="duotone"
                        className="text-ink"
                      />
                    </span>
                    <span className="min-w-0 text-left">
                      <span className="block text-xs font-medium uppercase tracking-[0.1em] text-muted sm:text-sm sm:tracking-[0.08em]">
                        {service.category}
                      </span>
                      <span className="mt-1.5 block font-display text-[28px] uppercase leading-[0.95] tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-moss sm:text-[36px] lg:text-[44px]">
                        {service.shortLabel}
                      </span>
                      <span className="mt-2 block max-w-[540px] text-base leading-relaxed text-body sm:text-lg">
                        {service.description}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={26}
                    weight="bold"
                    className="mt-2 shrink-0 text-sage transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-leaf sm:mt-0"
                  />
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="mx-auto mt-14 flex max-w-[560px] flex-col items-center px-6 text-center lg:mt-20"
        >
          <StickerPill tone="neon">
            <CalendarCheck size={16} weight="duotone" />
            Next step
          </StickerPill>
          <p className="mt-6 text-lg font-medium leading-snug text-muted">
            Not sure which capability to start with? We&apos;ll map it on a call.
          </p>
          <Link href="/contact" className={`${btnPrimary} mt-8`}>
            Book a call
          </Link>
        </motion.div>
      </section>
    </>
  );
}
