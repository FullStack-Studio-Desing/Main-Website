"use client";

import { motion, useReducedMotion } from "framer-motion";
import { audience } from "@/data/site-copy";
import { StickerBurst } from "@/components/graphics/BrandStickers";

export function Audience() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        <div className="relative max-w-[760px]">
          <StickerBurst
            className="absolute -right-1 -top-5 h-8 w-8 sm:-right-6 sm:-top-3"
            tone="neon"
          />
          <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
            {audience.headline}{" "}
            <span className="text-neon-active">{audience.headlineEmphasis}</span>
          </h2>
          <p className="mt-6 max-w-[540px] text-lg font-medium leading-snug text-muted">
            {audience.intro}
          </p>
        </div>

        <ul className="mt-16 border-t border-rule lg:mt-20">
          {audience.fits.map((item, i) => (
            <motion.li
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.55,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid grid-cols-1 gap-3 border-b border-rule py-8 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] sm:items-baseline sm:gap-10 sm:py-10"
            >
              <h3 className="font-display text-[28px] uppercase leading-[0.95] tracking-[-0.01em] text-ink sm:text-[36px] lg:text-[44px]">
                {item.title}
              </h3>
              <p className="max-w-[420px] text-base leading-relaxed text-body sm:text-lg sm:justify-self-end">
                {item.detail}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
