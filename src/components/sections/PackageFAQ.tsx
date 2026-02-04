"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "Can I upgrade my package later?",
    answer:
      "Absolutely! You can upgrade at any time. We'll credit what you've already paid toward your new package, and seamlessly transition your project to include the additional services.",
  },
  {
    question: "What if I need something not listed in any package?",
    answer:
      "We're flexible! Every business is unique. Contact us for a custom quote tailored to your specific needs. We can mix and match services or create entirely custom solutions.",
  },
  {
    question: "How long does each package take to complete?",
    answer:
      "Starter packages typically complete in 2-3 weeks. Growth packages take 6-8 weeks due to the expanded scope and marketing campaigns. Enterprise projects vary based on complexity, but we'll provide a detailed timeline during our initial consultation.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes! We offer flexible payment options. Typically, we work with 50% upfront and 50% upon completion for Starter and Growth packages. Enterprise projects can be structured with monthly payments over the project duration.",
  },
  {
    question: "What happens after the support period ends?",
    answer:
      "You own everything we build. After the support period, you can continue independently, hire us for ongoing maintenance (starting at $500/month), or upgrade to a package with extended support.",
  },
  {
    question: "Can I cancel or pause my project?",
    answer:
      "We understand plans change. For milestone-based projects, you can pause between milestones. Refund policies vary by project stage - typically, completed work is non-refundable, but unused portions can be credited toward future work.",
  },
  {
    question: "Do you work with businesses outside the US and Canada?",
    answer:
      "Yes! While we're based in North America, we work with clients globally. We use async communication tools and schedule calls that work across time zones.",
  },
  {
    question: "What's included in the 'support' period?",
    answer:
      "Support includes bug fixes, minor content updates, performance monitoring, and technical assistance. It doesn't include new feature development or major redesigns - those would be scoped as additional work.",
  },
];

function FAQItem({ faq, index }: { faq: { question: string; answer: string }; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-white/10"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        className="w-full py-6 flex items-center justify-between text-left group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-white group-hover:text-theme transition-colors pr-4">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-theme/20 transition-colors"
        >
          <svg
            className="h-4 w-4 text-white/60 group-hover:text-theme transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-white/60 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function PackageFAQ() {
  return (
    <section className="relative bg-bg-body py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-theme text-sm font-medium uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Common questions
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Everything you need to know about our packages.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="divide-y divide-white/10 border-t border-white/10">
          {faqs.map((faq, index) => (
            <FAQItem key={faq.question} faq={faq} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-white/60 mb-6">
            Still have questions? We&apos;re here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-theme font-semibold text-black transition-all hover:shadow-lg hover:shadow-theme/30"
            >
              Schedule a Call
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 font-semibold text-white transition-all hover:bg-white/5"
            >
              View All FAQs
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
