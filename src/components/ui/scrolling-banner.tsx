"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ScrollingBannerProps {
  text: string;
  separator?: string;
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  className?: string;
  textClassName?: string;
  repeat?: number;
}

export function ScrollingBanner({
  text,
  separator = "•",
  direction = "left",
  speed = "normal",
  className,
  textClassName,
  repeat = 8,
}: ScrollingBannerProps) {
  const duration = { fast: 15, normal: 25, slow: 40 }[speed];

  const items = Array(repeat).fill(text);

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden bg-theme py-4",
        className
      )}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration,
            ease: "linear",
          },
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className={cn(
              "flex items-center gap-8 px-8 font-display text-2xl font-bold uppercase tracking-wider text-bg-body md:text-3xl lg:text-4xl",
              textClassName
            )}
          >
            {item}
            <span className="text-bg-body/50">{separator}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// Variant with multiple words separated by dots
export function ScrollingTagline({
  words,
  direction = "left",
  speed = "normal",
  className,
  repeat = 6,
}: {
  words: string[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  className?: string;
  repeat?: number;
}) {
  const duration = { fast: 20, normal: 30, slow: 45 }[speed];

  const items = Array(repeat).fill(words);

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden bg-theme py-3",
        className
      )}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration,
            ease: "linear",
          },
        }}
      >
        {[...items, ...items].map((wordGroup, i) => (
          <div key={i} className="flex items-center">
            {wordGroup.map((word: string, j: number) => (
              <span key={`${i}-${j}`} className="flex items-center">
                <span className="px-4 font-display text-sm font-bold uppercase tracking-wider text-bg-body md:px-5 md:text-base lg:px-6 lg:text-lg">
                  {word}
                </span>
                <span className="text-sm text-bg-body/40 md:text-base lg:text-lg">
                  •
                </span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
