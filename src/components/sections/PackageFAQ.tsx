"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import { Spotlight } from "@/components/ui/spotlight";
import { GradientMesh, FloatingShapes, CornerAccents } from "@/components/ui/floating-graphics";
import { BackgroundRippleStatic } from "@/components/ui/background-ripple";

const packageFaqs = [
  {
    q: "Can I upgrade my package later?",
    a: "Absolutely! You can upgrade at any time. We'll credit what you've already paid toward your new package, and seamlessly transition your project to include the additional services.",
  },
  {
    q: "What if I need something not listed in any package?",
    a: "We're flexible! Every business is unique. Contact us for a custom quote tailored to your specific needs. We can mix and match services or create entirely custom solutions.",
  },
  {
    q: "How long does each package take to complete?",
    a: "Starter packages typically complete in 2-3 weeks. Growth packages take 6-8 weeks due to the expanded scope and marketing campaigns. Enterprise projects vary based on complexity, but we'll provide a detailed timeline during our initial consultation.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes! We offer flexible payment options. Typically, we work with 50% upfront and 50% upon completion for Starter and Growth packages. Enterprise projects can be structured with monthly payments over the project duration.",
  },
  {
    q: "What happens after the support period ends?",
    a: "You own everything we build. After the support period, you can continue independently, hire us for ongoing maintenance (starting at $500/month), or upgrade to a package with extended support.",
  },
  {
    q: "Can I cancel or pause my project?",
    a: "We understand plans change. For milestone-based projects, you can pause between milestones. Refund policies vary by project stage - typically, completed work is non-refundable, but unused portions can be credited toward future work.",
  },
  {
    q: "Do you work with businesses outside the US and Canada?",
    a: "Yes! While we're based in North America, we work with clients globally. We use async communication tools and schedule calls that work across time zones.",
  },
  {
    q: "What's included in the 'support' period?",
    a: "Support includes bug fixes, minor content updates, performance monitoring, and technical assistance. It doesn't include new feature development or major redesigns - those would be scoped as additional work.",
  },
];

export function PackageFAQ() {
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
              Package FAQ
            </span>
          </motion.div>
          <h2 className="font-display text-4xl font-bold tracking-tight text-text-header sm:text-5xl lg:text-6xl">
            Questions?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme to-theme-accent">
              We&apos;ve Got Answers.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-body">
            Everything you need to know about our packages. Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/contact" className="text-theme font-medium hover:underline">
              Let&apos;s talk.
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
          <Accordion items={packageFaqs.slice(0, Math.ceil(packageFaqs.length / 2))} />
          <Accordion items={packageFaqs.slice(Math.ceil(packageFaqs.length / 2))} />
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
              Still have questions?
            </h3>
            <p className="mt-2 text-text-muted">
              Our team is here to help. Schedule a free consultation and we&apos;ll walk you through everything.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-theme px-6 py-3 font-semibold text-bg-body transition-all duration-300 hover:bg-theme-accent hover:shadow-lg hover:shadow-theme/25"
              >
                Get in Touch
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <span className="text-sm text-text-muted">
                or email us at{" "}
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
