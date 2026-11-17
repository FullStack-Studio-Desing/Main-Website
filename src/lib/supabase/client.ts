"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export function createBrowserSupabase() {
  const url = getSupabaseUrl();
  const key = getAnonKey();
  if (!url || !key) {
    throw new Error("Supabase is not configured.");
  }
  return createBrowserClient(url, key);
}
