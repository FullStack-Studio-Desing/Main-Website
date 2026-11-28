"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { hero } from "@/data/site-copy";
import { btnPrimary, btnGlass } from "@/components/buttons";
import { HeroTypewriter } from "@/components/HeroTypewriter";
import { TechMarquee } from "@/components/graphics/TechMarquee";
import { mediaUrl } from "@/lib/media";

const ease = [0.16, 1, 0.3, 1] as const;

/** All-intra encode (every frame a keyframe) so scrubbing seeks instantly. */
const HERO_VIDEO = mediaUrl("/videos/hero.mp4");

/**
 * The clip is a 24fps head turn. These timestamps are the frames where the
 * character looks left (frame 64), straight ahead (88), and right (112).
 * The cursor's horizontal position maps linearly across that range.
 */
const LOOK_LEFT_TIME = 64 / 24;
const LOOK_FRONT_TIME = 88 / 24;
const LOOK_RIGHT_TIME = 112 / 24;

/**
 * Fade the video's left, right and top edges into the page. The bottom stays
 * crisp so the feet aren't dimmed; the clip's background matches bg-forest.
 */
const HERO_VIDEO_MASK = {
  maskImage:
    "linear-gradient(to right, transparent, #000 18%, #000 82%, transparent), linear-gradient(to bottom, transparent, #000 18%)",
  maskComposite: "intersect",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, #000 18%, #000 82%, transparent), linear-gradient(to bottom, transparent, #000 18%)",
  WebkitMaskComposite: "source-in",
} as const;

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
              className="font-display text-[clamp(60px,21vw,150px)] uppercase leading-[0.84] tracking-[-0.02em] sm:text-[150px] lg:w-max lg:text-[clamp(150px,13.5vw,260px)] lg:leading-[0.82]"
            >
              {hero.headlineStart}
              <br />
              <span className="whitespace-nowrap text-neon">
                {hero.headlineEmphasis}{" "}
                <HeroTypewriter phrases={hero.headlineRotations} />
              </span>
            </motion.h1>

            <motion.p
              {...enter(0.12)}
              className="mt-7 max-w-[640px] text-xl font-medium leading-snug tracking-[-0.01em] text-white/70 sm:text-[22px] xl:w-[760px] xl:max-w-none xl:text-2xl"
            >
              {hero.subheadline}{" "}
              <span className="text-white">{hero.subheadlineEmphasis}</span>
            </motion.p>

            <motion.div
              {...enter(0.18)}
              className="mt-9 flex flex-wrap gap-3 sm:gap-4"
            >
              <Link
                href={hero.primaryHref}
                className={`${btnPrimary} group/btn h-14 w-full px-7 text-[17px] sm:w-auto`}
              >
                {hero.primaryCta}
                <ArrowRight
                  size={20}
                  weight="bold"
                  className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href={hero.secondaryHref}
                className={`${btnGlass} h-14 w-full px-7 text-[17px] ring-1 ring-inset ring-white/15 sm:w-auto`}
              >
                {hero.secondaryCta}
              </Link>
            </motion.div>

            <motion.div {...enter(0.24)} className="mt-14 lg:mt-20">
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
            className="relative z-10 mt-16 w-full max-w-[720px] justify-self-center sm:mt-24 lg:mt-0 lg:justify-self-end"
            aria-hidden
          >
            <div className="pointer-events-none relative aspect-square w-full scale-150 lg:translate-x-[12%]">
              <video
                ref={videoRef}
                src={HERO_VIDEO}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                className="absolute inset-0 h-full w-full select-none object-contain object-center"
                style={HERO_VIDEO_MASK}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
