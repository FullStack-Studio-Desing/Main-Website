"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { mediaUrl } from "@/lib/media";

type Brand = {
  name: string;
  src: string;
  width: number;
  height: number;
};

const brands: Brand[] = [
  { name: "Google", src: mediaUrl("/images/brands/google.svg"), width: 62, height: 62 },
  { name: "WordPress", src: mediaUrl("/images/brands/wordpress.svg"), width: 62, height: 62 },
  { name: "Shopify", src: mediaUrl("/images/brands/shopify.svg"), width: 55, height: 62 },
  { name: "Google Ads", src: mediaUrl("/images/brands/google-ads.svg"), width: 70, height: 62 },
  { name: "Meta Ads", src: mediaUrl("/images/brands/meta.svg"), width: 94, height: 62 },
  { name: "HubSpot", src: mediaUrl("/images/brands/hubspot.svg"), width: 62, height: 62 },
  { name: "GoHighLevel", src: mediaUrl("/images/brands/gohighlevel.svg"), width: 156, height: 36 },
  { name: "Klaviyo", src: mediaUrl("/images/brands/klaviyo.svg"), width: 62, height: 62 },
  { name: "Stripe", src: mediaUrl("/images/brands/stripe.svg"), width: 62, height: 62 },
];

function BrandIcon({ name, src, width, height }: Brand) {
  return (
    <span
      className="inline-flex w-[6.175rem] shrink-0 flex-col items-center justify-center gap-1.5 md:w-[7.15rem]"
      aria-label={name}
    >
      <span className="inline-flex h-[3.25rem] w-full items-center justify-center md:h-[3.9rem]">
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          className="h-[2.6rem] w-auto max-w-full object-contain md:h-[3.25rem]"
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
