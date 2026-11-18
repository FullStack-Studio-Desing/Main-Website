"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
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
  ServiceHeroVisual,
  WebsitesServiceHeroVisual,
} from "@/components/graphics/ServiceVisuals";
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
  const [lead, ...restBody] = service.page.body;

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
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.5, delay, ease: easeOut },
        };

  return (
    <main>
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

        <div className="relative mx-auto max-w-[1536px] px-6 pb-16 pt-32 sm:px-10 lg:pb-24 lg:pt-36">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            <div className="relative z-10 max-w-[720px]">
              <motion.div {...enter(0.05)}>
                <StickerPill tone="neon">
                  <IconGlyph size={16} weight="duotone" />
                  {service.category}
                </StickerPill>
              </motion.div>

              <motion.h1
                {...enter(0.1)}
                className="mt-6 max-w-[720px] font-display text-[40px] uppercase leading-[0.9] tracking-[-0.02em] sm:text-[56px] lg:text-[64px] xl:text-[72px] lg:leading-[0.88]"
              >
                {service.page.headline}{" "}
                <span className="text-neon">
                  {service.page.headlineEmphasis}
                </span>
              </motion.h1>

              <motion.p
                {...enter(0.16)}
                className="mt-6 max-w-[520px] text-lg font-medium leading-snug tracking-[-0.015em] text-fog sm:text-xl"
              >
                {service.page.intro}
              </motion.p>

              <motion.ul
                {...enter(0.2)}
                className="mt-8 flex flex-col gap-3"
              >
                {service.page.outcomes.slice(0, 3).map((line) => (
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
                {...enter(0.26)}
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

            {service.slug === "websites" ? (
              <WebsitesServiceHeroVisual icon={service.icon} />
            ) : (
              <ServiceHeroVisual slug={service.slug} icon={service.icon} />
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1536px] px-6 sm:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <motion.div {...inView(0)}>
              <div className="mb-5">
                <StickerPill tone="paper">
                  <StickerStack className="h-4 w-4" tone="ink" />
                  The shift
                </StickerPill>
              </div>
              <p className="font-sans text-[24px] italic leading-snug tracking-tight text-ink sm:text-[30px] sm:leading-[1.3]">
                {lead}
              </p>
            </motion.div>

            <div className="space-y-6 border-t border-rule pt-8 lg:border-t-0 lg:border-l lg:pl-12 lg:pt-0">
              {restBody.map((paragraph, i) => (
                <motion.p
                  key={paragraph}
                  {...inView(0.05 + i * 0.05)}
                  className="text-lg leading-relaxed text-body"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>

          <ul className="mt-16 grid grid-cols-1 gap-0 border-t border-rule sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {service.page.outcomes.map((item, i) => {
              const Glyph = outcomeIcons[i % outcomeIcons.length];
              return (
                <motion.li
                  key={item}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.05,
                    ease: easeOut,
                  }}
                  className="flex flex-col border-b border-rule py-8 sm:px-6 sm:py-10 lg:border-b-0 lg:border-r lg:px-7 lg:py-12 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper ring-1 ring-rule">
                    <Glyph size={26} weight="duotone" className="text-ink" />
                  </span>
                  <span className="mt-5 font-mono text-sm font-medium tracking-[0.08em] text-neon-active">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-base font-medium leading-snug tracking-[-0.01em] text-ink sm:text-[17px]">
                    {item}
                  </p>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden bg-paper py-20 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 0%, rgba(231,249,221,0.85) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-[1536px] px-6 sm:px-10">
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1fr_auto]">
            <motion.div {...inView(0)} className="max-w-[640px]">
              <div className="mb-5">
                <StickerPill tone="neon">
                  <Path size={16} weight="duotone" />
                  Process
                </StickerPill>
              </div>
              <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
                How we deliver it
              </h2>
              <p className="mt-5 max-w-[520px] text-lg font-medium leading-snug text-soft">
                Clear stages, visible progress, no mystery retainers.
              </p>
            </motion.div>
            <motion.div
              {...inView(0.08)}
              className="hidden overflow-hidden rounded-[28px] bg-forest p-5 text-white ring-1 ring-forest lg:block lg:w-[280px]"
            >
              <p className="font-mono text-xs tracking-[0.12em] text-neon">
                CADENCE
              </p>
              <p className="mt-3 font-display text-[28px] uppercase leading-none tracking-[-0.01em]">
                Weekly read
              </p>
              <p className="mt-3 text-sm leading-relaxed text-sage">
                You see what shipped and what it earned, every week.
              </p>
            </motion.div>
          </div>

          <ol className="mt-14 grid grid-cols-1 gap-0 border-t border-rule lg:mt-16 lg:grid-cols-3">
            {service.page.howItWorks.map((step, i) => {
              const Glyph = stepIcons[i % stepIcons.length];
              return (
                <motion.li
                  key={step.title}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.07,
                    ease: easeOut,
                  }}
                  className="border-b border-rule py-10 lg:border-b-0 lg:border-r lg:px-8 lg:py-12 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium tracking-[0.08em] text-neon-active">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-rule">
                      <Glyph size={22} weight="duotone" className="text-ink" />
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-[28px] uppercase leading-[0.95] tracking-[-0.01em] text-ink sm:text-[36px] lg:text-[40px]">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[320px] text-base leading-relaxed text-body sm:text-lg">
                    {step.detail}
                  </p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1536px] px-6 sm:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <motion.div {...inView(0)} className="max-w-[520px]">
              <div className="mb-5">
                <StickerPill tone="paper">
                  <CheckCircle size={16} weight="duotone" />
                  Included
                </StickerPill>
              </div>
              <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:leading-[48px]">
                What&apos;s in the work
              </h2>
              <p className="mt-5 text-lg font-medium leading-snug text-soft">
                Scoped deliverables, not a vague retainer.
              </p>

              <div
                className="relative mt-10 overflow-hidden rounded-[28px] bg-forest px-6 py-8 text-white sm:rounded-[32px] sm:px-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full opacity-40 blur-2xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(104,239,63,0.45) 0%, transparent 70%)",
                  }}
                />
                <StickerOrbit className="pointer-events-none absolute -left-8 bottom-2 hidden h-28 w-28 sm:block" />
                <div className="relative">
                  <StickerPill tone="neon" animate={false}>
                    <StickerBurst className="h-3.5 w-3.5" tone="ink" />
                    Plans
                  </StickerPill>
                  <p className="mt-5 font-sans text-[22px] italic leading-snug text-white sm:text-[26px]">
                    {service.page.planNote}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/#pricing" className={btnPrimary}>
                      Compare plans
                    </Link>
                    <Link href="/contact" className={btnGlass}>
                      Ask which fits
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <ul className="border-t border-rule">
              {service.page.includes.map((item, i) => {
                const Glyph = includeIcons[i % includeIcons.length];
                return (
                  <motion.li
                    key={item}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.03,
                      ease: easeOut,
                    }}
                    className="flex items-center gap-4 border-b border-rule py-5 sm:gap-5 sm:py-6"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper ring-1 ring-rule sm:h-12 sm:w-12">
                      <Glyph size={22} weight="duotone" className="text-ink" />
                    </span>
                    <span className="text-base font-medium leading-snug tracking-[-0.01em] text-ink sm:text-lg">
                      {item}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section
        className="bg-paper py-20 lg:py-28"
        aria-labelledby={`${faqId}-heading`}
      >
        <div className="mx-auto max-w-[800px] px-6 sm:px-10">
          <motion.div {...inView(0)}>
            <div className="mb-5">
              <StickerPill tone="mint">Straight answers</StickerPill>
            </div>
            <h2
              id={`${faqId}-heading`}
              className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:leading-[48px]"
            >
              Common questions
            </h2>
          </motion.div>

          <ul className="mt-10 divide-y divide-rule border-y border-rule">
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
                    className="flex w-full items-start justify-between gap-6 py-6 text-left transition-opacity duration-150 active:opacity-80"
                  >
                    <span className="text-lg font-medium tracking-[-0.01em] text-ink sm:text-xl">
                      {item.q}
                    </span>
                    <span
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-150 active:scale-[0.97]"
                      aria-hidden
                    >
                      {isOpen ? (
                        <Minus size={16} weight="bold" />
                      ) : (
                        <Plus size={16} weight="bold" />
                      )}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        key="answer"
                        initial={
                          reduce ? { opacity: 1 } : { opacity: 0, height: 0 }
                        }
                        animate={{ opacity: 1, height: "auto" }}
                        exit={
                          reduce ? { opacity: 0 } : { opacity: 0, height: 0 }
                        }
                        transition={{ duration: 0.22, ease: easeOut }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-base leading-relaxed text-body">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1536px] px-6 sm:px-10">
          <motion.div {...inView(0)} className="max-w-[640px]">
            <div className="mb-5">
              <StickerPill tone="paper">
                <StickerBurst className="h-3.5 w-3.5" tone="ink" />
                Stack
              </StickerPill>
            </div>
            <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
              Keep building the stack
            </h2>
            <p className="mt-5 text-lg font-medium leading-snug text-soft">
              Jump to another capability, or return to the full overview.
            </p>
          </motion.div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {others.map((item, i) => {
              const Glyph = serviceIcons[item.icon];
              return (
                <motion.li
                  key={item.slug}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.04,
                    ease: easeOut,
                  }}
                >
                  <Link
                    href={`/services/${item.slug}`}
                    className="group flex h-full flex-col rounded-[24px] bg-paper p-6 ring-1 ring-rule transition-all duration-200 hover:ring-[color-mix(in_srgb,var(--color-moss)_35%,transparent)] active:scale-[0.98]"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-rule transition-transform duration-200 group-hover:scale-[1.04]">
                      <Glyph size={26} weight="duotone" className="text-ink" />
                    </span>
                    <span className="mt-5 text-xs font-medium uppercase tracking-[0.1em] text-soft">
                      {item.category}
                    </span>
                    <span className="mt-2 font-display text-[24px] uppercase leading-[0.95] tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-moss sm:text-[28px]">
                      {item.shortLabel}
                    </span>
                    <span className="mt-3 flex-1 text-sm leading-relaxed text-body">
                      {item.description}
                    </span>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-moss">
                      Open
                      <ArrowUpRight
                        size={16}
                        weight="bold"
                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
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
        <StickerOrbit className="pointer-events-none absolute left-[8%] top-16 hidden h-36 w-36 lg:block" />
        <StickerOrbit
          className="pointer-events-none absolute bottom-12 right-[10%] hidden h-40 w-40 lg:block"
          tone="sage"
        />
        <motion.div
          initial={
            reduce ? false : { opacity: 0, y: 20, filter: "blur(4px)" }
          }
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.65, ease: easeOut }}
          className="relative mx-auto flex max-w-[800px] flex-col items-center px-6 text-center sm:px-10"
        >
          <StickerPill tone="neon">
            <CalendarCheck size={16} weight="duotone" />
            Next step
          </StickerPill>
          <p className="mt-7 font-display text-[40px] uppercase leading-[0.9] tracking-[-0.02em] text-white sm:text-[56px] lg:text-[68px] lg:leading-[0.88]">
            Ready to put this to <span className="text-neon">work</span>
          </p>
          <p className="mt-5 max-w-[520px] text-lg font-medium leading-snug text-sage">
            Tell us where you want to be in 90 days. We&apos;ll come back with
            an honest read on how we can help.
          </p>
          <Link href="/contact" className={`${btnPrimary} mt-9`}>
            Book a call
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
