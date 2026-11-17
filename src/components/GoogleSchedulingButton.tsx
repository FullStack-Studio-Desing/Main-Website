"use client";

import { useEffect, useRef, useState } from "react";

export const GOOGLE_SCHEDULE_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3OJ3AcMuPqTQNJf1KBT-Rdswt-YDTILRStjizfO25Rqk7IJphMT_bPVD6hINldtYkC8XEeSzHp?gv=true";

const CSS_HREF =
  "https://calendar.google.com/calendar/scheduling-button-script.css";
const JS_SRC =
  "https://calendar.google.com/calendar/scheduling-button-script.js";

/** Brand ink — Google default #039BE5 clashes with the forest/neon system. */
export const GOOGLE_SCHEDULE_COLOR = "#273f2b";

declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (opts: {
          url: string;
          color: string;
          label: string;
          target: HTMLElement;
        }) => void;
      };
    };
  }
}

type Props = {
  className?: string;
  color?: string;
  label?: string;
};

function ensureStylesheet() {
  if (document.querySelector(`link[href="${CSS_HREF}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = CSS_HREF;
  document.head.appendChild(link);
}

function loadScript(): Promise<void> {
  if (window.calendar?.schedulingButton) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${JS_SRC}"]`,
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.calendar?.schedulingButton) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Google scheduling script failed")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = JS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google scheduling script failed"));
    document.body.appendChild(script);
  });
}

export function GoogleSchedulingButton({
  className,
  color = GOOGLE_SCHEDULE_COLOR,
  label = "Book an appointment",
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    const mount = document.createElement("div");
    host.replaceChildren(mount);

    ensureStylesheet();

    loadScript()
      .then(() => {
        if (cancelled || !window.calendar?.schedulingButton) return;
        window.calendar.schedulingButton.load({
          url: GOOGLE_SCHEDULE_URL,
          color,
          label,
          target: mount,
        });

        const injected = mount.nextElementSibling;
        if (injected instanceof HTMLElement) {
          injected.style.borderRadius = "28px";
          injected.style.height = "48px";
          injected.style.padding = "0 20px";
          injected.style.fontSize = "16px";
          injected.style.fontWeight = "500";
          injected.style.lineHeight = "1";
          injected.style.cursor = "pointer";
        }

        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });

    return () => {
      cancelled = true;
      host.replaceChildren();
    };
  }, [color, label]);

  return (
    <div
      className={
        className
          ? `inline-flex flex-col items-start ${className}`
          : "inline-flex flex-col items-start"
      }
    >
      {/* Imperative mount node — Google injects beside this; React never reconciles inside. */}
      <div ref={hostRef} className="inline-flex min-h-12 items-center" />
      {!ready && (
        <a
          href={GOOGLE_SCHEDULE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center rounded-action bg-ink px-5 text-base font-medium text-white transition-colors duration-200 hover:bg-moss focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neon"
        >
          {label}
        </a>
      )}
    </div>
  );
}
