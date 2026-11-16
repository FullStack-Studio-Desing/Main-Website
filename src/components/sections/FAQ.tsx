"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "@phosphor-icons/react";
import { faq } from "@/data/site-copy";

export function FAQ() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-[900px] px-6 sm:px-10">
        <h2 className="text-center font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
          Questions we hear{" "}
          <span className="text-neon-active">before the call</span>
        </h2>

        <ul className="mt-16 divide-y divide-rule border-y border-rule">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.li
                key={item.q}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                >
                  <span className="text-lg font-medium tracking-[-0.01em] text-ink sm:text-xl">
                    {item.q}
                  </span>
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink">
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
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
