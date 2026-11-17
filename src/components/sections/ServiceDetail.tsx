"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
} from "@phosphor-icons/react";
import { services, type Service } from "@/data/site-copy";
import { btnPrimary, btnGlass, btnInverse } from "@/components/buttons";
import { serviceIcons } from "@/components/graphics/serviceIcons";
import {
  StickerBurst,
  StickerPill,
} from "@/components/graphics/BrandStickers";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function ServiceDetail({ service }: { service: Service }) {
  const reduce = useReducedMotion();
  const faqId = useId();
  const IconGlyph = serviceIcons[service.icon];
  const others = services.filter((s) => s.slug !== service.slug);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [lead, ...restBody] = service.page.body;

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0.01, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.65,
            delay,
            ease: easeOut,
          },
        };

  const inView = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.35 },
          transition: { duration: 0.55, delay, ease: easeOut },
        };

  return (
    <main>
      {/* Hero — full-bleed forest, brand-forward display type */}
      <section className="relative overflow-hidden bg-forest text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 18% 42%, rgba(62,91,67,0.55) 0%, transparent 58%), radial-gradient(ellipse 45% 40% at 88% 18%, rgba(104,239,63,0.12) 0%, transparent 50%)",
          }}
        />

        {/* Soft sculptural mark — atmosphere, not a card */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[12%] top-[18%] hidden h-[min(70vh,560px)] w-[min(70vh,560px)] lg:block"
        >
          <div
            className="grain absolute inset-0 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, #c8cfb4 0%, #8f997c 28%, #3e5b43 58%, #122314 100%)",
              boxShadow:
                "0 60px 120px rgba(0,0,0,0.45), inset -28px -36px 60px rgba(0,0,0,0.35)",
            }}
          />
          <div
            className="absolute left-[22%] top-[30%] h-[42%] w-[42%] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 62% 36%, #040704 0%, #122314 100%)",
            }}
          />
          <IconGlyph
            size={88}
            weight="duotone"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-neon/35"
          />
        </div>

        <div className="relative mx-auto max-w-[1100px] px-6 pb-24 pt-36 sm:px-10 lg:pb-32 lg:pt-44">
          <motion.div {...enter(0)}>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-base font-medium text-sage transition-colors duration-200 hover:text-neon active:scale-[0.99]"
            >
              <ArrowLeft size={18} weight="bold" />
              All services
            </Link>
          </motion.div>

          <motion.div
            {...enter(0.05)}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-1.5 rounded-proof bg-neon px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.06em] text-ink sm:text-sm">
              <IconGlyph size={16} weight="duotone" className="text-ink" />
              {service.category}
            </span>
            <span className="inline-flex items-center rounded-proof bg-white/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.06em] text-white ring-1 ring-white/15 sm:text-sm">
              {service.shortLabel}
            </span>
          </motion.div>

          <motion.h1
            {...enter(0.1)}
            className="mt-8 max-w-[920px] font-display text-[42px] uppercase leading-[0.92] tracking-[-0.02em] sm:text-[58px] lg:text-[76px] lg:leading-[0.88]"
          >
            {service.page.headline}{" "}
            <span className="text-neon">{service.page.headlineEmphasis}</span>
          </motion.h1>

          <motion.p
            {...enter(0.16)}
            className="mt-8 max-w-[580px] text-lg font-medium leading-snug tracking-[-0.015em] text-fog sm:text-xl sm:leading-snug"
          >
            {service.page.intro}
          </motion.p>

          <motion.div
            {...enter(0.22)}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/contact" className={btnPrimary}>
              Book a call
            </Link>
            <Link href="/#pricing" className={btnGlass}>
              See pricing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Editorial deep dive */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-14 px-6 sm:px-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <motion.div {...inView(0)}>
            <p className="font-serif text-[28px] italic leading-snug tracking-tight text-ink sm:text-[32px] sm:leading-[1.25]">
              {lead}
            </p>
            <div className="mt-10 flex flex-col gap-6 border-t border-rule pt-10">
              {restBody.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="max-w-[640px] text-lg leading-relaxed text-body sm:text-xl sm:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.aside
            {...inView(0.08)}
            className="flex flex-col justify-between rounded-shell bg-paper p-8 lg:p-10"
            aria-label="Key outcomes"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-leaf">
                What shifts
              </p>
              <ul className="mt-6 flex flex-col gap-5">
                {service.page.outcomes.slice(0, 3).map((item, i) => (
                  <li
                    key={item}
                    className="border-t border-rule pt-5 first:border-t-0 first:pt-0"
                  >
                    <span className="font-display text-lg text-sage">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-2 text-base font-medium leading-snug tracking-[-0.01em] text-ink">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/contact"
              className={`${btnInverse} mt-10 self-start`}
            >
              Talk this through
            </Link>
          </motion.aside>
        </div>
      </section>

      {/* Full outcomes grid */}
      <section className="relative overflow-hidden bg-paper py-24 lg:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 0%, rgba(231,249,221,0.75) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-[1100px] px-6 sm:px-10">
          <motion.div {...inView(0)}>
            <h2 className="max-w-[720px] font-display text-[36px] uppercase leading-[0.95] tracking-[-0.02em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[0.9]">
              What this changes{" "}
              <span className="text-neon-active">for you</span>
            </h2>
          </motion.div>

          <ul className="mt-14 grid grid-cols-1 gap-x-12 gap-y-2 md:grid-cols-2">
            {service.page.outcomes.map((item, i) => (
              <motion.li
                key={item}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.05,
                  ease: easeOut,
                }}
                className="flex gap-5 border-t border-rule py-7"
              >
                <span
                  className="font-display text-3xl leading-none text-sage"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="pt-1 text-lg font-medium leading-snug tracking-[-0.012em] text-ink sm:text-xl">
                  {item}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works — process rhythm */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
          <motion.div {...inView(0)}>
            <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.02em] text-ink sm:text-[48px] lg:text-[56px]">
              How we deliver it
            </h2>
            <p className="mt-5 max-w-[520px] text-lg font-medium leading-snug text-muted">
              Clear stages, visible progress, no mystery retainers.
            </p>
          </motion.div>

          <ol className="mt-14 border-t border-rule">
            {service.page.howItWorks.map((step, i) => (
              <motion.li
                key={step.title}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.07,
                  ease: easeOut,
                }}
                className="grid grid-cols-1 gap-4 border-b border-rule py-10 md:grid-cols-[120px_1fr] md:gap-12 lg:grid-cols-[140px_220px_1fr]"
              >
                <span className="font-display text-2xl text-sage">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-3xl italic tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="max-w-[420px] text-base leading-relaxed text-body md:col-span-2 lg:col-span-1">
                  {step.detail}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Includes + plan note */}
      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-6 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div {...inView(0)}>
            <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.02em] text-ink sm:text-[48px]">
              What&apos;s included
            </h2>
            <ul className="mt-10 flex flex-col gap-1">
              {service.page.includes.map((item, i) => (
                <motion.li
                  key={item}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.04,
                    ease: easeOut,
                  }}
                  className="flex items-start gap-3 border-t border-rule py-4 first:border-t-0"
                >
                  <Check
                    size={18}
                    weight="bold"
                    className="mt-0.5 shrink-0 text-leaf"
                  />
                  <span className="text-base leading-relaxed text-body sm:text-lg">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            {...inView(0.1)}
            className="relative flex flex-col justify-between overflow-hidden rounded-shell bg-forest p-8 text-white lg:p-10"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(104,239,63,0.45) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <StickerPill tone="neon" animate={false}>
                <StickerBurst className="h-3.5 w-3.5" tone="ink" />
                Plans
              </StickerPill>
              <p className="mt-8 font-serif text-[28px] italic leading-snug text-white sm:text-[32px]">
                {service.page.planNote}
              </p>
            </div>
            <div className="relative mt-12 flex flex-wrap gap-3">
              <Link href="/#pricing" className={btnPrimary}>
                Compare plans
              </Link>
              <Link href="/contact" className={btnGlass}>
                Ask which fits
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service FAQs */}
      <section
        className="bg-white py-24 lg:py-32"
        aria-labelledby={`${faqId}-heading`}
      >
        <div className="mx-auto max-w-[800px] px-6 sm:px-10">
          <motion.div {...inView(0)} className="text-center">
            <div className="mb-6 flex justify-center">
              <StickerPill tone="paper">
                Straight answers
              </StickerPill>
            </div>
            <h2
              id={`${faqId}-heading`}
              className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.02em] text-ink sm:text-[48px]"
            >
              Common questions
            </h2>
          </motion.div>

          <ul className="mt-12 divide-y divide-rule border-y border-rule">
            {service.page.faqs.map((item, i) => {
              const isOpen = openFaq === i;
              const panelId = `${faqId}-panel-${i}`;
              const buttonId = `${faqId}-button-${i}`;
              return (
                <li key={item.q}>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-150 active:opacity-80"
                  >
                    <span className="text-lg font-medium tracking-[-0.01em] text-ink sm:text-xl">
                      {item.q}
                    </span>
                    <span
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper text-ink"
                      aria-hidden
                    >
                      {isOpen ? (
                        <Minus size={16} weight="bold" />
                      ) : (
                        <Plus size={16} weight="bold" />
                      )}
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                  >
                    {isOpen && (
                      <p className="max-w-[640px] pb-6 text-base leading-relaxed text-body">
                        {item.a}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Other services */}
      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
          <motion.div {...inView(0)}>
            <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.02em] text-ink sm:text-[48px] lg:text-[56px]">
              More capabilities
            </h2>
            <p className="mt-5 max-w-[540px] text-lg font-medium leading-snug text-muted">
              One team across build, grow, and automate — no agency hand-offs.
            </p>
          </motion.div>

          <ul className="mt-12 divide-y divide-rule border-y border-rule">
            {others.map((item, i) => {
              const Glyph = serviceIcons[item.icon];
              return (
                <motion.li
                  key={item.slug}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.04,
                    ease: easeOut,
                  }}
                >
                  <Link
                    href={`/services/${item.slug}`}
                    className="group flex items-center justify-between gap-6 py-7"
                  >
                    <span className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition-transform duration-200 group-hover:scale-[1.04] group-active:scale-[0.97]">
                        <Glyph
                          size={22}
                          weight="duotone"
                          className="text-ink"
                        />
                      </span>
                      <span>
                        <span className="block text-lg font-medium tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-leaf sm:text-xl">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted">
                          {item.category}
                        </span>
                      </span>
                    </span>
                    <ArrowRight
                      size={20}
                      weight="bold"
                      className="shrink-0 text-sage transition-transform duration-200 group-hover:translate-x-1 group-hover:text-leaf"
                    />
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-forest py-24 lg:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 55% at 50% 100%, rgba(104,239,63,0.14) 0%, transparent 55%)",
          }}
        />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="relative mx-auto flex max-w-[800px] flex-col items-center px-6 text-center sm:px-10"
        >
          <StickerPill tone="neon">
            <StickerBurst className="h-4 w-4" tone="ink" />
            Next step
          </StickerPill>
          <p className="mt-8 font-display text-[40px] uppercase leading-[0.92] tracking-[-0.02em] text-white sm:text-[56px] lg:text-[68px] lg:leading-[0.88]">
            Ready to put this to <span className="text-neon">work</span>
          </p>
          <p className="mt-6 max-w-[520px] text-lg font-medium leading-snug text-sage">
            Tell us where you want to be in 90 days. We&apos;ll come back with
            an honest read on how we can help.
          </p>
          <Link href="/contact" className={`${btnPrimary} mt-10`}>
            Book a call
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
