"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import { useT } from "@/lib/i18n";
import { Spotlight } from "@/components/ui/spotlight";
import { GradientMesh, FloatingShapes, CornerAccents } from "@/components/ui/floating-graphics";
import { BackgroundRippleStatic } from "@/components/ui/background-ripple";

export function FAQSection() {
  const fs = useT("faqSection");
  const faqs = useT("faqs") as unknown as { q: string; a: string }[];
  return (
    <section className="relative overflow-hidden border-t border-brand-default bg-bg-body py-24 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(191,247,71,0.04),transparent)]" />
      <Spotlight className="-top-20 -left-40" fill="rgba(40, 233, 140, 0.05)" />
      <BackgroundRippleStatic rows={7} cols={18} cellSize={60} className="opacity-25" />
      <GradientMesh />
      <FloatingShapes />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-theme/20 bg-theme/5 mb-6"
          >
            <svg className="h-4 w-4 text-theme" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-theme uppercase tracking-wider">
              {fs.label}
            </span>
          </motion.div>
          <h2 className="font-display text-4xl font-bold tracking-tight text-text-header sm:text-5xl lg:text-6xl">
            {fs.headline}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme to-theme-accent">
              {fs.headlineAccent}
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-body">
            {fs.body}{" "}
            <Link href="/contact" className="text-theme font-medium hover:underline">
              {fs.letsTalk}
            </Link>
          </p>
        </motion.div>

        {/* FAQ Accordion - 2 Columns */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion items={faqs.slice(0, Math.ceil(faqs.length / 2))} />
          <Accordion items={faqs.slice(Math.ceil(faqs.length / 2))} />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative rounded-2xl border border-brand-default bg-gradient-to-b from-bg-section to-bg-body p-8 lg:p-10">
            <CornerAccents className="opacity-50" />
            <h3 className="font-display text-xl font-bold text-text-header lg:text-2xl">
              {fs.stillQuestions}
            </h3>
            <p className="mt-2 text-text-muted">
              {fs.stillBody}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-theme px-6 py-3 font-semibold text-bg-body transition-all duration-300 hover:bg-theme-accent hover:shadow-lg hover:shadow-theme/25"
              >
                {fs.getInTouch}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <span className="text-sm text-text-muted">
                {fs.orEmail}{" "}
                <a href="mailto:info@fullstackstudiodesign.com" className="text-theme hover:underline">
                  info@fullstackstudiodesign.com
                </a>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
