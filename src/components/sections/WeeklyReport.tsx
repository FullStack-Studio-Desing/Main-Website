"use client";

import { motion, useReducedMotion } from "framer-motion";
import { weeklyReport } from "@/data/site-copy";

export function WeeklyReport() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-forest py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        <h2 className="max-w-[800px] font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
          {weeklyReport.headline}{" "}
          <span className="text-neon">{weeklyReport.headlineEmphasis}</span>
        </h2>
        <p className="mt-6 max-w-[600px] text-lg font-medium leading-snug text-sage">
          {weeklyReport.intro}
        </p>

        <ol className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {weeklyReport.items.map((item, i) => (
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
              className="border-t border-white/15 pt-6"
            >
              <span className="font-display text-xl text-sage">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-2xl font-medium tracking-[-0.0125em] text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-fog">
                {item.detail}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
