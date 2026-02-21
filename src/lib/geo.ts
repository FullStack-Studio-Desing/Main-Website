export type Locale = "en" | "es";

/**
 * Detect user country via free geo-IP API.
 * Returns "es" for Mexico, "en" for everywhere else.
 * Falls back to "en" on any error.
 */
export async function detectLocale(): Promise<Locale> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch("https://ipapi.co/json/", {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return "en";

    const data = await res.json();
    // country_code is ISO 3166-1 alpha-2
    if (data.country_code === "MX") return "es";
    return "en";
  } catch {
    return "en";
  }
}
