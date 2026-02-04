"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Item = { q: string; a: string };

export function Accordion({
  items,
  className,
}: {
  items: Item[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className={cn(
            "group rounded-2xl border bg-gradient-to-b from-bg-section to-bg-body transition-all duration-300",
            open === i
              ? "border-theme/30 shadow-lg shadow-theme/5"
              : "border-brand-default hover:border-theme/20"
          )}
        >
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left lg:px-8"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className={cn(
              "font-display text-base font-semibold transition-colors duration-300 lg:text-lg",
              open === i ? "text-theme" : "text-text-header group-hover:text-theme"
            )}>
              {item.q}
            </span>
            <span className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
              open === i
                ? "bg-theme text-bg-body rotate-180"
                : "bg-theme/10 text-theme group-hover:bg-theme/20"
            )}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="border-t border-brand-default px-6 py-5 lg:px-8">
                  <p className="text-base leading-relaxed text-text-body">
                    {item.a}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
