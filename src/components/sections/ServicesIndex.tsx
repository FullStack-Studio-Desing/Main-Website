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
    detail: "Sites that sell, not just decorate the brand.",
  },
  {
    title: "Grow",
    detail: "Traffic and funnels aimed at booked revenue.",
  },
  {
    title: "Automate",
    detail: "AI and CRM that remove drag from the close.",
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
                className="font-display text-[42px] uppercase leading-[0.9] tracking-[-0.02em] sm:text-[60px] lg:text-[72px] xl:text-[80px] lg:leading-[0.88]"
              >
                Everything your growth{" "}
                <span className="text-neon">depends on</span>
              </motion.h1>

              <motion.p
                {...enter(0.12)}
                className="mt-6 max-w-[520px] text-lg font-medium leading-snug text-sage sm:text-xl"
              >
                Websites, marketing, sales, AI, and CRM, built and run together,
                no hand-offs between agencies.
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

      <section className="bg-paper py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1536px] grid-cols-1 gap-0 border-y border-rule px-6 sm:px-10 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: easeOut }}
              className="border-b border-rule py-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-10 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <p className="font-mono text-sm tracking-[0.08em] text-neon-active">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 font-display text-[28px] uppercase leading-[0.95] tracking-[-0.01em] text-ink sm:text-[32px]">
                {pillar.title}
              </h2>
              <p className="mt-3 max-w-[320px] text-base leading-relaxed text-body">
                {pillar.detail}
              </p>
            </motion.div>
          ))}
        </div>
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
            <p className="mt-5 max-w-[520px] text-lg font-medium leading-snug text-muted">
              Every page below is a full offer. Start where revenue is leaking,
              then stack the rest.
            </p>
          </motion.div>

          <ul className="mt-14 space-y-5 lg:mt-16">
            {services.map((service, i) => {
              const Glyph = serviceIcons[service.icon];
              const preview = service.page.outcomes.slice(0, 2);
              const flip = i % 2 === 1;

              return (
                <motion.li
                  key={service.slug}
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.03,
                    ease: easeOut,
                  }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className={`group grid grid-cols-1 overflow-hidden rounded-[28px] bg-paper ring-1 ring-rule transition-all duration-200 hover:ring-moss/30 active:scale-[0.995] sm:rounded-[32px] lg:grid-cols-[1.15fr_0.85fr] ${
                      flip ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div className="flex flex-col justify-center px-6 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-rule transition-transform duration-200 group-hover:scale-[1.04] group-active:scale-[0.97] sm:h-14 sm:w-14">
                          <Glyph
                            size={26}
                            weight="duotone"
                            className="text-ink"
                          />
                        </span>
                        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted sm:text-sm">
                          {service.category}
                        </span>
                      </div>

                      <h3 className="mt-5 font-display text-[32px] uppercase leading-[0.95] tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-moss sm:text-[40px] lg:text-[48px]">
                        {service.shortLabel}
                      </h3>
                      <p className="mt-3 max-w-[520px] text-base leading-relaxed text-body sm:text-lg">
                        {service.description}
                      </p>

                      <ul className="mt-6 space-y-2.5">
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

                      <span className="mt-8 inline-flex items-center gap-2 text-base font-medium text-moss">
                        Explore {service.shortLabel}
                        <ArrowUpRight
                          size={20}
                          weight="bold"
                          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>

                    <div
                      className="relative flex min-h-[220px] flex-col justify-between overflow-hidden bg-forest px-6 py-8 text-white sm:min-h-[260px] sm:px-9 sm:py-10 lg:px-10"
                      style={{
                        background:
                          "radial-gradient(ellipse 80% 70% at 70% 20%, rgba(62,91,67,0.9) 0%, #122314 70%)",
                      }}
                    >
                      <StickerBurst
                        className="absolute right-6 top-6 h-8 w-8 opacity-80"
                        tone="neon"
                      />
                      <p className="font-mono text-xs tracking-[0.12em] text-neon">
                        {String(i + 1).padStart(2, "0")} / 05
                      </p>
                      <div>
                        <p className="max-w-[280px] font-sans text-[22px] italic leading-snug text-fog sm:text-[26px]">
                          {service.page.headline}{" "}
                          <span className="text-neon">
                            {service.page.headlineEmphasis}
                          </span>
                        </p>
                        <p className="mt-4 max-w-[300px] text-sm leading-relaxed text-sage">
                          {service.page.intro.slice(0, 110)}
                          {service.page.intro.length > 110 ? "…" : ""}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
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
