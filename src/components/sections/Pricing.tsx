"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "@phosphor-icons/react";
import { plans } from "@/data/site-copy";
import { btnPrimary, btnInverse } from "@/components/buttons";

export function Pricing() {
  const reduce = useReducedMotion();

  return (
    <section id="pricing" className="scroll-mt-24 bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1536px] px-6 sm:px-10">
        <h2 className="mx-auto max-w-[800px] text-center font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
          Flat monthly pricing
        </h2>
        <p className="mx-auto mt-6 max-w-[640px] text-center text-lg font-medium leading-6 text-muted">
          No hourly billing, no surprise invoices. Pick the plan that fits
          where your business is now and upgrade when it grows.
        </p>

        <div className="mx-auto mt-16 grid max-w-[1280px] grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan, i) => {
            const dark = plan.highlighted;
            return (
              <motion.div
                key={plan.name}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative flex flex-col rounded-card p-8 lg:p-10 ${
                  dark
                    ? "bg-moss text-white shadow-cinematic-glow lg:-translate-y-2 lg:scale-[1.02]"
                    : "bg-paper text-ink"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-medium leading-8 tracking-[-0.0125em]">
                    {plan.name}
                  </h3>
                  {dark && (
                    <span className="shrink-0 rounded-action bg-neon px-3 py-1 text-sm font-medium text-ink">
                      Most popular
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-[48px] leading-none tracking-[-0.01em]">
                    {plan.price}
                  </span>
                  <span
                    className={`text-base ${dark ? "text-white/60" : "text-muted"}`}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={`mt-4 text-base leading-relaxed ${
                    dark ? "text-white/80" : "text-body"
                  }`}
                >
                  {plan.tagline}
                </p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    dark ? "text-neon" : "text-leaf"
                  }`}
                >
                  Best for: {plan.bestFor}
                </p>

                <ul className="mt-8 flex flex-1 flex-col gap-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        size={18}
                        weight="bold"
                        className={`mt-0.5 shrink-0 ${dark ? "text-neon" : "text-leaf"}`}
                      />
                      <span
                        className={`text-base leading-snug ${
                          dark ? "text-white/90" : "text-body"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/#contact"
                  className={`mt-10 w-full ${dark ? btnPrimary : btnInverse}`}
                >
                  Get started
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
