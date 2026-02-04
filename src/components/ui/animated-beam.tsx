"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const AnimatedBeam = ({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut",
      }}
      className={cn(
        "absolute h-px w-full bg-gradient-to-r from-transparent via-theme to-transparent",
        className
      )}
    />
  );
};

export const GlowEffect = ({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  const sizes = {
    sm: "h-32 w-32",
    md: "h-64 w-64",
    lg: "h-96 w-96",
    xl: "h-[500px] w-[500px]",
  };

  return (
    <div
      className={cn(
        "absolute rounded-full bg-theme/20 blur-[100px]",
        sizes[size],
        className
      )}
    />
  );
};
