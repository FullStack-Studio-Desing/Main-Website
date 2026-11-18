#!/usr/bin/env node
/**
 * Applies CRM billing SQL to the linked Supabase project.
 * Requires SUPABASE_ACCESS_TOKEN (Dashboard → Account → Access Tokens)
 * or DATABASE_URL (Project Settings → Database → URI).
 */
import { readFileSync } from "fs";
import { resolve } from "path";

const root = resolve(import.meta.dirname, "..");
const sql = [
  "supabase/migrations/20261118010000_crm_projects.sql",
  "supabase/migrations/20261118020000_crm_invoices_and_cards.sql",
]
  .map((file) => readFileSync(resolve(root, file), "utf8"))
  .join("\n\n");

const projectRef = "cegandwlslskyxkzxfwi";
const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
const databaseUrl = process.env.DATABASE_URL?.trim();

async function viaManagementApi() {
  if (!token) return false;
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await response.text();
  if (!response.ok) {
    console.error("Management API failed:", response.status, text);
    return false;
  }
  console.log("Applied via Supabase Management API.");
  console.log(text.slice(0, 500));
  return true;
}

async function viaDatabaseUrl() {
  if (!databaseUrl) return false;
  const { default: pg } = await import("pg").catch(() => ({ default: null }));
  if (!pg) {
    console.error("Install pg first: npm i -D pg");
    return false;
  }
  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
    console.log("Applied via DATABASE_URL.");
    return true;
  } finally {
    await client.end();
  }
}

const ok = (await viaManagementApi()) || (await viaDatabaseUrl());
if (!ok) {
  console.error(`
Could not apply automatically.

1) Open Supabase → SQL → New query
2) Paste supabase/migrations/20261118020000_crm_invoices_and_cards.sql
3) Run

Or set SUPABASE_ACCESS_TOKEN or DATABASE_URL and re-run:
  node scripts/apply-billing-sql.mjs
`);
  process.exit(1);
}
