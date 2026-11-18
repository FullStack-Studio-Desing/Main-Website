/** Cloudflare R2 public base for site images/videos (`mainwebsite` bucket). */
const DEFAULT_MEDIA_BASE =
  "https://pub-95a4793aaea94b2b99d642e24003ffe5.r2.dev";

function mediaBase() {
  const fromEnv = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim();
  return (fromEnv || DEFAULT_MEDIA_BASE).replace(/\/$/, "");
}

/** Resolve a public media path (e.g. `/images/logo.png`) to the R2 URL. */
export function mediaUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${mediaBase()}${normalized}`;
}
