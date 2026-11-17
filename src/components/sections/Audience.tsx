"use client";

import { motion, useReducedMotion } from "framer-motion";
import { audience } from "@/data/site-copy";

export function Audience() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1536px] px-6 sm:px-10">
        <div className="max-w-[720px]">
          <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
            {audience.headline}{" "}
            <span className="text-neon-active">{audience.headlineEmphasis}</span>
          </h2>
          <p className="mt-6 max-w-[560px] text-lg font-medium leading-snug text-ink">
            {audience.intro}
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-0 border-t border-rule lg:mt-20 lg:grid-cols-3">
          {audience.fits.map((item, i) => (
            <motion.li
              key={item.title}
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
              <span className="inline-flex items-center rounded-full bg-neon px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-forest">
                {item.label}
              </span>

              <h3 className="mt-5 font-display text-[32px] uppercase leading-[0.95] tracking-[-0.01em] text-ink sm:text-[40px] lg:text-[44px]">
                {item.title}
              </h3>

              <p className="mt-4 max-w-[420px] text-base leading-relaxed text-ink sm:text-lg">
                {item.detail}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
