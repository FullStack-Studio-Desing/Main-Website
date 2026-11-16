"use client";

import { motion, useReducedMotion } from "framer-motion";
import { proofCapsules } from "@/data/site-copy";

export function Proof() {
  const reduce = useReducedMotion();

  return (
    <section
      className="bg-white py-24 lg:py-32"
      aria-label="Results at a glance"
    >
      <div className="mx-auto max-w-[1536px] px-6 sm:px-10">
        <div className="flex flex-col items-center gap-3">
          {proofCapsules.map((capsule, i) => (
            <motion.div
              key={capsule.text}
              initial={reduce ? false : { opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.55,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`flex items-center justify-center rounded-proof px-6 py-4 sm:px-10 lg:h-[104px] lg:px-12 ${
                capsule.fill === "neon" ? "bg-neon" : "bg-mint"
              } ${i === 1 ? "lg:-rotate-1" : i === 2 ? "lg:rotate-1" : ""}`}
            >
              <span className="font-display text-[32px] uppercase leading-[0.9] tracking-[-0.01em] text-ink sm:text-[48px] lg:text-[72px]">
                {capsule.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
