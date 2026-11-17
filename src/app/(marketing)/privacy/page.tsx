import type { Metadata } from "next";
import { brand } from "@/data/site-copy";

export const metadata: Metadata = {
  title: `Privacy Policy | ${brand.name}`,
};

export default function PrivacyPage() {
  return (
    <main className="bg-white pt-28">
      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
        <h1 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px]">
          Privacy Policy
        </h1>
        <div className="mt-10 flex flex-col gap-8 text-base leading-relaxed text-body">
          <div>
            <h2 className="text-2xl font-medium leading-8 text-ink">
              Information we collect
            </h2>
            <p className="mt-3">
              When you contact us through this site, we collect the details you
              provide: your name, email address, company, and message. We do
              not collect anything you do not give us directly.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-medium leading-8 text-ink">
              How we use your information
            </h2>
            <p className="mt-3">
              We use your contact details to respond to your inquiry and to
              discuss working together. We do not sell or share your
              information with third parties for marketing purposes.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-medium leading-8 text-ink">Contact</h2>
            <p className="mt-3">
              Questions about this policy? Email us at{" "}
              <a
                href={`mailto:${brand.email}`}
                className="text-leaf underline-offset-2 hover:underline"
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
