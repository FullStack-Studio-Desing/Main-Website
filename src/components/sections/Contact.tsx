"use client";

import { CalendarCheck, Lightning } from "@phosphor-icons/react";
import { brand, contact } from "@/data/site-copy";
import { ContactFormCard } from "@/components/ContactFormCard";
import { GoogleSchedulingButton } from "@/components/GoogleSchedulingButton";
import { StickerPill } from "@/components/graphics/BrandStickers";

export function Contact() {
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
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Left 50% — pitch + booking */}
          <div className="flex flex-col justify-center lg:min-h-[640px]">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <StickerPill tone="neon">
                <CalendarCheck size={16} weight="duotone" />
                Book a call
              </StickerPill>
              <StickerPill tone="mint">
                <Lightning size={16} weight="duotone" />
                Reply in 1 day
              </StickerPill>
            </div>
            <h2 className="font-display text-[36px] uppercase leading-[0.95] tracking-[-0.0143em] text-white sm:text-[48px] lg:text-[56px] lg:leading-[48px]">
              {contact.headlineStart}{" "}
              <span className="text-neon">{contact.headlineEmphasis}</span>
            </h2>
            <p className="mt-6 max-w-[520px] text-lg font-medium leading-6 text-sage">
              {contact.body}
            </p>

            <div className="mt-10 flex flex-col gap-8">
              <div>
                <a
                  href={`mailto:${brand.email}`}
                  className="text-lg font-medium text-neon transition-colors duration-200 hover:text-neon-active"
                >
                  {brand.email}
                </a>
                <p className="mt-2 text-base font-medium text-sage">
                  {brand.hours}
                </p>
              </div>

              <div className="flex flex-col items-start gap-3">
                <p className="text-xl font-medium tracking-[-0.0125em] text-white">
                  {contact.bookingPrompt}
                </p>
                <p className="max-w-[420px] text-base leading-relaxed text-sage">
                  {contact.bookingBody}
                </p>
                <GoogleSchedulingButton
                  className="mt-1"
                  label={contact.bookingLabel}
                  color="#ffffff"
                />
              </div>
            </div>
          </div>

          {/* Right 50% — form */}
          <div className="w-full">
            <ContactFormCard
              showSchedule={false}
              stickerLabel="Let's grow"
              eyeline={contact.formDivider}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
