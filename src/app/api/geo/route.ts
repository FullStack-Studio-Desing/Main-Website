import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function decodeHeader(value: string | null): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    ""
  );
}

/** Normalize IPv4-mapped IPv6 (::ffff:127.0.0.1 → 127.0.0.1) */
function normalizeIp(ip: string): string {
  const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (mapped?.[1]) return mapped[1];
  return ip;
}

function isPrivateIp(raw: string): boolean {
  const ip = normalizeIp(raw);
  if (!ip) return true;
  if (ip === "127.0.0.1" || ip === "::1" || ip === "0.0.0.0") return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("169.254."))
    return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
  if (ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80"))
    return true;
  return false;
}

async function fetchJson(
  url: string,
  ms = 2000,
): Promise<Record<string, unknown> | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function cityFromIpinfo(ip: string | null): Promise<string | null> {
  const url = ip
    ? `https://ipinfo.io/${encodeURIComponent(ip)}/json`
    : "https://ipinfo.io/json";
  const data = await fetchJson(url);
  const city = typeof data?.city === "string" ? data.city.trim() : "";
  return city || null;
}

async function cityFromGeoJs(ip: string | null): Promise<string | null> {
  const url = ip
    ? `https://get.geojs.io/v1/ip/geo/${encodeURIComponent(ip)}.json`
    : "https://get.geojs.io/v1/ip/geo.json";
  const data = await fetchJson(url);
  const city = typeof data?.city === "string" ? data.city.trim() : "";
  if (!city || city.toLowerCase() === "nil") return null;
  return city;
}

function jsonCity(city: string | null) {
  return NextResponse.json(
    { city },
    {
      headers: {
        "Cache-Control": "private, max-age=3600",
      },
    },
  );
}

export async function GET(request: NextRequest) {
  // Prefer edge platform headers (Vercel / Cloudflare)
  const vercelCity = decodeHeader(request.headers.get("x-vercel-ip-city"));
  const cfCity = decodeHeader(request.headers.get("cf-ipcity"));
  const cityFromHeader = vercelCity || cfCity;

  if (cityFromHeader && cityFromHeader !== "null") {
    return jsonCity(cityFromHeader);
  }

  const ip = normalizeIp(clientIp(request));
  // Local/private IPs: look up the server's public egress IP instead
  const lookupIp = isPrivateIp(ip) ? null : ip;

  try {
    const city =
      (await cityFromIpinfo(lookupIp)) || (await cityFromGeoJs(lookupIp));
    return jsonCity(city);
  } catch {
    return jsonCity(null);
  }
}
