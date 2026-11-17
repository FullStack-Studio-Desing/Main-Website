"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { isSchemaError } from "@/lib/portal/errors";
import { todayISO } from "@/lib/portal/format";
import { requireAdmin, getSession } from "@/lib/portal/session";
import type { ActionState } from "@/lib/portal/types";
import {
  isUuid,
  parseClient,
  parseLogin,
  parsePayment,
  parsePaymentStatus,
  parseReport,
} from "@/lib/portal/validators";

function gateError(session: Awaited<ReturnType<typeof requireAdmin>>): ActionState {
  if (session.kind === "unconfigured") return { error: "Supabase is not connected yet." };
  if (session.kind === "schema") return { error: "Run the portal SQL migration, then try again." };
  if (session.kind === "needs-promotion") {
    return {
      error: "This account is not an admin yet. Add the service role key, or promote the profile in the SQL editor.",
    };
  }
  if (session.kind === "no-profile") {
    return { error: "This login has no profile yet. Run the portal SQL migration." };
  }
  return { error: "The portal is not ready yet." };
}

async function adminContext(): Promise<{ userId: string } | { error: string }> {
  if (!isSupabaseConfigured()) return { error: "Supabase is not connected yet." };
  const session = await requireAdmin();
  if (session.kind !== "ready") {
    const state = gateError(session);
    return { error: state?.error ?? "The portal is not ready yet." };
  }
  return { userId: session.userId };
}

function logFailure(scope: string, message: string | undefined) {
  console.error(`[portal] ${scope}`, message ?? "unknown");
}

function safeDbError(error: { code?: string; message?: string } | null, fallback: string): ActionState {
  if (!error) return { error: fallback };
  logFailure(fallback, error.message);
  if (isSchemaError(error)) return { error: "Run the portal SQL migration, then try again." };
  if (error.code === "23505") return { error: "That record conflicts with one that already exists." };
  return { error: fallback };
}

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: "Supabase is not connected yet." };
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (/confirm/i.test(error.message)) {
      return {
        error: "This email is not confirmed yet. In Supabase, confirm the user or create it with auto-confirm on.",
      };
    }
    return { error: "That email and password do not match." };
  }

  const session = await getSession();
  if (session.kind === "ready" && session.profile.role === "admin") redirect("/admin");
  if (session.kind === "ready") redirect("/portal");
  if (
    session.kind === "schema" ||
    session.kind === "no-profile" ||
    session.kind === "needs-promotion"
  ) {
    redirect("/admin");
  }
  redirect("/portal");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}

export async function createClientAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const gate = await adminContext();
  if ("error" in gate) return gate;
  const parsed = parseClient(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const { data, error } = await supabase.from("clients").insert(parsed.value).select("id").single();
  if (error || !data) return safeDbError(error, "The client could not be saved.");
  revalidatePath("/admin");
  redirect(`/admin/clients/${data.id}`);
}

export async function updateClientAction(
  clientId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const gate = await adminContext();
  if ("error" in gate) return gate;
  if (!isUuid(clientId)) return { error: "That client could not be found." };
  const parsed = parseClient(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const { error } = await supabase.from("clients").update(parsed.value).eq("id", clientId);
  if (error) return safeDbError(error, "The client could not be saved.");
  revalidatePath("/admin");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/portal");
  redirect(`/admin/clients/${clientId}`);
}

export async function deleteClient(clientId: string) {
  const gate = await adminContext();
  if ("error" in gate || !isUuid(clientId)) redirect("/admin");
  const supabase = await createClient();
  const { error } = await supabase.from("clients").delete().eq("id", clientId);
  if (error) logFailure("delete client", error.message);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function createPayment(
  clientId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const gate = await adminContext();
  if ("error" in gate) return gate;
  if (!isUuid(clientId)) return { error: "That client could not be found." };
  const parsed = parsePayment(formData);
  if ("error" in parsed) return parsed;

  const paidOn =
    parsed.value.status === "paid" && !parsed.value.paid_on ? todayISO() : parsed.value.paid_on;

  const supabase = await createClient();
  const { error } = await supabase.from("payments").insert({
    ...parsed.value,
    paid_on: paidOn,
    client_id: clientId,
  });
  if (error) return safeDbError(error, "The payment could not be saved.");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin");
  revalidatePath("/portal");
  redirect(`/admin/clients/${clientId}#payments`);
}

export async function updatePaymentStatus(clientId: string, formData: FormData) {
  const gate = await adminContext();
  if ("error" in gate || !isUuid(clientId)) return;
  const id = String(formData.get("id") ?? "");
  const status = parsePaymentStatus(String(formData.get("status") ?? ""));
  if (!isUuid(id) || !status) return;

  const supabase = await createClient();
  const patch: { status: typeof status; paid_on?: string } = { status };
  if (status === "paid") {
    const existing = await supabase
      .from("payments")
      .select("paid_on")
      .eq("id", id)
      .eq("client_id", clientId)
      .maybeSingle();
    if (existing.data && !existing.data.paid_on) patch.paid_on = todayISO();
  }

  const { error } = await supabase
    .from("payments")
    .update(patch)
    .eq("id", id)
    .eq("client_id", clientId);
  if (error) logFailure("payment status", error.message);
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/portal");
}

export async function deletePayment(clientId: string, paymentId: string) {
  const gate = await adminContext();
  if ("error" in gate || !isUuid(clientId) || !isUuid(paymentId)) return;
  const supabase = await createClient();
  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", paymentId)
    .eq("client_id", clientId);
  if (error) logFailure("delete payment", error.message);
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin");
  revalidatePath("/portal");
}

export async function createReport(
  clientId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const gate = await adminContext();
  if ("error" in gate) return gate;
  if (!isUuid(clientId)) return { error: "That client could not be found." };
  const parsed = parseReport(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const { error } = await supabase.from("reports").insert({
    ...parsed.value,
    client_id: clientId,
    created_by: gate.userId,
    published_at: parsed.value.status === "published" ? new Date().toISOString() : null,
  });
  if (error) return safeDbError(error, "The report could not be saved.");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/portal");
  redirect(`/admin/clients/${clientId}#reports`);
}

export async function updateReport(
  reportId: string,
  clientId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const gate = await adminContext();
  if ("error" in gate) return gate;
  if (!isUuid(reportId) || !isUuid(clientId)) return { error: "That report could not be found." };
  const parsed = parseReport(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const existing = await supabase
    .from("reports")
    .select("published_at")
    .eq("id", reportId)
    .eq("client_id", clientId)
    .maybeSingle();
  if (existing.error) return safeDbError(existing.error, "The report could not be saved.");
  if (!existing.data) return { error: "That report could not be found." };

  const publishedAt =
    parsed.value.status === "published"
      ? (existing.data.published_at ?? new Date().toISOString())
      : null;

  const { error } = await supabase
    .from("reports")
    .update({ ...parsed.value, published_at: publishedAt })
    .eq("id", reportId)
    .eq("client_id", clientId);
  if (error) return safeDbError(error, "The report could not be saved.");
  revalidatePath(`/admin/reports/${reportId}`);
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/portal");
  revalidatePath(`/portal/reports/${reportId}`);
  return { notice: parsed.value.status === "published" ? "Report published." : "Draft saved." };
}

export async function deleteReport(reportId: string, clientId: string) {
  const gate = await adminContext();
  if ("error" in gate || !isUuid(reportId) || !isUuid(clientId)) redirect("/admin");
  const supabase = await createClient();
  const { error } = await supabase.from("reports").delete().eq("id", reportId).eq("client_id", clientId);
  if (error) logFailure("delete report", error.message);
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/portal");
  redirect(`/admin/clients/${clientId}#reports`);
}

function temporaryPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = randomBytes(14);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export async function savePortalLogin(
  clientId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const gate = await adminContext();
  if ("error" in gate) return gate;
  if (!isUuid(clientId)) return { error: "That client could not be found." };
  if (!hasServiceRole()) {
    return { error: "Add SUPABASE_SERVICE_ROLE_KEY before creating a client login." };
  }

  const parsed = parseLogin(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const clientRes = await supabase
    .from("clients")
    .select("contact_name")
    .eq("id", clientId)
    .maybeSingle();
  if (clientRes.error) return safeDbError(clientRes.error, "The login could not be saved.");
  if (!clientRes.data) return { error: "That client could not be found." };

  const admin = createAdminClient();
  const { data: existing, error: existingError } = await admin
    .from("profiles")
    .select("id, role, client_id, email")
    .eq("email", parsed.value.email)
    .maybeSingle();
  if (existingError) return safeDbError(existingError, "The login could not be checked.");
  if (existing?.role === "admin") {
    return { error: "That email belongs to a studio admin. Use a different email for the client." };
  }
  if (existing?.client_id && existing.client_id !== clientId) {
    return { error: "That email is already linked to another client." };
  }

  const { data: linked, error: linkedError } = await admin
    .from("profiles")
    .select("id, email")
    .eq("client_id", clientId)
    .eq("role", "client")
    .maybeSingle();
  if (linkedError) return safeDbError(linkedError, "The login could not be checked.");
  if (linked && linked.email.toLowerCase() !== parsed.value.email) {
    return { error: `This client already signs in as ${linked.email}.` };
  }

  const generated = !parsed.value.password;
  const password = parsed.value.password ?? temporaryPassword();
  let userId = existing?.id ?? linked?.id ?? null;

  if (!userId) {
    const created = await admin.auth.admin.createUser({
      email: parsed.value.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: clientRes.data.contact_name },
    });
    if (created.error || !created.data.user) {
      logFailure("create login", created.error?.message);
      const message = created.error?.message ?? "";
      if (/already/i.test(message)) {
        return { error: "A login already exists for that email." };
      }
      return { error: "The login could not be created." };
    }
    userId = created.data.user.id;
  } else {
    const updatedUser = await admin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });
    if (updatedUser.error) {
      logFailure("update login", updatedUser.error.message);
      return { error: "The password could not be updated." };
    }
  }

  const profile = {
    id: userId,
    email: parsed.value.email,
    full_name: clientRes.data.contact_name as string,
    role: "client",
    client_id: clientId,
  };
  const saved = await admin.from("profiles").upsert(profile, { onConflict: "id" });
  if (saved.error) return safeDbError(saved.error, "The login was created, but it could not be linked.");

  revalidatePath(`/admin/clients/${clientId}`);
  return generated
    ? {
        notice: "Login saved. Copy this temporary password now. It is not shown again.",
        password,
      }
    : { notice: "Login saved. The password you entered is active." };
}
