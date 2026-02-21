"use client";

import { useLocale } from "./locale-context";
import { t } from "./translations";
import type translations from "./translations";

/**
 * Hook that returns the translated strings for a given section.
 * Usage: const hero = useT("hero");
 */
export function useT<K extends keyof typeof translations>(section: K) {
  const { locale } = useLocale();
  return t(section, locale);
}
