import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Routes removed in the 2026 redesign; keep old indexed URLs alive.
    return [
      { source: "/packages", destination: "/#pricing", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/faq", destination: "/", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/service", destination: "/services", permanent: true },
    ];
  },
};

export default nextConfig;
