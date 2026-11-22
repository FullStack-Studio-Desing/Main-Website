import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/portal/session";
import { createClient } from "@/lib/supabase/server";
import { presignGet, type ContentDisposition } from "@/server/storage/r2";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type AttachmentRow = {
  id: string;
  r2_key: string;
  file_name: string;
  content_type: string;
  status: string;
  client_id: string;
  message_id: string | null;
  ticket_messages: { kind: string } | { kind: string }[] | null;
};

function messageKind(row: AttachmentRow): string | null {
  const linked = row.ticket_messages;
  if (!linked) return null;
  if (Array.isArray(linked)) return linked[0]?.kind ?? null;
  return linked.kind;
}

function contentDisposition(contentType: string): ContentDisposition {
  if (contentType.startsWith("image/")) return "inline";
  if (contentType === "application/pdf") return "inline";
  return "attachment";
}

/** GET /api/tickets/attachments/[id] — redirect to a short-lived presigned R2 URL. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return new NextResponse(null, { status: 404 });

  const session = await getSession();
  if (session.kind !== "ready") {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ticket_attachments")
    .select(
      "id, r2_key, file_name, content_type, status, client_id, message_id, ticket_messages ( kind )",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[tickets/attachments] load failed", error.message);
    return new NextResponse(null, { status: 404 });
  }

  const row = data as AttachmentRow | null;
  if (!row || row.status !== "ready") return new NextResponse(null, { status: 404 });

  if (session.profile.role === "client") {
    if (session.profile.client_id !== row.client_id) {
      return new NextResponse(null, { status: 404 });
    }
    if (messageKind(row) === "internal_note") {
      return new NextResponse(null, { status: 404 });
    }
  }

  try {
    const url = await presignGet(
      row.r2_key,
      row.file_name,
      contentDisposition(row.content_type),
      row.content_type,
    );
    return NextResponse.redirect(url, 302);
  } catch (err) {
    console.error("[tickets/attachments] presign failed", err);
    return NextResponse.json({ error: "File storage is not configured." }, { status: 503 });
  }
}