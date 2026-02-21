"use client";

import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FAQSection } from "@/components/sections/FAQSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { MovingBorder } from "@/components/ui/moving-border";
import { useT } from "@/lib/i18n";

export default function FAQPage() {
  const fp = useT("faqPage");

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900">
      <Breadcrumb title={fp.title} />
      <FAQSection />
      <section className="border-t border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-neutral-600 dark:text-neutral-400">
            {fp.notFoundAnswer}
          </p>
          <div className="mt-4">
            <MovingBorder
              as={Link}
              href="/contact"
              borderRadius="0.5rem"
              className="inline-block bg-neutral-900 px-6 py-3 font-semibold text-white dark:bg-white dark:text-neutral-900"
            >
              {fp.contactUs}
            </MovingBorder>
          </div>
        </div>
      </section>
      <TestimonialsSection />
    </main>
  );
}
