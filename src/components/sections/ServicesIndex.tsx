"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Lightning,
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
      <section className="relative overflow-hidden bg-forest text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(62,91,67,0.55) 0%, transparent 55%)",
          }}
        />
        <StickerOrbit className="pointer-events-none absolute -left-8 top-40 hidden h-36 w-36 lg:block" />
        <StickerOrbit
          className="pointer-events-none absolute -right-6 bottom-16 hidden h-40 w-40 lg:block"
          tone="sage"
        />
        <StickerBurst
          className="pointer-events-none absolute right-[18%] top-36 hidden h-9 w-9 sm:block"
          tone="neon"
        />

        <div className="relative mx-auto flex max-w-[900px] flex-col items-center px-6 pb-20 pt-36 text-center sm:px-10 lg:pb-28 lg:pt-44">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.65, ease: easeOut }}
            className="mb-6 flex flex-wrap items-center justify-center gap-3"
          >
            <StickerPill tone="neon">
              <StickerStack className="h-4 w-4" tone="ink" />
              Five capabilities
            </StickerPill>
            <StickerPill tone="mint" animate={false}>
              <Lightning size={16} weight="duotone" />
              One team
            </StickerPill>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.06, ease: easeOut }}
            className="font-display text-[40px] uppercase leading-[0.95] tracking-[-0.01em] sm:text-[56px] lg:text-[72px]"
          >
            Everything your growth{" "}
            <span className="text-neon">depends on</span>
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: easeOut }}
            className="mt-8 max-w-[560px] text-lg font-medium leading-snug text-fog sm:text-xl"
          >
            Websites, marketing, sales, AI, and CRM, built and run together,
            no hand-offs between agencies.
          </motion.p>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28">
        <ul className="mx-auto grid max-w-[1100px] grid-cols-1 gap-5 px-6 sm:grid-cols-2 sm:px-10 lg:grid-cols-3">
          {services.map((service, i) => {
            const Glyph = serviceIcons[service.icon];
            return (
              <motion.li
                key={service.slug}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.05,
                  ease: easeOut,
                }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col items-center rounded-[28px] bg-white px-7 py-10 text-center transition-colors duration-200 hover:bg-mint/50 sm:px-8"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper transition-transform duration-200 group-hover:scale-[1.05] group-active:scale-[0.97]">
                    <Glyph size={30} weight="duotone" className="text-ink" />
                  </span>
                  <span className="mt-6 text-sm font-medium uppercase tracking-[0.08em] text-muted">
                    {service.category}
                  </span>
                  <span className="mt-2 block font-display text-[28px] uppercase leading-[0.95] tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-moss sm:text-[32px]">
                    {service.shortLabel}
                  </span>
                  <span className="mt-4 block max-w-[320px] text-base leading-relaxed text-body">
                    {service.description}
                  </span>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.06em] text-moss">
                    Explore
                    <ArrowRight
                      size={16}
                      weight="bold"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
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
          className="mx-auto mt-16 flex max-w-[560px] flex-col items-center px-6 text-center"
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
