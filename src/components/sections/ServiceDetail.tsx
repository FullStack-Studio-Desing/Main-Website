"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
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

        <StickerOrbit className="pointer-events-none absolute -left-6 top-36 hidden h-36 w-36 lg:block" />
        <StickerBurst
          className="pointer-events-none absolute right-[12%] top-40 hidden h-10 w-10 sm:block"
          tone="neon"
        />

        <div className="relative mx-auto flex max-w-[900px] flex-col items-center px-6 pb-20 pt-36 text-center sm:px-10 lg:pb-28 lg:pt-44">
          <motion.div {...enter(0)}>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-base font-medium text-sage transition-colors duration-150 hover:text-neon active:scale-[0.97]"
            >
              <ArrowLeft size={18} weight="bold" />
              All services
            </Link>
          </motion.div>

          <motion.div
            {...enter(0.05)}
            className="relative mt-9 flex h-24 w-24 items-center justify-center sm:mt-10 sm:h-28 sm:w-28"
          >
            <div
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 32% 28%, #c8cfb4 0%, #8f997c 28%, #3e5b43 58%, #122314 100%)",
                boxShadow:
                  "0 28px 56px rgba(0,0,0,0.32), inset -14px -18px 32px rgba(0,0,0,0.28)",
              }}
            />
            <IconGlyph
              size={48}
              weight="duotone"
              className="relative text-neon"
            />
          </motion.div>

          <motion.div {...enter(0.1)} className="mt-7">
            <StickerPill tone="neon">
              <IconGlyph size={16} weight="duotone" />
              {service.category}
            </StickerPill>
          </motion.div>

          <motion.h1
            {...enter(0.14)}
            className="mt-7 max-w-[860px] font-display text-[40px] uppercase leading-[0.9] tracking-[-0.02em] sm:text-[56px] lg:text-[72px] lg:leading-[0.88]"
          >
            {service.page.headline}{" "}
            <span className="text-neon">{service.page.headlineEmphasis}</span>
          </motion.h1>

          <motion.p
            {...enter(0.2)}
            className="mt-6 max-w-[540px] text-lg font-medium leading-snug tracking-[-0.015em] text-fog sm:text-xl"
          >
            {service.page.intro}
          </motion.p>

          <motion.div
            {...enter(0.26)}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
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

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
          <motion.div {...inView(0)} className="mx-auto max-w-[720px] text-center">
            <div className="mb-5 flex justify-center">
              <StickerPill tone="paper">
                <StickerStack className="h-4 w-4" tone="ink" />
                The shift
              </StickerPill>
            </div>
            <p className="font-sans text-[24px] italic leading-snug tracking-tight text-ink sm:text-[30px] sm:leading-[1.3]">
              {lead}
            </p>
          </motion.div>

          <ul className="mt-14 grid grid-cols-1 gap-0 border-t border-rule sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="relative mx-auto max-w-[1100px] px-6 sm:px-10">
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
            <p className="mt-5 max-w-[520px] text-lg font-medium leading-snug text-muted">
              Clear stages, visible progress, no mystery retainers.
            </p>
          </motion.div>

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
        <div className="mx-auto max-w-[1000px] px-6 sm:px-10">
          <motion.div {...inView(0)} className="max-w-[640px]">
            <div className="mb-5">
              <StickerPill tone="paper">
                <CheckCircle size={16} weight="duotone" />
                Included
              </StickerPill>
            </div>
            <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:leading-[48px]">
              What&apos;s in the work
            </h2>
          </motion.div>

          <ul className="mt-12 grid grid-cols-1 gap-0 border-t border-rule sm:grid-cols-2">
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
                  className="flex items-center gap-4 border-b border-rule py-5 sm:gap-5 sm:px-6 sm:py-6 lg:px-7"
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

          <motion.div
            {...inView(0.08)}
            className="relative mt-14 overflow-hidden rounded-[28px] bg-forest px-7 py-11 text-center text-white sm:mt-16 sm:rounded-[32px] sm:px-12 lg:py-14"
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
              <p className="mt-6 font-sans text-[24px] italic leading-snug text-white sm:text-[28px]">
                {service.page.planNote}
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
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
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
          <motion.div {...inView(0)} className="max-w-[640px]">
            <div className="mb-5">
              <StickerPill tone="paper">
                <StickerBurst className="h-3.5 w-3.5" tone="ink" />
                Stack
              </StickerPill>
            </div>
            <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
              More capabilities
            </h2>
            <p className="mt-5 text-lg font-medium leading-snug text-muted">
              One team across build, grow, and automate.
            </p>
          </motion.div>

          <ul className="mt-12 border-t border-rule">
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
                  className="border-b border-rule"
                >
                  <Link
                    href={`/services/${item.slug}`}
                    className="group flex items-start justify-between gap-5 py-6 sm:items-center sm:py-7"
                  >
                    <span className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-5">
                      <span className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper ring-1 ring-rule transition-transform duration-200 group-hover:scale-[1.04] group-active:scale-[0.97] sm:mt-0 sm:h-14 sm:w-14">
                        <Glyph
                          size={26}
                          weight="duotone"
                          className="text-ink"
                        />
                      </span>
                      <span className="min-w-0 text-left">
                        <span className="block text-xs font-medium uppercase tracking-[0.1em] text-muted sm:text-sm">
                          {item.category}
                        </span>
                        <span className="mt-1 block font-display text-[24px] uppercase leading-[0.95] tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-moss sm:text-[32px]">
                          {item.shortLabel}
                        </span>
                        <span className="mt-1.5 block max-w-[520px] text-base leading-relaxed text-body">
                          {item.description}
                        </span>
                      </span>
                    </span>
                    <ArrowUpRight
                      size={24}
                      weight="bold"
                      className="mt-2 shrink-0 text-sage transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-leaf sm:mt-0"
                    />
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
