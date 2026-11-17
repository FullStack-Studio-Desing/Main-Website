"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Tone = "neon" | "mint" | "forest" | "paper" | "ink";

const toneClasses: Record<Tone, string> = {
  neon: "bg-neon text-ink",
  mint: "bg-mint text-ink",
  forest: "bg-forest text-white",
  paper: "bg-paper text-ink ring-1 ring-rule",
  ink: "bg-ink text-white",
};

/** Soft capsule sticker — slight tilt, brand colors, conversion cues. */
export function StickerPill({
  children,
  tone = "neon",
  rotate = -3,
  className = "",
  animate = true,
}: {
  children: ReactNode;
  tone?: Tone;
  rotate?: number;
  className?: string;
  animate?: boolean;
}) {
  const reduce = useReducedMotion();
  const shouldAnimate = animate && !reduce;

  return (
    <motion.span
      aria-hidden
      initial={shouldAnimate ? { opacity: 0, scale: 0.88, rotate } : false}
      whileInView={shouldAnimate ? { opacity: 1, scale: 1, rotate } : undefined}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-flex items-center gap-1.5 rounded-proof px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.06em] shadow-[0_8px_24px_rgba(18,35,20,0.12)] sm:text-sm ${toneClasses[tone]} ${className}`}
      style={{ rotate: `${rotate}deg` }}
    >
      {children}
    </motion.span>
  );
}

/** Neon spark burst — decorative, never covers readable type. */
export function StickerBurst({
  className = "h-10 w-10",
  tone = "neon",
}: {
  className?: string;
  tone?: "neon" | "sage" | "white" | "ink";
}) {
  const fill =
    tone === "neon"
      ? "var(--color-neon)"
      : tone === "white"
        ? "#ffffff"
        : tone === "ink"
          ? "var(--color-ink)"
          : "var(--color-sage)";

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M20 2.5 22.8 14.2 34.5 17 22.8 19.8 20 31.5 17.2 19.8 5.5 17 17.2 14.2 20 2.5Z"
        fill={fill}
      />
      <circle cx="31" cy="8" r="2.2" fill={fill} opacity="0.7" />
      <circle cx="8" cy="28" r="1.8" fill={fill} opacity="0.55" />
    </svg>
  );
}

/** Oversized quote mark for testimonial rhythm. */
export function StickerQuote({
  className = "h-12 w-12",
  tone = "mint",
}: {
  className?: string;
  tone?: "mint" | "neon" | "sage";
}) {
  const fill =
    tone === "neon"
      ? "var(--color-neon)"
      : tone === "sage"
        ? "var(--color-sage)"
        : "var(--color-mint)";

  return (
    <svg
      viewBox="0 0 48 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M0 28.5C0 18.2 5.4 9.8 16.2 3.4L20.4 8.6C13.6 12.8 10 17.8 10 24.2c0 2.2.6 3.8 1.8 5H20v10.8H0V28.5Zm28 0C28 18.2 33.4 9.8 44.2 3.4L48.4 8.6C41.6 12.8 38 17.8 38 24.2c0 2.2.6 3.8 1.8 5H48v10.8H28V28.5Z"
        fill={fill}
      />
    </svg>
  );
}

/** Small isometric stack — echoes the logo without competing with it. */
export function StickerStack({
  className = "h-9 w-9",
  tone = "neon",
}: {
  className?: string;
  tone?: "neon" | "ink" | "white" | "sage";
}) {
  const stroke =
    tone === "neon"
      ? "var(--color-neon)"
      : tone === "white"
        ? "#ffffff"
        : tone === "sage"
          ? "var(--color-sage)"
          : "var(--color-ink)";

  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M18 4 29 10.5 18 17 7 10.5 18 4Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7 15.5 18 22 29 15.5"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 21 18 27.5 29 21"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Soft orbit ring for contact / closing atmosphere. */
export function StickerOrbit({
  className = "h-40 w-40",
  tone = "neon",
}: {
  className?: string;
  tone?: "neon" | "sage";
}) {
  const stroke =
    tone === "neon" ? "rgba(104,239,63,0.35)" : "rgba(183,189,165,0.35)";

  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle
        cx="80"
        cy="80"
        r="62"
        stroke={stroke}
        strokeWidth="1.5"
        strokeDasharray="4 10"
      />
      <circle cx="80" cy="18" r="5" fill="var(--color-neon)" />
      <circle cx="132" cy="110" r="3.5" fill="var(--color-mint)" opacity="0.9" />
    </svg>
  );
}

/** Avatar initial disc for social proof without stock photos. */
export function StickerAvatar({
  initials,
  className = "",
}: {
  initials: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-forest font-display text-sm uppercase tracking-wide text-neon ring-2 ring-white ${className}`}
    >
      {initials}
    </span>
  );
}
