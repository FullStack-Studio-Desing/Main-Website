import { Breadcrumb } from "@/components/Breadcrumb";
import { brand } from "@/data/site-copy";

export const metadata = {
  title: "Privacy Policy — FullStack Studio Design",
  description: "Privacy policy for FullStack Studio Design.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900">
      <Breadcrumb title="Privacy Policy" />
      <section className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-neutral-600 dark:text-neutral-400">
              Last updated: 2024. This privacy policy describes how {brand.name} collects, uses,
              and protects your information when you use our website and services.
            </p>
            <h2 className="mt-8 text-xl font-semibold text-neutral-900 dark:text-white">
              Information We Collect
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              We may collect your name, email address, phone number, company name, and project
              details when you contact us or submit a form.
            </p>
            <h2 className="mt-8 text-xl font-semibold text-neutral-900 dark:text-white">
              How We Use Your Information
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              We use your information to respond to inquiries, provide services, and improve our
              offerings. We do not sell your personal information to third parties.
            </p>
            <h2 className="mt-8 text-xl font-semibold text-neutral-900 dark:text-white">
              Contact
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              For privacy-related questions, contact us at{" "}
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
