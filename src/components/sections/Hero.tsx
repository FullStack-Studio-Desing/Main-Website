"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { brand, hero } from "@/data/site-copy";
import { btnPrimary, btnGlass } from "@/components/buttons";
import { LogoMark } from "@/components/LogoMark";
import {
  StickerBurst,
  StickerPill,
  StickerStack,
} from "@/components/graphics/BrandStickers";

/* Full-height sculptural field: pale olive torus with dark cavity,
   clipped by the right edge. Slow drift is the page's first motion. */
function RingSculpture({ animate }: { animate: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 w-full overflow-hidden lg:w-[58%]"
    >
      {/* Soft neon atmosphere behind the volume */}
      <div
        className="absolute right-[-10%] top-[18%] h-[55%] w-[70%] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(104,239,63,0.28) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="absolute -right-[22%] top-[8%] h-[min(88vh,820px)] w-[min(88vh,820px)] sm:-right-[18%] lg:-right-[12%] lg:top-[4%]"
        initial={false}
        animate={
          animate ? { y: [0, -22, 0], rotate: [0, 3, 0] } : undefined
        }
        transition={
          animate
            ? { duration: 16, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        <div
          className="grain absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 28% 24%, #e8edd8 0%, #c8cfb4 26%, #8f997c 52%, #55634c 76%, #152318 100%)",
            boxShadow:
              "0 70px 140px rgba(0,0,0,0.55), inset -32px -40px 70px rgba(0,0,0,0.4), inset 22px 28px 54px rgba(255,255,255,0.2)",
          }}
        />
        <div
          className="absolute left-[18%] top-[32%] h-[45%] w-[45%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 64% 34%, #040704 0%, #0b140c 50%, #122314 100%)",
            boxShadow:
              "inset 0 20px 56px rgba(0,0,0,0.8), 0 0 0 1px rgba(104,239,63,0.1)",
          }}
        />
        <div
          className="absolute left-[14%] top-[12%] h-[26%] w-[36%] rounded-full opacity-45 blur-md"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, transparent 72%)",
          }}
        />
      </motion.div>

      {/* Secondary smaller volume for depth */}
      <motion.div
        className="absolute bottom-[-8%] right-[8%] hidden h-[280px] w-[280px] xl:block"
        initial={false}
        animate={animate ? { y: [0, 14, 0] } : undefined}
        transition={
          animate
            ? { duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
            : undefined
        }
      >
        <div
          className="grain absolute inset-0 rounded-full opacity-80"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #b7bda5 0%, #3e5b43 55%, #122314 100%)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.45)",
          }}
        />
        <div
          className="absolute left-[28%] top-[28%] h-[40%] w-[40%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 60% 40%, #060b06 0%, #122314 100%)",
          }}
        />
      </motion.div>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0.01, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.7,
            delay,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        };

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-forest text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 18% 45%, rgba(62,91,67,0.55) 0%, transparent 58%), linear-gradient(90deg, #122314 0%, #122314 42%, rgba(18,35,20,0.55) 68%, rgba(18,35,20,0.15) 100%)",
        }}
      />

      <RingSculpture animate={!reduce} />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1536px] items-center px-6 pb-24 pt-32 sm:px-10 lg:pt-28">
        <div className="relative z-10 w-full max-w-[640px] lg:max-w-[600px] xl:max-w-[680px]">
          <motion.div {...enter(0)} className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-neon/15 ring-1 ring-neon/30">
              <LogoMark className="h-7 w-7" tone="neon" />
              <StickerBurst className="absolute -right-3 -top-3 h-7 w-7" tone="neon" />
            </span>
          </motion.div>

          {/* Brand leads — same display voice as the promise, never smaller */}
          <motion.p
            {...enter(0.06)}
            className="mt-8 font-display text-[40px] uppercase leading-[0.92] tracking-[-0.01em] text-white sm:text-[56px] lg:text-[68px] xl:text-[76px]"
          >
            {brand.shortName}
            <span className="text-neon">.</span>
          </motion.p>

          <motion.h1
            {...enter(0.12)}
            className="mt-5 max-w-[560px] text-xl font-medium leading-snug tracking-[-0.015em] text-fog sm:text-2xl lg:text-[28px] lg:leading-8"
          >
            {hero.headlineStart}{" "}
            <span className="text-neon">{hero.headlineEmphasis}</span>
          </motion.h1>

          <motion.p
            {...enter(0.18)}
            className="mt-6 max-w-[460px] text-base font-medium leading-relaxed text-sage sm:text-lg"
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            {...enter(0.24)}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link href="/contact" className={btnPrimary}>
              {hero.primaryCta}
            </Link>
            <Link href="/#pricing" className={btnGlass}>
              {hero.secondaryCta}
            </Link>
          </motion.div>

          <motion.div
            {...enter(0.3)}
            className="mt-12 flex flex-wrap items-center gap-3"
          >
            <StickerPill tone="neon" animate={false}>
              <StickerStack className="h-4 w-4" tone="ink" />
              200+ businesses
            </StickerPill>
            <StickerPill tone="forest" animate={false} className="ring-1 ring-white/15">
              US &amp; Canada
            </StickerPill>
            <StickerPill tone="mint" animate={false}>
              One monthly plan
            </StickerPill>
          </motion.div>

          <motion.p
            {...enter(0.34)}
            className="mt-5 max-w-[420px] text-sm font-medium text-sage sm:text-base"
          >
            {hero.trustLine}
          </motion.p>
        </div>
      </div>

      {/* Mobile: soft sculpture fade so type stays readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-forest to-transparent lg:hidden"
      />
    </section>
  );
}
