"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid auto-rows-[minmax(280px,auto)] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  children,
  className,
  title,
  description,
  subtitle,
  icon,
  metric,
  href,
  featured,
}: {
  children?: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  subtitle?: string;
  icon?: ReactNode;
  metric?: string;
  href?: string;
  featured?: boolean;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlight = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(191, 247, 71, 0.1), transparent 80%)`;

  return (
    <motion.div
      onMouseMove={onMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-brand-default bg-gradient-to-b from-bg-section to-bg-body",
        "transition-all duration-500 hover:border-theme/40 hover:shadow-2xl hover:shadow-theme/10",
        featured && "md:col-span-2 md:row-span-2",
        className
      )}
    >
      {/* Spotlight effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          {subtitle && (
            <span className="inline-flex items-center rounded-full border border-theme/20 bg-theme/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-theme">
              {subtitle}
            </span>
          )}
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme/10 text-theme">
              {icon}
            </div>
          )}
        </div>

        {/* Metric Badge */}
        {metric && (
          <div className="mt-4 flex items-center gap-2">
            <svg className="h-4 w-4 text-theme-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-bold text-theme-accent">{metric}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="mt-auto pt-6">
          {title && (
            <h3 className="font-display text-xl font-bold text-text-header transition-colors duration-300 group-hover:text-theme lg:text-2xl">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {description}
            </p>
          )}
        </div>

        {children}
      </div>

      {/* Decorative Corner Gradient */}
      <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-theme/5 blur-3xl transition-all duration-500 group-hover:bg-theme/10" />
    </motion.div>
  );
}
