"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Card = {
  quote: string;
  author: string;
  role: string;
  metric?: string;
  avatar?: string;
};

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: Card[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) {
  const duration = { fast: 20, normal: 40, slow: 60 }[speed];

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <motion.div
        className={cn(
          "flex gap-6",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
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
          <div
            key={`${item.author}-${i}`}
            className="group relative w-[400px] shrink-0 rounded-2xl border border-brand-default bg-gradient-to-b from-bg-section to-bg-body p-8 transition-all duration-300 hover:border-theme/30 hover:shadow-xl hover:shadow-theme/5"
          >
            {/* Decorative Quote Mark */}
            <div className="absolute -top-3 left-6">
              <span className="text-5xl font-serif text-theme/20">&ldquo;</span>
            </div>

            {/* Metric Highlight (if provided) */}
            {item.metric && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-theme/10 px-3 py-1">
                <svg className="h-4 w-4 text-theme" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-bold text-theme">{item.metric}</span>
              </div>
            )}

            {/* Quote */}
            <p className="text-base leading-relaxed text-text-body">
              &ldquo;{item.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="mt-6 flex items-center gap-4 border-t border-brand-default pt-6">
              {/* Avatar Placeholder */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-theme/30 to-theme-accent/30 text-lg font-bold text-theme">
                {item.author.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-display text-base font-bold text-text-header">
                  {item.author}
                </p>
                <p className="text-sm text-text-muted">
                  {item.role}
                </p>
              </div>
            </div>

            {/* 5 Stars */}
            <div className="absolute bottom-8 right-8 flex gap-0.5">
              {[...Array(5)].map((_, idx) => (
                <svg key={idx} className="h-4 w-4 text-theme" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
