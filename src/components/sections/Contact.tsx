"use client";

import { useState } from "react";
import { CircleNotch, CalendarCheck, Lightning } from "@phosphor-icons/react";
import { brand, contact } from "@/data/site-copy";
import { btnInverse } from "@/components/buttons";
import { GoogleSchedulingButton } from "@/components/GoogleSchedulingButton";
import {
  StickerOrbit,
  StickerPill,
  StickerStack,
} from "@/components/graphics/BrandStickers";

type Status = "idle" | "sending" | "sent" | "error";

const inputClasses =
  "h-12 w-full rounded-md border border-input-edge bg-white px-4 text-base text-ink placeholder:text-muted outline-none transition-colors duration-200 focus:border-leaf";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-forest pb-24 pt-28 lg:pt-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(62,91,67,0.5) 0%, transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-[1536px] px-6 sm:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <StickerPill tone="neon">
            <CalendarCheck size={16} weight="duotone" />
            Book a call
          </StickerPill>
          <StickerPill tone="mint">
            <Lightning size={16} weight="duotone" />
            Reply in 1 day
          </StickerPill>
        </div>
        <h2 className="mx-auto max-w-[800px] text-center font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-white sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
          {contact.headlineStart}{" "}
          <span className="text-neon">{contact.headlineEmphasis}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[640px] text-center text-lg font-medium leading-6 text-sage">
          {contact.body}
        </p>
        <p className="mt-6 text-center text-base font-medium">
          <a
            href={`mailto:${brand.email}`}
            className="text-neon transition-colors duration-200 hover:text-neon-active"
          >
            {brand.email}
          </a>
          <span className="mt-1 block text-sage">{brand.hours}</span>
        </p>

        <div className="relative mx-auto mt-16 max-w-[800px]">
          <StickerOrbit className="pointer-events-none absolute -left-16 -top-12 hidden h-36 w-36 lg:block" />
          <StickerOrbit
            className="pointer-events-none absolute -bottom-10 -right-14 hidden h-40 w-40 lg:block"
            tone="sage"
          />
          <div className="pointer-events-none absolute -right-4 -top-5 z-10 hidden sm:block lg:-right-6">
            <StickerPill tone="neon" animate={false}>
              <StickerStack className="h-4 w-4" tone="ink" />
              Let&apos;s grow
            </StickerPill>
          </div>
          <div className="relative rounded-[32px] bg-white p-8 shadow-form-lift sm:p-12 lg:p-20">
          {status === "sent" ? (
            <div className="text-center">
              <h3 className="text-2xl font-medium leading-8 tracking-[-0.0125em] text-ink">
                Got it. Talk soon.
              </h3>
              <p className="mt-4 text-base leading-relaxed text-body">
                Your message is in our inbox. Expect a reply within one
                business day.
              </p>
              <p className="mt-8 text-base font-medium text-ink">
                {contact.bookingPrompt}
              </p>
              <p className="mt-2 text-base leading-relaxed text-body">
                {contact.bookingBody}
              </p>
              <div className="mt-5 flex justify-center">
                <GoogleSchedulingButton label={contact.bookingLabel} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col items-start gap-3 sm:items-center sm:text-center">
                <p className="text-xl font-medium tracking-[-0.0125em] text-ink">
                  {contact.bookingPrompt}
                </p>
                <p className="max-w-[520px] text-base leading-relaxed text-body">
                  {contact.bookingBody}
                </p>
                <GoogleSchedulingButton
                  className="mt-1 sm:items-center"
                  label={contact.bookingLabel}
                />
              </div>

              <div
                className="flex items-center gap-4"
                role="separator"
                aria-label={contact.formDivider}
              >
                <span className="h-px flex-1 bg-rule" />
                <span className="shrink-0 text-sm font-medium uppercase tracking-[0.08em] text-muted">
                  {contact.formDivider}
                </span>
                <span className="h-px flex-1 bg-rule" />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-base font-medium text-ink">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      className={inputClasses}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-base font-medium text-ink">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@company.com"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="company"
                      className="text-base font-medium text-ink"
                    >
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Company name"
                      className={inputClasses}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="budget"
                      className="text-base font-medium text-ink"
                    >
                      Plan you&apos;re considering
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      defaultValue=""
                      className={inputClasses}
                    >
                      <option value="" disabled>
                        Select a plan
                      </option>
                      <option value="Starter ($999/mo)">Starter, $999/mo</option>
                      <option value="Growth ($1,500/mo)">Growth, $1,500/mo</option>
                      <option value="Scale ($2,500/mo)">Scale, $2,500/mo</option>
                      <option value="Not sure yet">Not sure yet</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className="text-base font-medium text-ink"
                  >
                    What are you trying to grow?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your business and goals"
                    className="w-full resize-y rounded-md border border-input-edge bg-white px-4 py-3 text-base text-ink placeholder:text-muted outline-none transition-colors duration-200 focus:border-leaf"
                  />
                </div>

                {status === "error" && (
                  <p className="text-base text-red-600">
                    Something went wrong sending your message. Please try again,
                    or email us directly at {brand.email}.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={`${btnInverse} mt-2 self-start disabled:opacity-60`}
                >
                  {status === "sending" && (
                    <CircleNotch size={18} className="animate-spin" />
                  )}
                  {status === "sending" ? "Sending" : "Send message"}
                </button>
              </form>
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
