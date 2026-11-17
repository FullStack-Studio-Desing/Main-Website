import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getServiceKey, getSupabaseUrl } from "@/lib/supabase/env";

export function hasServiceRole() {
  return Boolean(getSupabaseUrl() && getServiceKey());
}

export function createAdminClient() {
  const url = getSupabaseUrl();
  const key = getServiceKey();
  if (!url || !key) {
    throw new Error("Supabase service role is not configured.");
  }
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
