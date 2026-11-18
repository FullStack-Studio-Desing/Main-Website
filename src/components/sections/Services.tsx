"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { services } from "@/data/site-copy";
import { serviceIcons } from "@/components/graphics/serviceIcons";
import { StickerBurst } from "@/components/graphics/BrandStickers";

export function Services() {
  const reduce = useReducedMotion();

  return (
    <section
      id="services"
      className="scroll-mt-24 bg-forest py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1536px] px-6 sm:px-10">
        <div className="relative max-w-[720px]">
          <StickerBurst
            className="absolute -right-2 -top-6 h-9 w-9 sm:-right-8 sm:-top-4"
            tone="neon"
          />
          <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-white sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
            One team for the whole{" "}
            <span className="text-neon">growth stack</span>
          </h2>
        </div>
        <p className="mt-6 max-w-[520px] text-lg font-medium leading-snug text-sage">
          Websites, apps, marketing, sales, AI employees, automation, and CRM,
          built and run together, not handed between agencies.
        </p>

        <ul className="mt-16 border-t border-white/15 lg:mt-20">
          {services.map((item, i) => {
            const Glyph = serviceIcons[item.icon];
            return (
              <motion.li
                key={item.slug}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="border-b border-white/15"
              >
                <Link
                  href={`/services/${item.slug}`}
                  className="group flex items-start justify-between gap-6 py-6 transition-opacity duration-150 active:opacity-90 sm:items-center sm:py-8"
                >
                  <span className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-5">
                    <span className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 transition-all duration-200 group-hover:bg-neon/20 group-hover:ring-[color-mix(in_srgb,var(--color-neon)_40%,transparent)] group-active:scale-[0.97] sm:mt-0 sm:h-14 sm:w-14">
                      {Glyph ? (
                        <Glyph
                          size={26}
                          weight="duotone"
                          className="text-neon"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[28px] uppercase leading-[0.95] tracking-[-0.01em] text-white transition-colors duration-200 group-hover:text-neon sm:text-[36px] lg:text-[44px]">
                        {item.shortLabel}
                      </span>
                      <span className="mt-2 block max-w-[540px] text-base leading-relaxed text-sage transition-colors duration-200 group-hover:text-fog sm:text-lg">
                        {item.description}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={26}
                    weight="bold"
                    className="mt-2 shrink-0 text-sage transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neon sm:mt-0"
                  />
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
