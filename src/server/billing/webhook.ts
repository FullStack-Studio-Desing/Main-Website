import { createHmac, timingSafeEqual } from "crypto";

export function verifyMpSignature(input: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
  secret: string;
}): boolean {
  if (!input.xSignature || !input.xRequestId || !input.dataId) return false;

  const parts = Object.fromEntries(
    input.xSignature.split(",").map((part) => {
      const [key, ...rest] = part.split("=");
      return [key?.trim(), rest.join("=").trim()];
    })
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1 || !/^[a-f0-9]+$/i.test(v1)) return false;

  const canonical = `id:${input.dataId.toLowerCase()};request-id:${input.xRequestId};ts:${ts};`;
  const expected = createHmac("sha256", input.secret).update(canonical).digest("hex");
  const actual = Buffer.from(v1.toLowerCase());
  const digest = Buffer.from(expected);
  if (actual.length !== digest.length) return false;
  return timingSafeEqual(actual, digest);
}
