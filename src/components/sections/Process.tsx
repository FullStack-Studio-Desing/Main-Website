"use client";

import { motion, useReducedMotion } from "framer-motion";
import { process } from "@/data/site-copy";

export function Process() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-[1536px] px-6 sm:px-10">
        <div className="max-w-[720px]">
          <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
            How working with us feels
          </h2>
          <p className="mt-6 max-w-[560px] text-lg font-medium leading-snug text-ink">
            No six-month onboarding, no mystery retainers. You see what we are
            doing and what it earns you, every week.
          </p>
        </div>

        <ol className="mt-16 grid grid-cols-1 gap-0 border-t border-rule lg:mt-20 lg:grid-cols-3">
          {process.map((step, i) => (
            <motion.li
              key={step.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="border-b border-rule py-10 lg:border-b-0 lg:border-r lg:px-8 lg:py-12 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-medium tracking-[0.08em] text-neon-active">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="inline-flex items-center rounded-full bg-neon px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-forest">
                  {step.timing}
                </span>
              </div>

              <h3 className="mt-5 font-display text-[36px] uppercase leading-[0.95] tracking-[-0.01em] text-ink sm:text-[44px] lg:text-[48px]">
                {step.title}
              </h3>

              <p className="mt-4 max-w-[420px] text-base leading-relaxed text-ink sm:text-lg">
                {step.description}
              </p>

              <ul className="mt-8 space-y-3">
                {step.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex gap-3 text-base leading-snug text-ink sm:text-[17px]"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-neon-active"
                    />
                    <span>{detail}</span>
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
