"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { brand } from "@/data/site-copy";
import { useT } from "@/lib/i18n";

export default function PrivacyPage() {
  const pv = useT("privacy");

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900">
      <Breadcrumb title={pv.title} />
      <section className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-neutral-600 dark:text-neutral-400">
              {pv.lastUpdated} {brand.name} {pv.lastUpdatedSuffix}
            </p>
            <h2 className="mt-8 text-xl font-semibold text-neutral-900 dark:text-white">
              {pv.infoCollect}
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {pv.infoCollectBody}
            </p>
            <h2 className="mt-8 text-xl font-semibold text-neutral-900 dark:text-white">
              {pv.howUse}
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {pv.howUseBody}
            </p>
            <h2 className="mt-8 text-xl font-semibold text-neutral-900 dark:text-white">
              {pv.contactTitle}
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {pv.contactBody}{" "}
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
