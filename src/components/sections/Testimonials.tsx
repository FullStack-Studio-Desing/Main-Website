"use client";

import { motion, useReducedMotion } from "framer-motion";
import { testimonials, testimonialsSection } from "@/data/site-copy";

export function Testimonials() {
  const reduce = useReducedMotion();

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 bg-paper py-24 lg:py-32"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-[1536px] px-6 sm:px-10">
        <div className="mx-auto max-w-[800px] text-center">
          <h2
            id="testimonials-heading"
            className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px] lg:text-[56px] lg:leading-[48px]"
          >
            {testimonialsSection.headline}{" "}
            <span className="text-neon-active">
              {testimonialsSection.headlineEmphasis}
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-[560px] text-lg font-medium leading-6 text-muted">
            {testimonialsSection.intro}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-[1100px] grid-cols-1 gap-12 md:grid-cols-3 lg:mt-20 lg:gap-10">
          {testimonials.map((item, i) => (
            <motion.figure
              key={item.author}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.55,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col"
            >
              <p className="text-sm font-medium uppercase tracking-[0.06em] text-leaf">
                {item.result}
              </p>
              <blockquote className="mt-4 flex-1 text-xl font-medium leading-8 tracking-[-0.01em] text-ink">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 border-t border-rule pt-5">
                <span className="block text-base font-medium text-ink">
                  {item.author}
                </span>
                <span className="mt-0.5 block text-base text-muted">
                  {item.role}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
