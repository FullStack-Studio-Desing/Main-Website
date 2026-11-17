"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { closing } from "@/data/site-copy";
import { btnInverse } from "@/components/buttons";
import {
  StickerBurst,
  StickerPill,
} from "@/components/graphics/BrandStickers";

export function Closing() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-paper py-28 lg:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(104,239,63,0.12) 0%, transparent 55%)",
        }}
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto flex max-w-[880px] flex-col items-center px-6 text-center sm:px-10"
      >
        <div className="mb-8 flex justify-center">
          <StickerPill tone="neon" rotate={-3}>
            <StickerBurst className="h-4 w-4" tone="ink" />
            Ready when you are
          </StickerPill>
        </div>
        <p className="font-display text-[44px] uppercase leading-[0.95] tracking-[-0.01em] text-sage sm:text-[60px] lg:text-[80px] lg:leading-[0.9]">
          {closing.lineStart}{" "}
          <span className="text-neon-active">{closing.lineEmphasis}</span>
        </p>
        <Link href="/contact" className={`${btnInverse} mt-12`}>
          {closing.cta}
        </Link>
      </motion.div>
    </section>
  );
}
