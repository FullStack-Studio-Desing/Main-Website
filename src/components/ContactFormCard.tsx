"use client";

import { useState } from "react";
import { CircleNotch } from "@phosphor-icons/react";
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

type Props = {
  /** Compact layout for hero (slightly tighter padding / fewer rows). */
  compact?: boolean;
  /** Show schedule CTA above the form. */
  showSchedule?: boolean;
  stickerLabel?: string;
  eyeline?: string;
  /** Prefix for input ids when multiple forms can exist. */
  idPrefix?: string;
};

export function ContactFormCard({
  compact = false,
  showSchedule = true,
  stickerLabel = "Let's grow",
  eyeline = contact.formDivider,
  idPrefix = "contact",
}: Props) {
  const fid = (name: string) => `${idPrefix}-${name}`;
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
    <div className="relative w-full">
      <StickerOrbit className="pointer-events-none absolute -left-12 -top-10 hidden h-32 w-32 xl:block" />
      <StickerOrbit
        className="pointer-events-none absolute -bottom-8 -right-10 hidden h-36 w-36 xl:block"
        tone="sage"
      />
      <div className="pointer-events-none absolute -right-3 -top-4 z-10 hidden sm:block">
        <StickerPill tone="neon" animate={false}>
          <StickerStack className="h-4 w-4" tone="ink" />
          {stickerLabel}
        </StickerPill>
      </div>

      <div
        className={`relative rounded-[32px] bg-white text-ink shadow-form-lift ${
          compact ? "p-7 sm:p-8 lg:p-9" : "p-8 sm:p-10 lg:p-12"
        }`}
      >
        {status === "sent" ? (
          <div>
            <h3 className="text-2xl font-medium leading-8 tracking-[-0.0125em] text-ink">
              Got it. Talk soon.
            </h3>
            <p className="mt-4 text-base leading-relaxed text-body">
              Your message is in our inbox. Expect a reply within one business
              day.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {showSchedule && (
              <div className="flex flex-col gap-3 border-b border-rule pb-6">
                <p className="text-sm font-medium uppercase tracking-[0.08em] text-muted">
                  {contact.bookingPrompt}
                </p>
                <p className="text-base leading-relaxed text-body">
                  {contact.bookingBody}
                </p>
                <GoogleSchedulingButton
                  className="mt-1"
                  label={contact.bookingLabel}
                  color="#273f2b"
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <p className="text-sm font-medium uppercase tracking-[0.08em] text-muted">
                {eyeline}
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={fid("name")}
                    className="text-base font-medium text-ink"
                  >
                    Name
                  </label>
                  <input
                    id={fid("name")}
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={fid("email")}
                    className="text-base font-medium text-ink"
                  >
                    Email
                  </label>
                  <input
                    id={fid("email")}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={fid("company")}
                    className="text-base font-medium text-ink"
                  >
                    Company
                  </label>
                  <input
                    id={fid("company")}
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Company name"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={fid("budget")}
                    className="text-base font-medium text-ink"
                  >
                    Plan you&apos;re considering
                  </label>
                  <select
                    id={fid("budget")}
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
                  htmlFor={fid("message")}
                  className="text-base font-medium text-ink"
                >
                  What are you trying to grow?
                </label>
                <textarea
                  id={fid("message")}
                  name="message"
                  required
                  rows={compact ? 3 : 5}
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
                className={`${btnInverse} mt-1 self-start disabled:opacity-60`}
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
  );
}
