import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const publicKey = process.env.MP_PUBLIC_KEY?.trim();
  return NextResponse.json(
    publicKey
      ? { publicKey }
      : { error: "MP_PUBLIC_KEY is not configured on the application server." },
    {
      status: publicKey ? 200 : 500,
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}
