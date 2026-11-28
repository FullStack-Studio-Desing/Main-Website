"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle } from "@phosphor-icons/react";
import { hero } from "@/data/site-copy";
import { btnPrimary, btnGlass } from "@/components/buttons";
import { HeroTypewriter } from "@/components/HeroTypewriter";
import { TechMarquee } from "@/components/graphics/TechMarquee";

const ease = [0.16, 1, 0.3, 1] as const;

/** All-intra encode (every frame a keyframe) so scrubbing seeks instantly. */
const HERO_VIDEO = "/videos/hero.mp4";

/**
 * The clip is a 24fps head turn. These timestamps are the frames where the
 * character looks left (frame 64), straight ahead (88), and right (112).
 * The cursor's horizontal position maps linearly across that range.
 */
const LOOK_LEFT_TIME = 64 / 24;
const LOOK_FRONT_TIME = 88 / 24;
const LOOK_RIGHT_TIME = 112 / 24;

/** Per-frame easing toward the cursor so the head turn glides, not snaps. */
const FOLLOW_EASE = 0.18;

export function Hero() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Make the character look toward the cursor: left edge looks left, right
  // edge looks right. Touch devices have no hover, so they get a muted
  // autoplay loop instead.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce) return;

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      video.loop = true;
      video.play().catch(() => {});
      return () => video.pause();
    }

    let targetTime = LOOK_FRONT_TIME;
    let currentTime = LOOK_FRONT_TIME;
    let seeking = false;
    let frame = 0;

    const showFront = () => {
      video.currentTime = LOOK_FRONT_TIME;
    };
    if (video.readyState >= 1) showFront();
    else video.addEventListener("loadedmetadata", showFront, { once: true });

    // Only issue the next seek once the previous one lands, so fast mouse
    // movement doesn't flood the decoder with seeks.
    const onSeeked = () => {
      seeking = false;
    };

    const tick = () => {
      frame = 0;
      currentTime += (targetTime - currentTime) * FOLLOW_EASE;
      const settled = Math.abs(targetTime - currentTime) < 0.005;
      if (settled) currentTime = targetTime;
      if (!seeking && Math.abs(video.currentTime - currentTime) >= 0.005) {
        seeking = true;
        video.currentTime = currentTime;
      }
      if (!settled || seeking) frame = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      const ratio = Math.min(1, Math.max(0, e.clientX / window.innerWidth));
      targetTime = LOOK_LEFT_TIME + ratio * (LOOK_RIGHT_TIME - LOOK_LEFT_TIME);
      if (!frame) frame = requestAnimationFrame(tick);
    };

    video.addEventListener("seeked", onSeeked);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener("loadedmetadata", showFront);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("mousemove", onMouseMove);
    };
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
          <div className="relative z-20 max-w-[720px]">
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

          {/* Right — video scrubbed by horizontal cursor movement */}
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
            <div className="pointer-events-none relative aspect-square w-full scale-150">
              <video
                ref={videoRef}
                src={HERO_VIDEO}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                className="absolute inset-0 h-full w-full select-none object-contain object-center [mask-image:radial-gradient(closest-side,#000_80%,transparent_100%)]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
