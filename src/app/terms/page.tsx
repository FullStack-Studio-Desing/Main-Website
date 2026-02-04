import { Breadcrumb } from "@/components/Breadcrumb";
import { brand } from "@/data/site-copy";

export const metadata = {
  title: "Terms of Service — FullStack Studio Design",
  description: "Terms of service for FullStack Studio Design.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900">
      <Breadcrumb title="Terms of Service" />
      <section className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-neutral-600 dark:text-neutral-400">
              Last updated: 2024. By using our website and services, you agree to these terms.
            </p>
            <h2 className="mt-8 text-xl font-semibold text-neutral-900 dark:text-white">
              Services
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {brand.name} provides web development, software development, AI solutions, and
              digital marketing services. Scope and deliverables are defined in individual
              agreements.
            </p>
            <h2 className="mt-8 text-xl font-semibold text-neutral-900 dark:text-white">
              Payment
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Payment terms are specified in your project agreement. Typically 50% upfront and
              50% upon completion unless otherwise agreed.
            </p>
            <h2 className="mt-8 text-xl font-semibold text-neutral-900 dark:text-white">
              Contact
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              For questions about these terms, contact us at{" "}
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
