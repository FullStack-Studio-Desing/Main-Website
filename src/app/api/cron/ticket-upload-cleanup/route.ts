import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { deleteObject, isR2TicketsConfigured } from "@/server/storage/r2";

export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Deletes pending ticket_attachments older than 24h and their R2 objects. */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  // Without a secret the route is open, which is only acceptable outside production.
  if (!secret && process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "CRON_SECRET is not set." }, { status: 401 });
  }
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasServiceRole()) {
    return NextResponse.json({ error: "Service role not configured." }, { status: 503 });
  }

  const cutoff = new Date(Date.now() - DAY_MS).toISOString();
  const db = createAdminClient();
  const rows = await db
    .from("ticket_attachments")
    .select("id, r2_key, status, created_at")
    .eq("status", "pending")
    .lt("created_at", cutoff)
    .limit(200);

  if (rows.error) {
    console.error("[ticket-upload-cleanup]", rows.error.message);
    return NextResponse.json({ error: "Query failed." }, { status: 500 });
  }

  let removed = 0;
  for (const row of rows.data ?? []) {
    if (isR2TicketsConfigured()) {
      try {
        await deleteObject(String(row.r2_key));
      } catch (error) {
        console.warn("[ticket-upload-cleanup] delete failed", row.id, error);
      }
    }
    await db.from("ticket_attachments").delete().eq("id", row.id);
    removed += 1;
  }

  return NextResponse.json({ ok: true, removed });
}