"use client";

import { motion, useReducedMotion } from "framer-motion";
import { weeklyReport } from "@/data/site-copy";
import { StickerBurst } from "@/components/graphics/BrandStickers";

export function WeeklyReport() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-forest py-24 text-white lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 90% 10%, rgba(104,239,63,0.14) 0%, transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-6 sm:px-10">
        <div className="relative max-w-[720px]">
          <StickerBurst
            className="absolute -right-2 -top-5 h-8 w-8 sm:-right-8 sm:-top-3"
            tone="neon"
          />
          <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
            {weeklyReport.headline}{" "}
            <span className="text-neon">{weeklyReport.headlineEmphasis}</span>
          </h2>
          <p className="mt-6 max-w-[540px] text-lg font-medium leading-snug text-sage">
            {weeklyReport.intro}{" "}
            <span className="text-neon">Every Monday.</span>
          </p>
        </div>

        <ul className="mt-16 border-t border-white/15 lg:mt-20">
          {weeklyReport.items.map((item, i) => (
            <motion.li
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-white/15 py-8 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.1fr)] sm:items-baseline sm:gap-x-6 sm:gap-y-0 sm:py-10 lg:gap-x-10"
            >
              <span
                aria-hidden
                className="pt-1 font-mono text-xs font-medium tracking-[0.08em] text-neon sm:pt-0 sm:text-sm"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[28px] uppercase leading-[0.95] tracking-[-0.01em] text-white sm:text-[36px] lg:text-[40px]">
                {item.title}
              </h3>
              <p className="col-start-2 max-w-[440px] text-base leading-relaxed text-fog sm:col-start-auto sm:justify-self-end sm:text-lg">
                {item.detail}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
