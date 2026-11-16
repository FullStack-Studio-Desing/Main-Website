"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { services } from "@/data/site-copy";

export function Services() {
  const reduce = useReducedMotion();

  return (
    <section
      id="services"
      className="scroll-mt-24 bg-forest py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        <h2 className="max-w-[720px] font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-white sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
          One team for the whole{" "}
          <span className="text-neon">growth stack</span>
        </h2>
        <p className="mt-6 max-w-[520px] text-lg font-medium leading-snug text-sage">
          Websites, marketing, sales, automation, and CRM — built and run
          together, not handed between agencies.
        </p>

        <ul className="mt-16 border-t border-white/15 lg:mt-20">
          {services.map((item, i) => (
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
                className="group flex items-baseline justify-between gap-6 py-6 sm:py-8"
              >
                <span className="min-w-0">
                  <span className="block font-display text-[28px] uppercase leading-[0.95] tracking-[-0.01em] text-white transition-colors duration-200 group-hover:text-neon sm:text-[36px] lg:text-[44px]">
                    {item.shortLabel}
                  </span>
                  <span className="mt-2 block max-w-[540px] text-base leading-relaxed text-sage transition-colors duration-200 group-hover:text-fog sm:text-lg">
                    {item.description}
                  </span>
                </span>
                <ArrowUpRight
                  size={28}
                  weight="bold"
                  className="mt-2 shrink-0 text-sage transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neon sm:mt-3"
                />
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
