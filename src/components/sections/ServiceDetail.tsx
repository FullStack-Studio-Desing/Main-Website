"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  ChartLineUp,
  CheckCircle,
  Compass,
  Lightning,
  MagnifyingGlass,
  Minus,
  PaintBrush,
  Path,
  Plus,
  Rocket,
  Sparkle,
  Target,
  Wrench,
  type Icon,
} from "@phosphor-icons/react";
import { services, type Service } from "@/data/site-copy";
import { btnPrimary, btnGlass } from "@/components/buttons";
import { serviceIcons } from "@/components/graphics/serviceIcons";
import {
  StickerBurst,
  StickerOrbit,
  StickerPill,
  StickerStack,
} from "@/components/graphics/BrandStickers";

const easeOut = [0.16, 1, 0.3, 1] as const;

const outcomeIcons: Icon[] = [
  Target,
  Lightning,
  ChartLineUp,
  Sparkle,
  CheckCircle,
  Path,
];

const stepIcons: Icon[] = [Compass, PaintBrush, Rocket];

const includeIcons: Icon[] = [
  MagnifyingGlass,
  Wrench,
  Lightning,
  ChartLineUp,
  Sparkle,
  CheckCircle,
];

export function ServiceDetail({ service }: { service: Service }) {
  const reduce = useReducedMotion();
  const faqId = useId();
  const IconGlyph = serviceIcons[service.icon];
  const others = services.filter((s) => s.slug !== service.slug);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const lead = service.page.body[0];

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0.01, y: 20, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.7, delay, ease: easeOut },
        };

  const inView = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.55, delay, ease: easeOut },
        };

  return (
    <main>
      {/* Hero — centered, contact-page energy */}
      <section className="relative overflow-hidden bg-forest text-white">
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
          className="pointer-events-none absolute -left-24 top-1/4 h-[360px] w-[360px] rounded-full opacity-35 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(104,239,63,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 bottom-0 h-[320px] w-[320px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(231,249,221,0.18) 0%, transparent 70%)",
          }}
        />

        <StickerOrbit className="pointer-events-none absolute -left-6 top-36 hidden h-36 w-36 lg:block" />
        <StickerOrbit
          className="pointer-events-none absolute -right-4 bottom-24 hidden h-40 w-40 lg:block"
          tone="sage"
        />
        <StickerBurst
          className="pointer-events-none absolute right-[12%] top-40 hidden h-10 w-10 sm:block"
          tone="neon"
        />

        <div className="relative mx-auto flex max-w-[900px] flex-col items-center px-6 pb-24 pt-36 text-center sm:px-10 lg:pb-32 lg:pt-44">
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
            className="relative mt-10 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32"
          >
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 32% 28%, #c8cfb4 0%, #8f997c 28%, #3e5b43 58%, #122314 100%)",
                boxShadow:
                  "0 40px 80px rgba(0,0,0,0.35), inset -18px -24px 40px rgba(0,0,0,0.3)",
              }}
              animate={
                reduce
                  ? undefined
                  : { rotate: [0, 4, -3, 0], scale: [1, 1.03, 1] }
              }
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <IconGlyph
              size={56}
              weight="duotone"
              className="relative text-neon"
            />
          </motion.div>

          <motion.div
            {...enter(0.1)}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <StickerPill tone="neon">
              <IconGlyph size={16} weight="duotone" />
              {service.category}
            </StickerPill>
            <StickerPill tone="mint" animate={false}>
              <Lightning size={16} weight="duotone" />
              {service.shortLabel}
            </StickerPill>
          </motion.div>

          <motion.h1
            {...enter(0.14)}
            className="mt-8 max-w-[860px] font-display text-[42px] uppercase leading-[0.92] tracking-[-0.02em] sm:text-[58px] lg:text-[72px] lg:leading-[0.88]"
          >
            {service.page.headline}{" "}
            <span className="text-neon">{service.page.headlineEmphasis}</span>
          </motion.h1>

          <motion.p
            {...enter(0.2)}
            className="mt-7 max-w-[560px] text-lg font-medium leading-snug tracking-[-0.015em] text-fog sm:text-xl sm:leading-snug"
          >
            {service.page.intro}
          </motion.p>

          <motion.div
            {...enter(0.26)}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
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

      {/* Lead + outcome icons */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
          <motion.div {...inView(0)} className="mx-auto max-w-[720px] text-center">
            <div className="mb-6 flex justify-center">
              <StickerPill tone="paper">
                <StickerStack className="h-4 w-4" tone="ink" />
                The shift
              </StickerPill>
            </div>
            <p className="font-sans text-[26px] italic leading-snug tracking-tight text-ink sm:text-[32px] sm:leading-[1.25]">
              {lead}
            </p>
          </motion.div>

          <ul className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-8">
            {service.page.outcomes.map((item, i) => {
              const Glyph = outcomeIcons[i % outcomeIcons.length];
              return (
                <motion.li
                  key={item}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.06,
                    ease: easeOut,
                  }}
                  className="flex flex-col items-center text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper ring-1 ring-rule">
                    <Glyph size={28} weight="duotone" className="text-ink" />
                  </span>
                  <span className="mt-5 font-display text-lg text-sage">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-base font-medium leading-snug tracking-[-0.01em] text-ink sm:text-lg">
                    {item}
                  </p>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* How it works — visual steps */}
      <section className="relative overflow-hidden bg-paper py-24 lg:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 0%, rgba(231,249,221,0.85) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-[1100px] px-6 sm:px-10">
          <motion.div {...inView(0)} className="mx-auto max-w-[640px] text-center">
            <div className="mb-6 flex justify-center">
              <StickerPill tone="neon">
                <Path size={16} weight="duotone" />
                Process
              </StickerPill>
            </div>
            <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.02em] text-ink sm:text-[48px] lg:text-[56px]">
              How we deliver it
            </h2>
            <p className="mt-5 text-lg font-medium leading-snug text-muted">
              Clear stages, visible progress, no mystery retainers.
            </p>
          </motion.div>

          <ol className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {service.page.howItWorks.map((step, i) => {
              const Glyph = stepIcons[i % stepIcons.length];
              return (
                <motion.li
                  key={step.title}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.08,
                    ease: easeOut,
                  }}
                  className="relative flex flex-col items-center text-center"
                >
                  {i < service.page.howItWorks.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[calc(50%+48px)] top-10 hidden h-px w-[calc(100%-96px)] bg-rule md:block"
                    />
                  )}
                  <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_12px_40px_rgba(18,35,20,0.08)] ring-1 ring-rule">
                    <Glyph size={32} weight="duotone" className="text-ink" />
                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-neon font-display text-xs text-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <h3 className="mt-7 font-sans text-2xl italic tracking-tight text-ink sm:text-[28px]">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[280px] text-base leading-relaxed text-body">
                    {step.detail}
                  </p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Includes — icon chips */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[1000px] px-6 sm:px-10">
          <motion.div {...inView(0)} className="mx-auto max-w-[640px] text-center">
            <div className="mb-6 flex justify-center">
              <StickerPill tone="paper">
                <CheckCircle size={16} weight="duotone" />
                Included
              </StickerPill>
            </div>
            <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.02em] text-ink sm:text-[48px]">
              What&apos;s in the work
            </h2>
          </motion.div>

          <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {service.page.includes.map((item, i) => {
              const Glyph = includeIcons[i % includeIcons.length];
              return (
                <motion.li
                  key={item}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.04,
                    ease: easeOut,
                  }}
                  className="flex items-center gap-4 rounded-[24px] bg-paper px-5 py-4"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
                    <Glyph size={22} weight="duotone" className="text-ink" />
                  </span>
                  <span className="text-base font-medium leading-snug text-ink sm:text-lg">
                    {item}
                  </span>
                </motion.li>
              );
            })}
          </ul>

          <motion.div
            {...inView(0.1)}
            className="relative mt-16 overflow-hidden rounded-[32px] bg-forest px-8 py-12 text-center text-white sm:px-12 lg:py-14"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full opacity-40 blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(104,239,63,0.45) 0%, transparent 70%)",
              }}
            />
            <StickerOrbit className="pointer-events-none absolute -left-8 bottom-4 hidden h-32 w-32 sm:block" />
            <div className="relative mx-auto flex max-w-[560px] flex-col items-center">
              <StickerPill tone="neon" animate={false}>
                <StickerBurst className="h-3.5 w-3.5" tone="ink" />
                Plans
              </StickerPill>
              <p className="mt-7 font-sans text-[26px] italic leading-snug text-white sm:text-[30px]">
                {service.page.planNote}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link href="/#pricing" className={btnPrimary}>
                  Compare plans
                </Link>
                <Link href="/contact" className={btnGlass}>
                  Ask which fits
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section
        className="bg-paper py-24 lg:py-32"
        aria-labelledby={`${faqId}-heading`}
      >
        <div className="mx-auto max-w-[800px] px-6 sm:px-10">
          <motion.div {...inView(0)} className="text-center">
            <div className="mb-6 flex justify-center">
              <StickerPill tone="mint">Straight answers</StickerPill>
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
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink"
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
                      <p className="mx-auto max-w-[640px] pb-6 text-base leading-relaxed text-body">
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

      {/* Other services — visual grid */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
          <motion.div {...inView(0)} className="mx-auto max-w-[640px] text-center">
            <div className="mb-6 flex justify-center">
              <StickerPill tone="paper">
                <StickerBurst className="h-3.5 w-3.5" tone="ink" />
                Stack
              </StickerPill>
            </div>
            <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.02em] text-ink sm:text-[48px] lg:text-[56px]">
              More capabilities
            </h2>
            <p className="mt-5 text-lg font-medium leading-snug text-muted">
              One team across build, grow, and automate.
            </p>
          </motion.div>

          <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {others.map((item, i) => {
              const Glyph = serviceIcons[item.icon];
              return (
                <motion.li
                  key={item.slug}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.05,
                    ease: easeOut,
                  }}
                >
                  <Link
                    href={`/services/${item.slug}`}
                    className="group flex h-full items-start gap-5 rounded-[28px] bg-paper px-6 py-6 transition-colors duration-200 hover:bg-mint/60 sm:px-7 sm:py-7"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-200 group-hover:scale-[1.04] group-active:scale-[0.97]">
                      <Glyph size={26} weight="duotone" className="text-ink" />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block text-sm font-medium uppercase tracking-[0.06em] text-muted">
                        {item.category}
                      </span>
                      <span className="mt-1 block text-xl font-medium tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-leaf sm:text-2xl">
                        {item.title}
                      </span>
                      <span className="mt-2 block text-base leading-relaxed text-body">
                        {item.description}
                      </span>
                    </span>
                    <ArrowRight
                      size={20}
                      weight="bold"
                      className="mt-2 shrink-0 text-sage transition-transform duration-200 group-hover:translate-x-1 group-hover:text-leaf"
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
        <StickerOrbit className="pointer-events-none absolute left-[8%] top-16 hidden h-36 w-36 lg:block" />
        <StickerOrbit
          className="pointer-events-none absolute bottom-12 right-[10%] hidden h-40 w-40 lg:block"
          tone="sage"
        />
        <motion.div
          initial={
            reduce ? false : { opacity: 0, y: 24, filter: "blur(4px)" }
          }
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="relative mx-auto flex max-w-[800px] flex-col items-center px-6 text-center sm:px-10"
        >
          <StickerPill tone="neon">
            <CalendarCheck size={16} weight="duotone" />
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
