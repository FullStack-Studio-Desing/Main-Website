"use client";

import { motion, useReducedMotion } from "framer-motion";
import { process } from "@/data/site-copy";

export function Process() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        <div className="max-w-[720px]">
          <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
            How working with us feels
          </h2>
          <p className="mt-6 max-w-[560px] text-lg font-medium leading-snug text-muted">
            No six-month onboarding, no mystery retainers. You see what we are
            doing and what it earns you, every week.
          </p>
        </div>

        <ol className="relative mt-16 lg:mt-20">
          <div
            aria-hidden
            className="absolute bottom-2 left-[15px] top-2 w-px bg-rule sm:left-[19px]"
          />

          {process.map((step, i) => {
            const isLast = i === process.length - 1;

            return (
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
                className={`relative grid grid-cols-[32px_minmax(0,1fr)] gap-x-5 sm:grid-cols-[40px_minmax(0,1fr)] sm:gap-x-8 ${
                  isLast ? "pb-0" : "pb-14 sm:pb-16"
                }`}
              >
                <div className="relative z-10 flex justify-center pt-1">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-medium tracking-[0.06em] sm:h-10 sm:w-10 sm:text-xs ${
                      i === 1
                        ? "bg-neon text-ink"
                        : "bg-forest text-neon"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <span className="inline-flex rounded-proof bg-mint px-3.5 py-1 text-xs font-medium uppercase tracking-[0.12em] text-leaf">
                    {step.timing}
                  </span>

                  <h3 className="mt-4 font-display text-[36px] uppercase leading-[0.95] tracking-[-0.01em] text-ink sm:text-[44px] lg:text-[48px]">
                    {step.title}
                  </h3>

                  <p className="mt-4 max-w-[520px] text-base leading-relaxed text-body sm:text-lg">
                    {step.description}
                  </p>

                  <ul className="mt-6 max-w-[520px] border-t border-rule">
                    {step.details.map((detail) => (
                      <li
                        key={detail}
                        className="border-b border-rule py-3 text-base text-body last:border-b-0 sm:text-[17px]"
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
