import type { Metadata } from "next";
import { brand } from "@/data/site-copy";

export const metadata: Metadata = {
  title: `Terms of Service | ${brand.name}`,
};

export default function TermsPage() {
  return (
    <main className="bg-white pt-28">
      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
        <h1 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-ink sm:text-[48px]">
          Terms of Service
        </h1>
        <div className="mt-10 flex flex-col gap-8 text-base leading-relaxed text-body">
          <div>
            <h2 className="text-2xl font-medium leading-8 text-ink">Services</h2>
            <p className="mt-3">
              {brand.name} provides web development, digital marketing, AI
              automation, and related services under monthly plans. The scope
              of each engagement is defined in the agreement signed before work
              begins.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-medium leading-8 text-ink">Billing</h2>
            <p className="mt-3">
              Monthly plans are billed in advance at the start of each billing
              period. Specific payment terms, renewal, and cancellation
              conditions are set out in your service agreement.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-medium leading-8 text-ink">Contact</h2>
            <p className="mt-3">
              Questions about these terms? Email us at{" "}
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
