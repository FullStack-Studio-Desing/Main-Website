import "server-only";
import { redirect } from "next/navigation";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { adminEmails, isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { isSchemaError } from "@/lib/portal/errors";
import type { Profile, Role } from "@/lib/portal/types";

export type Session =
  | { kind: "unconfigured" }
  | { kind: "anonymous" }
  | { kind: "schema" }
  | { kind: "no-profile"; email: string }
  | { kind: "needs-promotion"; email: string }
  | { kind: "ready"; email: string; userId: string; profile: Profile };

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  client_id: string | null;
};

function toProfile(row: ProfileRow): Profile {
  const role: Role = row.role === "admin" ? "admin" : "client";
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    role,
    client_id: row.client_id,
  };
}

const profileColumns = "id, email, full_name, role, client_id";

export async function getSession(): Promise<Session> {
  if (!isSupabaseConfigured()) return { kind: "unconfigured" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { kind: "anonymous" };

  const user = data.user;
  const email = (user.email ?? "").toLowerCase();
  const { data: row, error: profileError } = await supabase
    .from("profiles")
    .select(profileColumns)
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    if (isSchemaError(profileError)) return { kind: "schema" };
    console.error("[portal] profile read failed", profileError.message);
    return { kind: "schema" };
  }

  let profile = row ? toProfile(row as ProfileRow) : null;

  if (!profile && hasServiceRole()) {
    const admin = createAdminClient();
    const inserted = await admin
      .from("profiles")
      .insert({
        id: user.id,
        email,
        full_name: "",
        role: "client",
      })
      .select(profileColumns)
      .maybeSingle();

    if (inserted.data) {
      profile = toProfile(inserted.data as ProfileRow);
    } else {
      const again = await admin
        .from("profiles")
        .select(profileColumns)
        .eq("id", user.id)
        .maybeSingle();
      if (again.data) profile = toProfile(again.data as ProfileRow);
    }
  }

  if (!profile) return { kind: "no-profile", email };

  if (adminEmails().includes(email) && profile.role !== "admin") {
    if (!hasServiceRole()) return { kind: "needs-promotion", email };
    const admin = createAdminClient();
    const updated = await admin
      .from("profiles")
      .update({ role: "admin", client_id: null })
      .eq("id", user.id)
      .select(profileColumns)
      .single();
    if (updated.error || !updated.data) {
      console.error("[portal] admin promotion failed", updated.error?.message);
      return { kind: "needs-promotion", email };
    }
    profile = toProfile(updated.data as ProfileRow);
  }

  return { kind: "ready", email, userId: user.id, profile };
}

export async function requireAdmin() {
  const session = await getSession();
  if (session.kind === "anonymous") redirect("/login");
  if (session.kind === "ready" && session.profile.role !== "admin") redirect("/portal");
  return session;
}

export async function requireClient() {
  const session = await getSession();
  if (session.kind === "anonymous") redirect("/login");
  if (session.kind === "ready" && session.profile.role === "admin") redirect("/admin");
  return session;
}
