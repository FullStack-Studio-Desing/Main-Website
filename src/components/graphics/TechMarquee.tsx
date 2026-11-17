"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

type Brand = {
  name: string;
  src: string;
  width: number;
  height: number;
};

const brands: Brand[] = [
  { name: "Google", src: "/images/brands/google.svg", width: 48, height: 48 },
  { name: "WordPress", src: "/images/brands/wordpress.svg", width: 48, height: 48 },
  { name: "Shopify", src: "/images/brands/shopify.svg", width: 42, height: 48 },
  { name: "Google Ads", src: "/images/brands/google-ads.svg", width: 54, height: 48 },
  { name: "Meta Ads", src: "/images/brands/meta.svg", width: 72, height: 48 },
  { name: "HubSpot", src: "/images/brands/hubspot.svg", width: 48, height: 48 },
  { name: "GoHighLevel", src: "/images/brands/gohighlevel.svg", width: 120, height: 28 },
  { name: "Klaviyo", src: "/images/brands/klaviyo.svg", width: 48, height: 48 },
  { name: "Stripe", src: "/images/brands/stripe.svg", width: 48, height: 48 },
];

function BrandIcon({ name, src, width, height }: Brand) {
  return (
    <span
      className="inline-flex w-[4.75rem] shrink-0 flex-col items-center justify-center gap-1.5 md:w-[5.5rem]"
      aria-label={name}
    >
      <span className="inline-flex h-10 w-full items-center justify-center md:h-12">
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          className="h-8 w-auto max-w-full object-contain md:h-10"
          unoptimized
        />
      </span>
      <span className="max-w-full truncate text-center text-[10px] font-medium leading-none tracking-wide text-sage/80 md:text-[11px]">
        {name}
      </span>
    </span>
  );
}

export function TechMarquee({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const row = [...brands, ...brands];

  return (
    <div className={`relative overflow-hidden ${className}`} aria-label="Platforms we work with">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-forest to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-forest to-transparent"
      />
      <div
        className={`flex w-max items-end gap-6 md:gap-8 ${reduce ? "" : "animate-marquee"}`}
        style={reduce ? undefined : { animationDuration: "28s" }}
      >
        {row.map((brand, i) => (
          <BrandIcon key={`${brand.name}-${i}`} {...brand} />
        ))}
      </div>
    </div>
  );
}
