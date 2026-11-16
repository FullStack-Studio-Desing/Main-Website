"use client";

import { motion, useReducedMotion } from "framer-motion";
import { process } from "@/data/site-copy";

export function Process() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-paper py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(231,249,221,0.7) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-6 sm:px-10">
        <h2 className="max-w-[800px] font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
          How working with us feels
        </h2>
        <p className="mt-6 max-w-[600px] text-lg font-medium leading-snug text-muted">
          No six-month onboarding, no mystery retainers. You see what we are
          doing and what it earns you, every week.
        </p>

        <ol className="mt-16 flex flex-col gap-0 border-t border-rule">
          {process.map((step, i) => (
            <motion.li
              key={step.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid grid-cols-1 gap-6 border-b border-rule py-10 md:grid-cols-[140px_1fr_1fr] md:gap-10"
            >
              <div>
                <span className="font-display text-2xl text-sage">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-leaf">
                  {step.timing}
                </p>
              </div>
              <div>
                <h3 className="font-serif text-3xl italic tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-body">
                  {step.description}
                </p>
              </div>
              <ul className="flex flex-col gap-3">
                {step.details.map((detail) => (
                  <li
                    key={detail}
                    className="border-t border-rule pt-3 text-base text-body first:border-t-0 first:pt-0 md:first:border-t md:first:pt-3"
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
