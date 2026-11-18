"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarCheck,
  CheckCircle,
  Path,
} from "@phosphor-icons/react";
import { services } from "@/data/site-copy";
import { btnPrimary, btnGlass } from "@/components/buttons";
import { serviceIcons } from "@/components/graphics/serviceIcons";
import { ServicesIndexVisual } from "@/components/graphics/ServiceVisuals";
import {
  StickerBurst,
  StickerPill,
  StickerStack,
} from "@/components/graphics/BrandStickers";

const easeOut = [0.16, 1, 0.3, 1] as const;

const pillars = [
  {
    title: "Build",
    detail: "Sites and native apps that sell, not just decorate.",
  },
  {
    title: "Grow",
    detail: "Traffic and funnels aimed at booked revenue.",
  },
  {
    title: "Automate",
    detail: "AI teammates, automation, and CRM that remove drag.",
  },
];

export function ServicesIndex() {
  const reduce = useReducedMotion();

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0.01, y: 22, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.75, delay, ease: easeOut },
        };

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
          className="pointer-events-none absolute -right-24 top-1/3 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(104,239,63,0.22) 0%, transparent 70%)",
          }}
        />
        <StickerBurst
          className="pointer-events-none absolute right-[14%] top-36 hidden h-9 w-9 sm:block"
          tone="neon"
        />

        <div className="relative mx-auto flex max-w-[1536px] flex-col justify-center px-6 pb-16 pt-32 sm:px-10 lg:pb-24 lg:pt-36">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            <div className="relative z-10 max-w-[720px]">
              <motion.div {...enter(0)} className="mb-6">
                <StickerPill tone="neon">
                  <StickerStack className="h-4 w-4" tone="ink" />
                  Five capabilities
                </StickerPill>
              </motion.div>

              <motion.h1
                {...enter(0.06)}
                className="line-clamp-2 font-display text-[36px] uppercase leading-[0.9] tracking-[-0.02em] sm:text-[48px] lg:text-[48px] xl:text-[60px] min-[1440px]:text-[68px] lg:leading-[0.88]"
              >
                Everything your{" "}
                <span className="whitespace-nowrap">
                  growth <span className="text-neon">depends on</span>
                </span>
              </motion.h1>

              <motion.p
                {...enter(0.12)}
                className="mt-6 max-w-[520px] text-lg font-medium leading-snug text-sage sm:text-xl"
              >
                Websites, apps, marketing, sales, AI employees, and CRM, built
                and run together, no hand-offs between agencies.
              </motion.p>

              <motion.ul
                {...enter(0.18)}
                className="mt-8 flex flex-col gap-3"
              >
                {[
                  "One team across build, grow, and automate",
                  "Clear weekly reporting on what moved",
                  "Plans that start lean and scale with you",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-base font-medium leading-snug text-fog sm:text-[17px]"
                  >
                    <CheckCircle
                      size={26}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-neon"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </motion.ul>

              <motion.div
                {...enter(0.24)}
                className="mt-10 flex flex-wrap gap-4"
              >
                <Link href="/contact" className={btnPrimary}>
                  Book a call
                </Link>
                <Link href="/#pricing" className={btnGlass}>
                  See pricing
                </Link>
              </motion.div>
            </div>

            <ServicesIndexVisual
              items={services.map((s) => ({
                slug: s.slug,
                shortLabel: s.shortLabel,
                category: s.category,
                icon: s.icon,
              }))}
            />
          </div>
        </div>
      </section>

      <section className="bg-paper" aria-label="Build, grow, automate">
        <ol className="mx-auto max-w-[1536px] list-none border-y border-rule px-0">
          {pillars.map((pillar, i) => (
            <motion.li
              key={pillar.title}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: easeOut }}
              className="group relative border-b border-rule last:border-b-0"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-neon transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
              />
              <div className="grid grid-cols-1 gap-3 px-6 py-10 sm:px-10 sm:py-12 md:grid-cols-[64px_auto_minmax(0,1fr)] md:items-baseline md:gap-6 lg:grid-cols-[80px_auto_minmax(0,1fr)] lg:gap-10 lg:px-10 lg:py-14">
                <p className="font-mono text-sm tracking-[0.12em] text-neon-active md:text-base">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="font-display text-[40px] uppercase leading-[0.88] tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-moss sm:text-[48px] lg:text-[64px] lg:leading-[0.85]">
                  {pillar.title}
                </h2>
                <p className="max-w-[420px] text-base font-medium leading-snug text-body sm:text-lg md:max-w-[380px] md:justify-self-end md:text-right lg:max-w-[440px] lg:text-[19px] lg:leading-snug">
                  {pillar.detail}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1536px] px-6 sm:px-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="max-w-[640px]"
          >
            <StickerPill tone="paper">
              <Path size={16} weight="duotone" />
              Browse by job
            </StickerPill>
            <h2 className="mt-5 font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
              Pick the capability that moves the needle first
            </h2>
            <p className="mt-5 max-w-[520px] text-lg font-medium leading-snug text-soft">
              Every page below is a full offer. Start where revenue is leaking,
              then stack the rest.
            </p>
          </motion.div>

          <ol className="mt-14 list-none border-y border-rule lg:mt-16">
            {services.map((service, i) => {
              const Glyph = serviceIcons[service.icon];
              const preview = service.page.outcomes.slice(0, 2);
              const indexTotal = String(services.length).padStart(2, "0");

              return (
                <motion.li
                  key={service.slug}
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: Math.min(i, 4) * 0.04,
                    ease: easeOut,
                  }}
                  className="border-b border-rule last:border-b-0"
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="group relative block transition-colors duration-200 hover:bg-paper/50 active:bg-paper/70"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-neon transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                    />
                    <div className="grid grid-cols-1 gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[80px_minmax(0,1.12fr)_minmax(260px,0.88fr)] lg:gap-x-12 lg:gap-y-6 lg:py-14 xl:grid-cols-[96px_minmax(0,1.15fr)_minmax(300px,0.85fr)] xl:gap-x-16">
                      <div
                        className="flex items-baseline gap-2 font-mono lg:flex-col lg:items-start lg:gap-0"
                        aria-label={`Service ${i + 1} of ${services.length}`}
                      >
                        <span className="text-lg tracking-[0.14em] text-neon-active sm:text-xl">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm tracking-[0.12em] text-soft lg:mt-1">
                          / {indexTotal}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-rule transition-transform duration-200 group-hover:scale-[1.03] group-active:scale-[0.98] sm:h-12 sm:w-12">
                            <Glyph
                              size={24}
                              weight="duotone"
                              className="text-ink"
                            />
                          </span>
                          <span className="text-xs font-medium uppercase tracking-[0.12em] text-soft sm:text-sm">
                            {service.category}
                          </span>
                        </div>

                        <h3 className="mt-4 font-display text-[32px] uppercase leading-[0.94] tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-moss sm:mt-5 sm:text-[40px] lg:text-[44px]">
                          {service.shortLabel}
                        </h3>
                        <p className="mt-3 max-w-[560px] text-base leading-snug text-body sm:text-lg sm:leading-snug">
                          {service.description}
                        </p>

                        <ul className="mt-6 space-y-2.5 sm:mt-7">
                          {preview.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-sm font-medium leading-snug text-ink sm:text-base"
                            >
                              <CheckCircle
                                size={20}
                                weight="fill"
                                className="mt-0.5 shrink-0 text-leaf"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <span className="mt-7 inline-flex items-center gap-2 text-base font-medium text-moss sm:mt-8">
                          Explore {service.shortLabel}
                          <ArrowUpRight
                            size={20}
                            weight="bold"
                            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </span>
                      </div>

                      <div className="relative flex min-h-[200px] flex-col overflow-hidden rounded-[24px] bg-forest px-6 py-7 text-white ring-1 ring-[color-mix(in_srgb,var(--color-moss)_25%,transparent)] sm:min-h-[220px] sm:rounded-[28px] sm:px-8 sm:py-9 lg:min-h-0 lg:self-stretch">
                        <StickerBurst
                          className="pointer-events-none absolute right-5 top-5 h-7 w-7 opacity-70 sm:right-6 sm:top-6 sm:h-8 sm:w-8"
                          tone="neon"
                        />
                        <div className="relative mt-auto">
                          <p className="max-w-[320px] font-sans text-[20px] font-medium leading-snug text-fog sm:text-[24px] lg:text-[22px] xl:text-[26px]">
                            {service.page.headline}{" "}
                            <span className="text-neon">
                              {service.page.headlineEmphasis}
                            </span>
                          </p>
                          <p className="mt-4 max-w-[340px] text-sm leading-snug text-sage sm:text-[15px]">
                            {service.page.intro}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden bg-forest py-20 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 55% at 50% 100%, rgba(104,239,63,0.14) 0%, transparent 55%)",
          }}
        />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="relative mx-auto flex max-w-[720px] flex-col items-center px-6 text-center sm:px-10"
        >
          <StickerPill tone="neon">
            <CalendarCheck size={16} weight="duotone" />
            Next step
          </StickerPill>
          <p className="mt-6 font-display text-[36px] uppercase leading-[0.9] tracking-[-0.02em] text-white sm:text-[48px] lg:text-[56px]">
            Not sure where to <span className="text-neon">start</span>
          </p>
          <p className="mt-5 max-w-[480px] text-lg font-medium leading-snug text-sage">
            We&apos;ll map the leak on a call and tell you which capability
            pays off first.
          </p>
          <Link href="/contact" className={`${btnPrimary} mt-9`}>
            Book a call
          </Link>
        </motion.div>
      </section>
    </>
  );
}
