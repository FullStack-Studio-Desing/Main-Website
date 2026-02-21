"use client";

import { useLocale } from "@/lib/locale-context";
import { useT } from "@/lib/i18n";
import { motion } from "framer-motion";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, toggleLocale } = useLocale();
  const lt = useT("langToggle");

  return (
    <motion.button
      type="button"
      onClick={toggleLocale}
      title={lt.tooltip}
      whileTap={{ scale: 0.9 }}
      className={`flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-text-body transition-all duration-200 hover:border-theme/30 hover:bg-theme/10 hover:text-theme ${className}`}
    >
      <span className="text-[10px] leading-none">🌐</span>
      <span>{lt.label}</span>
    </motion.button>
  );
}
