"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { useT } from "@/lib/i18n";

type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({
  title,
  subtitle,
  items = [],
}: {
  title: string;
  subtitle?: string;
  items?: BreadcrumbItem[];
}) {
  const bc = useT("breadcrumb");
  return (
    <nav
      className="relative overflow-hidden border-b border-brand-default bg-bg-section pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20"
      aria-label="Breadcrumb"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(191,247,71,0.08),transparent)]" />
      <Spotlight className="-top-20 left-0" fill="rgba(191, 247, 71, 0.06)" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Trail */}
        <motion.ol
          className="flex flex-wrap items-center gap-2 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 text-text-muted transition-colors duration-300 hover:text-theme"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {bc.home}
            </Link>
          </li>
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <svg className="h-4 w-4 text-text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-text-muted transition-colors duration-300 hover:text-theme"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-text-header">
                  {item.label}
                </span>
              )}
            </li>
          ))}
          {items.length > 0 && (
            <li className="flex items-center gap-2">
              <svg className="h-4 w-4 text-text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-theme">
                {title}
              </span>
            </li>
          )}
          {items.length === 0 && (
            <li className="flex items-center gap-2">
              <svg className="h-4 w-4 text-text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-theme">
                {title}
              </span>
            </li>
          )}
        </motion.ol>

        {/* Page Title */}
        <motion.h1
          className="mt-6 font-display text-3xl font-bold text-text-header sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {title}
        </motion.h1>

        {/* Optional Subtitle */}
        {subtitle && (
          <motion.p
            className="mt-4 max-w-2xl text-lg text-text-body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </nav>
  );
}
