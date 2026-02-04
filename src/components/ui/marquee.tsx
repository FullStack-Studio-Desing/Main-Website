"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Marquee({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const repeated = Array(8).fill(text);

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden border-y border-brand-default bg-bg-section py-4",
        className
      )}
    >
      <motion.div
        className="flex shrink-0 gap-8"
        animate={{ x: [0, -1920] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {repeated.map((t, i) => (
          <span
            key={i}
            className="font-ui whitespace-nowrap text-sm font-semibold uppercase tracking-wider text-text-muted"
          >
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
