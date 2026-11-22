/**
 * Smoke test: tickets schema + create row (service role). R2 upload skipped when keys missing.
 */
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env missing");

  const db = createClient(url, key, { auth: { persistSession: false } });

  for (const table of ["tickets", "ticket_messages", "ticket_attachments"]) {
    const probe = await db.from(table).select("id").limit(1);
    if (probe.error) throw new Error(`${table}: ${probe.error.message}`);
    console.log(`OK ${table}`);
  }

  const client = await db.from("clients").select("id, company_name").limit(1).maybeSingle();
  if (client.error || !client.data) throw new Error("No client row to test with");

  const title = `Smoke test ${new Date().toISOString()}`;
  const description = "Automated smoke test from .verify/test-tickets-smoke.ts (safe to delete).";
  const inserted = await db
    .from("tickets")
    .insert({
      client_id: client.data.id,
      category: "question",
      title,
      description,
      priority: "low",
      status: "open",
    })
    .select("id, number")
    .single();
  if (inserted.error) throw inserted.error;

  const msg = await db.from("ticket_messages").insert({
    ticket_id: inserted.data.id,
    client_id: client.data.id,
    author_role: "system",
    kind: "event",
    event: { type: "smoke", at: new Date().toISOString() },
  });
  if (msg.error) throw msg.error;

  console.log("Created", inserted.data.number, "for", client.data.company_name);

  const r2 =
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_TICKETS_BUCKET;
  console.log(r2 ? "R2: configured — run manual upload test in portal." : "R2: SKIP (add S3 API keys to .env.local)");

  await db.from("tickets").delete().eq("id", inserted.data.id);
  console.log("Cleaned up smoke ticket row.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});