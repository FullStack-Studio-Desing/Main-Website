"use client";

import React, { type ReactNode, type ComponentPropsWithoutRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MovingBorderProps = {
  children: ReactNode;
  duration?: number;
  borderRadius?: string;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: React.ElementType;
} & (ComponentPropsWithoutRef<"button"> & { href?: string });

export const MovingBorder = ({
  children,
  duration = 2000,
  borderRadius = "1.75rem",
  className,
  containerClassName,
  borderClassName,
  as: Component = "button",
  ...otherProps
}: MovingBorderProps) => {
  return (
    <Component
      className={cn(
        "relative flex h-16 w-40 content-center items-center justify-center overflow-hidden bg-transparent p-[1px] text-lg font-medium",
        containerClassName
      )}
      style={{
        borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
      >
        <motion.div
          className={cn(
            "absolute h-[200%] w-[200%]",
            borderClassName ?? "bg-[radial-gradient(rgba(255,255,255,0.4)_40%,transparent_60%)] dark:bg-[radial-gradient(rgba(255,255,255,0.15)_40%,transparent_60%)]"
          )}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: duration / 1000,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: "-50%",
            top: "-50%",
          }}
        />
      </div>
      <div
        className={cn(
          "relative z-10 flex h-full w-full items-center justify-center rounded-[calc(1.75rem-1px)] bg-white dark:bg-neutral-900",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} - 1px)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
};
