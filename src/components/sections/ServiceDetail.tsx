"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Browser,
  ChartLineUp,
  Check,
  Database,
  Minus,
  Plus,
  Robot,
  TrendUp,
  type Icon,
} from "@phosphor-icons/react";
import { services, type Service } from "@/data/site-copy";
import { btnPrimary, btnGlass } from "@/components/buttons";

const icons: Record<string, Icon> = {
  browser: Browser,
  trend: TrendUp,
  chart: ChartLineUp,
  robot: Robot,
  database: Database,
};

export function ServiceDetail({ service }: { service: Service }) {
  const reduce = useReducedMotion();
  const IconGlyph = icons[service.icon];
  const others = services.filter((s) => s.slug !== service.slug);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0.01, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.6,
            delay,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        };

  return (
    <main>
      <section className="relative overflow-hidden bg-forest text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 30% 40%, rgba(62,91,67,0.5) 0%, transparent 55%)",
          }}
        />

        <div className="relative mx-auto max-w-[1100px] px-6 pb-24 pt-36 sm:px-10 lg:pb-32 lg:pt-44">
          <motion.div {...enter(0)}>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-base font-medium text-sage transition-colors duration-200 hover:text-neon"
            >
              <ArrowLeft size={18} weight="bold" />
              All services
            </Link>
          </motion.div>

          <motion.div {...enter(0.06)} className="mt-10 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neon/15 ring-1 ring-neon/30">
              <IconGlyph size={24} weight="duotone" className="text-neon" />
            </span>
            <span className="rounded-action bg-white/10 px-3 py-1 text-sm font-medium text-white/80">
              {service.category}
            </span>
          </motion.div>

          <motion.h1
            {...enter(0.1)}
            className="mt-8 max-w-[900px] font-display text-[40px] uppercase leading-[0.95] tracking-[-0.01em] sm:text-[56px] lg:text-[72px] lg:leading-[0.9]"
          >
            {service.page.headline}{" "}
            <span className="text-neon">{service.page.headlineEmphasis}</span>
          </motion.h1>

          <motion.p
            {...enter(0.16)}
            className="mt-8 max-w-[640px] text-lg font-medium leading-snug tracking-[-0.015em] text-fog sm:text-xl"
          >
            {service.page.intro}
          </motion.p>

          <motion.div {...enter(0.22)} className="mt-10 flex flex-wrap gap-4">
            <Link href="/contact" className={btnPrimary}>
              Book a call
            </Link>
            <Link href="/#pricing" className={btnGlass}>
              See pricing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Deep dive copy */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[720px] px-6 sm:px-10">
          <div className="flex flex-col gap-8">
            {service.page.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-lg leading-relaxed text-body sm:text-xl sm:leading-8"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
          <h2 className="max-w-[700px] font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
            What this changes for you
          </h2>

          <ul className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
            {service.page.outcomes.map((item, i) => (
              <motion.li
                key={item}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex gap-4 border-t border-rule pt-6"
              >
                <span className="font-display text-2xl text-sage">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-lg font-medium leading-snug tracking-[-0.01em] text-ink">
                  {item}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
          <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px]">
            How we deliver it
          </h2>
          <ol className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {service.page.howItWorks.map((step, i) => (
              <li key={step.title} className="border-t border-rule pt-6">
                <span className="font-display text-xl text-sage">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-serif text-2xl italic text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-body">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Includes + plan note */}
      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-16 px-6 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px]">
              What&apos;s included
            </h2>
            <ul className="mt-10 flex flex-col gap-4">
              {service.page.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    size={18}
                    weight="bold"
                    className="mt-1 shrink-0 text-leaf"
                  />
                  <span className="text-base leading-relaxed text-body">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between rounded-shell bg-forest p-8 text-white lg:p-10">
            <p className="font-serif text-2xl italic leading-snug text-white">
              {service.page.planNote}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/#pricing" className={btnPrimary}>
                Compare plans
              </Link>
              <Link href="/contact" className={btnGlass}>
                Ask which fits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service FAQs */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[800px] px-6 sm:px-10">
          <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px]">
            Common questions
          </h2>
          <ul className="mt-12 divide-y divide-rule border-y border-rule">
            {service.page.faqs.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <li key={item.q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-lg font-medium text-ink">{item.q}</span>
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper text-ink">
                      {isOpen ? (
                        <Minus size={16} weight="bold" />
                      ) : (
                        <Plus size={16} weight="bold" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="max-w-[640px] pb-6 text-base leading-relaxed text-body">
                      {item.a}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Other services */}
      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
          <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px]">
            More capabilities
          </h2>
          <p className="mt-4 max-w-[540px] text-lg font-medium text-muted">
            One team across build, grow, and automate — no agency hand-offs.
          </p>

          <ul className="mt-12 divide-y divide-rule border-y border-rule">
            {others.map((item) => {
              const Glyph = icons[item.icon];
              return (
                <li key={item.slug}>
                  <Link
                    href={`/services/${item.slug}`}
                    className="group flex items-center justify-between gap-6 py-6"
                  >
                    <span className="flex items-center gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                        <Glyph size={22} weight="duotone" className="text-ink" />
                      </span>
                      <span>
                        <span className="block text-lg font-medium text-ink group-hover:text-leaf">
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
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-forest py-24 lg:py-32">
        <div className="mx-auto flex max-w-[800px] flex-col items-center px-6 text-center sm:px-10">
          <p className="font-display text-[40px] uppercase leading-[0.95] tracking-[-0.01em] text-white sm:text-[56px] lg:text-[64px]">
            Ready to put this to <span className="text-neon">work</span>
          </p>
          <p className="mt-6 max-w-[520px] text-lg font-medium text-sage">
            Tell us where you want to be in 90 days. We&apos;ll come back with
            an honest read on how we can help.
          </p>
          <Link href="/contact" className={`${btnPrimary} mt-10`}>
            Book a call
          </Link>
        </div>
      </section>
    </main>
  );
}
