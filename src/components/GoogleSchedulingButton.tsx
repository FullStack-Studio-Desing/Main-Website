"use client";

import { useEffect, useId, useRef, useState } from "react";
import { btnInverse } from "@/components/buttons";

export const GOOGLE_SCHEDULE_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3OJ3AcMuPqTQNJf1KBT-Rdswt-YDTILRStjizfO25Rqk7IJphMT_bPVD6hINldtYkC8XEeSzHp?gv=true";

/** Brand ink — used for the default booking CTA. */
export const GOOGLE_SCHEDULE_COLOR = "#273f2b";

type Props = {
  className?: string;
  color?: string;
  label?: string;
};

/**
 * Opens Google Appointment Scheduling in a branded on-page iframe modal.
 */
export function GoogleSchedulingButton({
  className,
  color = GOOGLE_SCHEDULE_COLOR,
  label = "Book an appointment",
}: Props) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const isLight =
    color.toLowerCase() === "#ffffff" ||
    color.toLowerCase() === "#fff" ||
    color.toLowerCase() === "white";

  const tone = isLight
    ? "inline-flex h-12 items-center justify-center rounded-action bg-white px-5 text-base font-medium text-ink transition-colors duration-200 hover:bg-mint focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neon"
    : btnInverse;

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      className={
        className
          ? `inline-flex flex-col items-start ${className}`
          : "inline-flex flex-col items-start"
      }
    >
      <button type="button" className={tone} onClick={() => setOpen(true)}>
        {label}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Close scheduling dialog"
            className="absolute inset-0 bg-[rgba(18,35,20,0.55)]"
            onClick={() => setOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex w-full max-w-[440px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_rgba(18,35,20,0.28)]"
            style={{ height: "min(640px, calc(100vh - 48px))" }}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-rule px-4 py-3">
              <h2 id={titleId} className="text-sm font-medium text-ink">
                Book an appointment
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-mint focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neon"
                aria-label="Close"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <iframe
              title="Google Calendar appointment scheduling"
              src={GOOGLE_SCHEDULE_URL}
              className="h-full w-full flex-1 border-0 bg-white"
              loading="lazy"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
