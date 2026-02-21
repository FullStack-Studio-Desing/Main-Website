"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { brand } from "@/data/site-copy";
import { useT } from "@/lib/i18n";

export default function TermsPage() {
  const tm = useT("terms");

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900">
      <Breadcrumb title={tm.title} />
      <section className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-neutral-600 dark:text-neutral-400">
              {tm.lastUpdated}
            </p>
            <h2 className="mt-8 text-xl font-semibold text-neutral-900 dark:text-white">
              {tm.servicesTitle}
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {brand.name} {tm.servicesBody}
            </p>
            <h2 className="mt-8 text-xl font-semibold text-neutral-900 dark:text-white">
              {tm.paymentTitle}
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {tm.paymentBody}
            </p>
            <h2 className="mt-8 text-xl font-semibold text-neutral-900 dark:text-white">
              {tm.contactTitle}
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {tm.contactBody}{" "}
              <a
                href={`mailto:${brand.email}`}
                className="text-neutral-900 underline dark:text-white"
              >
                {brand.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
