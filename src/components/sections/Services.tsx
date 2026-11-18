"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CaretLeft, CaretRight, Plus } from "@phosphor-icons/react";
import { services } from "@/data/site-copy";
import { StickerBurst } from "@/components/graphics/BrandStickers";
import { mediaUrl } from "@/lib/media";

export function Services() {
  const reduce = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-service-card]");
    const step = card ? card.offsetWidth + 20 : 340;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section
      id="services"
      className="scroll-mt-24 overflow-hidden bg-ink py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1536px] px-6 sm:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div className="relative max-w-[720px]">
            <StickerBurst
              className="absolute -right-2 -top-6 h-9 w-9 sm:-right-8 sm:-top-4"
              tone="neon"
            />
            <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-white sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
              One team for the whole{" "}
              <span className="text-neon">growth stack</span>
            </h2>
            <p className="mt-5 max-w-[520px] text-lg font-medium leading-snug text-sage">
              Websites, apps, marketing, sales, AI employees, automation, and
              CRM, built and run together.
            </p>
          </div>
          <Link
            href="/services"
            className="shrink-0 text-base font-medium text-neon transition-opacity duration-150 hover:opacity-80 active:opacity-70"
          >
            See all services →
          </Link>
        </div>

        {/* Fixed card size; container clips after ~3 so the 4th peeks and forces scroll */}
        <div
          ref={scrollerRef}
          className="mt-14 -mr-6 overflow-x-auto overflow-y-hidden overscroll-x-contain pt-2 pb-3 [scrollbar-width:none] sm:-mr-10 sm:mt-16 lg:mt-20 [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: reduce ? undefined : "x mandatory" }}
          aria-label="Services"
        >
          <div className="flex w-max gap-5 pr-6 sm:pr-10">
            {services.map((item, i) => {
              const videoSrc = mediaUrl(`/videos/services/${i + 1}.mp4`);
              return (
                <motion.div
                  key={item.slug}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: Math.min(i, 4) * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-[min(72vw,264px)] shrink-0 sm:w-[288px] lg:w-[336px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <Link
                    data-service-card
                    href={`/services/${item.slug}`}
                    className="group relative flex aspect-[9/16] w-full flex-col overflow-hidden rounded-[28px] bg-forest transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-form-lift active:scale-[0.99] sm:rounded-[32px]"
                  >
                    <video
                      className="absolute inset-0 h-full w-full object-cover"
                      src={videoSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-hidden
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-forest via-forest/80 to-transparent"
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-forest to-transparent"
                      aria-hidden
                    />

                    <div className="relative z-10 mt-auto flex flex-col gap-4 p-5 sm:p-6">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-sage [text-shadow:0_1px_8px_rgba(11,42,26,0.85)]">
                          {item.category}
                        </p>
                        <h3 className="mt-1.5 font-display text-[22px] uppercase leading-[0.95] tracking-[-0.01em] text-white transition-colors duration-200 [text-shadow:0_2px_16px_rgba(11,42,26,0.9)] group-hover:text-neon sm:text-[26px]">
                          {item.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-[13px] font-medium leading-snug text-white/90 [text-shadow:0_1px_12px_rgba(11,42,26,0.9)] sm:text-[14px]">
                          {item.description}
                        </p>
                      </div>

                      <span className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white shadow-lg ring-1 ring-white/20 transition-colors duration-200 group-hover:bg-neon group-hover:text-ink group-hover:ring-neon">
                        <Plus size={16} weight="bold" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            aria-label="Previous services"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-all duration-150 hover:bg-white/15 active:scale-[0.97] disabled:cursor-default disabled:opacity-35"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <button
            type="button"
            aria-label="Next services"
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-all duration-150 hover:bg-white/15 active:scale-[0.97] disabled:cursor-default disabled:opacity-35"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
      </div>
    </section>
  );
}
