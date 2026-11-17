"use client";

import { useReducedMotion } from "framer-motion";
import { testimonials, testimonialsSection } from "@/data/site-copy";
import {
  StickerAvatar,
  StickerQuote,
} from "@/components/graphics/BrandStickers";

function authorInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

function TestimonialCard({
  item,
  tone,
}: {
  item: (typeof testimonials)[number];
  tone: "mint" | "neon";
}) {
  return (
    <figure className="flex w-[min(85vw,360px)] shrink-0 flex-col rounded-shell bg-white p-7 shadow-culture-card sm:w-[380px] sm:p-8">
      <StickerQuote className="h-9 w-11" tone={tone} />
      <blockquote className="mt-5 flex-1 text-xl font-medium leading-8 tracking-[-0.01em] text-ink">
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-3 border-t border-rule pt-5">
        <StickerAvatar initials={authorInitials(item.author)} />
        <span>
          <span className="block text-base font-medium text-ink">
            {item.author}
          </span>
          <span className="mt-0.5 block text-base text-ink/80">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const reduce = useReducedMotion();
  const row = [...testimonials, ...testimonials];

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
          <p className="mx-auto mt-6 max-w-[560px] text-lg font-medium leading-6 text-ink">
            {testimonialsSection.intro}
          </p>
        </div>

        <div
          className="relative mt-16 overflow-hidden lg:mt-20"
          aria-label="Client testimonials"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-paper to-transparent sm:w-12"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-paper to-transparent sm:w-12"
          />
          <div
            className={`flex w-max gap-6 sm:gap-8 ${reduce ? "" : "animate-marquee"}`}
            style={reduce ? undefined : { animationDuration: "55s" }}
          >
            {row.map((item, i) => (
              <TestimonialCard
                key={`${item.author}-${i}`}
                item={item}
                tone={i % 2 === 1 ? "neon" : "mint"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
