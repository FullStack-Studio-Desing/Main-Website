"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useState, useEffect, useMemo } from "react";

// Seeded random number generator for consistent values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const meteorCount = number || 20;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate stable meteor data using seeded random
  const meteors = useMemo(() => {
    return Array.from({ length: meteorCount }, (_, idx) => {
      const position = idx * (800 / meteorCount) - 400;
      // Use seeded random for consistent values between server and client
      const delay = seededRandom(idx * 1.1) * 5;
      const duration = Math.floor(seededRandom(idx * 2.2) * 5 + 5);
      return { position, delay, duration };
    });
  }, [meteorCount]);

  if (!isMounted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {meteors.map((meteor, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[215deg] rounded-[9999px] bg-theme shadow-[0_0_0_1px_#bff74710]",
            "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-theme before:to-transparent before:content-['']",
            className
          )}
          style={{
            top: "-5%",
            left: meteor.position + "px",
            animationDelay: meteor.delay + "s",
            animationDuration: meteor.duration + "s",
          }}
        ></span>
      ))}
    </motion.div>
  );
};
