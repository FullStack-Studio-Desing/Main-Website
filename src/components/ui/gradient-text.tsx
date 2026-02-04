"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function GradientText({
  children,
  className,
  animate = false,
}: {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}) {
  if (animate) {
    return (
      <motion.span
        className={cn(
          "bg-gradient-to-r from-theme via-theme-accent to-theme bg-[length:200%_auto] bg-clip-text text-transparent",
          className
        )}
        animate={{
          backgroundPosition: ["0% center", "200% center"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span
      className={cn(
        "bg-gradient-to-r from-theme to-theme-accent bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
