import type { NextConfig } from "next";

const mediaHost = (() => {
  const raw =
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim() ||
    "https://pub-95a4793aaea94b2b99d642e24003ffe5.r2.dev";
  try {
    return new URL(raw).hostname;
  } catch {
    return "pub-95a4793aaea94b2b99d642e24003ffe5.r2.dev";
  }
})();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: mediaHost,
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    // Routes removed in the 2026 redesign; keep old indexed URLs alive.
    return [
      { source: "/packages", destination: "/#pricing", permanent: true },
      { source: "/faq", destination: "/", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/service", destination: "/services", permanent: true },
    ];
  },
};

export default nextConfig;
