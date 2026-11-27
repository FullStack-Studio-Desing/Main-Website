/**
 * Smoke test: ticket attachment pipeline against real Supabase + R2.
 * Mirrors requestTicketUploads → browser PUT → confirmTicketUploads → download, then cleans up.
 * Run: npx tsx .verify/test-ticket-attachments.ts
 */
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { randomUUID } from "crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@supabase/supabase-js";

// 1×1 transparent PNG
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_TICKETS_BUCKET;
  if (!url || !key) throw new Error("Supabase env missing");
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    console.log("R2: SKIP (add R2_* keys to .env.local, see docs/r2-tickets.md)");
    return;
  }

  const db = createClient(url, key, { auth: { persistSession: false } });
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  const client = await db.from("clients").select("id").limit(1).maybeSingle();
  if (client.error || !client.data) throw new Error("No client row to test with");
  const clientId = String(client.data.id);

  const ticket = await db
    .from("tickets")
    .insert({
      client_id: clientId,
      category: "question",
      title: `Attachment smoke ${new Date().toISOString()}`,
      description: "Automated attachment smoke test (safe to delete).",
      priority: "low",
      status: "open",
    })
    .select("id, number")
    .single();
  if (ticket.error) throw ticket.error;
  const ticketId = String(ticket.data.id);

  let r2Key: string | null = null;
  try {
    const message = await db
      .from("ticket_messages")
      .insert({ ticket_id: ticketId, client_id: clientId, author_role: "client", kind: "reply", body: null })
      .select("id")
      .single();
    if (message.error) throw message.error;

    r2Key = `tickets/${clientId}/${ticketId}/${randomUUID()}/smoke.png`;
    const row = await db
      .from("ticket_attachments")
      .insert({
        ticket_id: ticketId,
        client_id: clientId,
        r2_key: r2Key,
        file_name: "smoke.png",
        content_type: "image/png",
        size_bytes: PNG.length,
        status: "pending",
      })
      .select("id")
      .single();
    if (row.error) throw row.error;

    const putUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({ Bucket: bucket, Key: r2Key, ContentType: "image/png", ContentLength: PNG.length }),
      { expiresIn: 600 },
    );
    const put = await fetch(putUrl, { method: "PUT", headers: { "Content-Type": "image/png" }, body: PNG });
    if (!put.ok) throw new Error(`PUT failed: ${put.status} ${await put.text()}`);
    console.log("OK presigned PUT");

    const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: r2Key }));
    if (head.ContentLength !== PNG.length) throw new Error(`HEAD size ${head.ContentLength} != ${PNG.length}`);
    console.log("OK HEAD size matches");

    const ready = await db
      .from("ticket_attachments")
      .update({ status: "ready", message_id: message.data.id })
      .eq("id", row.data.id)
      .select("status, message_id")
      .single();
    if (ready.error) throw ready.error;
    if (ready.data.status !== "ready" || ready.data.message_id !== message.data.id) {
      throw new Error("Attachment not bound to message");
    }
    console.log("OK attachment ready and bound to message");

    const getUrl = await getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: r2Key }), {
      expiresIn: 300,
    });
    const get = await fetch(getUrl);
    if (!get.ok) throw new Error(`GET failed: ${get.status}`);
    console.log("OK presigned GET");
  } finally {
    if (r2Key) await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: r2Key })).catch(() => {});
    await db.from("tickets").delete().eq("id", ticketId);
    console.log("Cleaned up", ticket.data.number);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
