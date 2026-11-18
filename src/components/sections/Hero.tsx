"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle } from "@phosphor-icons/react";
import { hero } from "@/data/site-copy";
import { btnPrimary, btnGlass } from "@/components/buttons";
import { HeroLeadCard } from "@/components/HeroLeadCard";
import { HeroTypewriter } from "@/components/HeroTypewriter";
import { TechMarquee } from "@/components/graphics/TechMarquee";
import { mediaUrl } from "@/lib/media";

const ease = [0.16, 1, 0.3, 1] as const;

/** Desktop/widgets 2–8 (skip #1) — same set as service heroes. */
const HERO_WIDGETS = [2, 3, 4, 5, 6, 7, 8].map((n) =>
  mediaUrl(`/images/services/widgets/${n}.png`),
);

const ROTATE_MS = 3200;

export function Hero() {
  const reduce = useReducedMotion();
  const [widgetIndex, setWidgetIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setWidgetIndex((i) => (i + 1) % HERO_WIDGETS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0.01, y: 22, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.75, delay, ease },
        };

  return (
    <section className="relative min-h-[100dvh] overflow-hidden rounded-b-[32px] bg-forest text-white md:rounded-b-none">
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
          <div className="relative z-10 max-w-[720px]">
            <motion.h1
              {...enter(0)}
              className="font-display text-[48px] uppercase leading-[0.9] tracking-[-0.02em] sm:text-[68px] lg:text-[80px] xl:text-[92px] lg:leading-[0.88]"
            >
              {hero.headlineStart}{" "}
              <HeroTypewriter
                phrases={hero.headlineRotations}
                className="text-neon"
              />
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
                    size={26}
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

          {/* Right — rotating service widgets */}
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0.01, y: 28, scale: 0.98 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  transition: { duration: 0.85, delay: 0.18, ease },
                })}
            className="relative z-10 w-full max-w-[720px] justify-self-center lg:justify-self-end"
            aria-hidden
          >
            <div className="relative aspect-square w-full">
              <AnimatePresence initial={false}>
                <motion.div
                  key={widgetIndex}
                  initial={
                    reduce ? false : { opacity: 0, scale: 0.94 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    reduce
                      ? undefined
                      : { opacity: 0, scale: 1.02 }
                  }
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: 0.7, ease }
                  }
                  className="absolute inset-0"
                >
                  <Image
                    src={HERO_WIDGETS[widgetIndex]}
                    alt=""
                    fill
                    priority={widgetIndex === 0}
                    sizes="(max-width: 1024px) 90vw, 720px"
                    className="object-contain object-center drop-shadow-[0_24px_48px_rgba(0,0,0,0.35)] select-none"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <HeroLeadCard />
    </section>
  );
}
