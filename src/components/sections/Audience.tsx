"use client";

import { motion, useReducedMotion } from "framer-motion";
import { audience } from "@/data/site-copy";

export function Audience() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        <h2 className="max-w-[800px] font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
          {audience.headline}{" "}
          <span className="text-neon-active">{audience.headlineEmphasis}</span>
        </h2>
        <p className="mt-6 max-w-[600px] text-lg font-medium leading-snug text-muted">
          {audience.intro}
        </p>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <ul className="flex flex-col gap-10">
            {audience.fits.map((item, i) => (
              <motion.li
                key={item.title}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="border-t border-rule pt-6"
              >
                <h3 className="text-2xl font-medium tracking-[-0.0125em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[480px] text-base leading-relaxed text-body">
                  {item.detail}
                </p>
              </motion.li>
            ))}
          </ul>

          <div className="rounded-shell bg-paper p-8 lg:p-10">
            <p className="font-sans text-2xl italic text-ink">Not a fit if</p>
            <ul className="mt-6 flex flex-col gap-4">
              {audience.notFits.map((item) => (
                <li
                  key={item}
                  className="border-t border-rule pt-4 text-base leading-relaxed text-body"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
