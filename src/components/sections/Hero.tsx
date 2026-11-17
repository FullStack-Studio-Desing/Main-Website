"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarCheck,
  CheckCircle,
  Lightning,
} from "@phosphor-icons/react";
import { hero } from "@/data/site-copy";
import { btnPrimary, btnGlass } from "@/components/buttons";
import { HeroLeadCard } from "@/components/HeroLeadCard";
import { StickerPill } from "@/components/graphics/BrandStickers";
import { TechMarquee } from "@/components/graphics/TechMarquee";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0.01, y: 22, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.75, delay, ease },
        };

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-forest text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(62,91,67,0.55) 0%, transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/3 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(104,239,63,0.22) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1536px] flex-col justify-center px-6 pb-20 pt-32 sm:px-10 lg:pb-24 lg:pt-36">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Left — offer */}
          <div className="relative z-10 max-w-[640px]">
            <motion.div
              {...enter(0)}
              className="mb-6 flex flex-wrap items-center gap-3"
            >
              <StickerPill tone="neon">
                <CalendarCheck size={16} weight="duotone" />
                Book a call
              </StickerPill>
              <StickerPill tone="mint">
                <Lightning size={16} weight="duotone" />
                Reply in 1 day
              </StickerPill>
            </motion.div>

            <motion.h1
              {...enter(0.06)}
              className="font-display text-[40px] uppercase leading-[0.92] tracking-[-0.0143em] sm:text-[56px] lg:text-[64px] xl:text-[72px] lg:leading-[0.9]"
            >
              {hero.headlineStart}{" "}
              <span className="text-neon">{hero.headlineEmphasis}</span>
            </motion.h1>

            <motion.p
              {...enter(0.12)}
              className="mt-6 max-w-[520px] text-lg font-medium leading-relaxed text-sage sm:text-xl sm:leading-snug"
            >
              {hero.subheadline}
            </motion.p>

            <motion.ul
              {...enter(0.18)}
              className="mt-8 flex flex-col gap-3"
            >
              {hero.highlights.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-base font-medium leading-snug text-fog sm:text-[17px]"
                >
                  <CheckCircle
                    size={20}
                    weight="fill"
                    className="mt-0.5 shrink-0 text-neon"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              {...enter(0.24)}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link href={hero.primaryHref} className={btnPrimary}>
                {hero.primaryCta}
              </Link>
              <Link href={hero.secondaryHref} className={btnGlass}>
                {hero.secondaryCta}
              </Link>
            </motion.div>

            <motion.div {...enter(0.3)} className="mt-10">
              <TechMarquee />
            </motion.div>
          </div>

          {/* Right — hero graphic */}
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0.01, y: 28, scale: 0.98 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  transition: { duration: 0.85, delay: 0.18, ease },
                })}
            className="relative z-10 w-full max-w-[720px] justify-self-center lg:justify-self-end"
          >
            <Image
              src="/images/hero-heading.png"
              alt="Growth marketing illustration"
              width={1000}
              height={1000}
              priority
              className="h-auto w-full select-none"
            />
          </motion.div>
        </div>
      </div>

      <HeroLeadCard />
    </section>
  );
}
