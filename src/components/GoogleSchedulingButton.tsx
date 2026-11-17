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

const POPUP_STYLE_ID = "fssd-google-schedule-popup-style";

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

/** Opaque white panel + compact centered size (not fullscreen). */
function ensurePopupStyles() {
  if (document.getElementById(POPUP_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = POPUP_STYLE_ID;
  style.textContent = `
    /* Dim backdrop — keep translucent, never bleach full viewport white */
    .qxJTeb,
    .R5cc3e,
    div[jscontroller][aria-modal="true"],
    div[role="dialog"][aria-modal="true"] {
      background-color: rgba(18, 35, 20, 0.55) !important;
      background: rgba(18, 35, 20, 0.55) !important;
    }

    /* Compact white appointment panel */
    iframe[src*="calendar.google.com/calendar/appointments"],
    iframe[src*="calendar.app.google"],
    div[role="dialog"] iframe[src*="calendar"] {
      background-color: #ffffff !important;
      background: #ffffff !important;
      width: min(440px, calc(100vw - 32px)) !important;
      max-width: 440px !important;
      height: min(640px, calc(100vh - 48px)) !important;
      max-height: min(640px, calc(100vh - 48px)) !important;
      border: none !important;
      border-radius: 16px !important;
      box-shadow: 0 24px 64px rgba(18, 35, 20, 0.28) !important;
    }

    /* Inner panel wrappers Google nests around the iframe */
    .iFjyZd,
    div[role="dialog"][aria-modal="true"] > div,
    div[aria-modal="true"] .VfPpkd-P5QLlc,
    div[aria-modal="true"] .W7g1Rb-rymPhb {
      background-color: #ffffff !important;
      background: #ffffff !important;
      width: min(440px, calc(100vw - 32px)) !important;
      max-width: 440px !important;
      max-height: min(640px, calc(100vh - 48px)) !important;
      border-radius: 16px !important;
      overflow: hidden !important;
      margin: auto !important;
    }
  `;
  document.head.appendChild(style);
}

function sizePopupPanel(el: HTMLElement) {
  el.style.width = "min(440px, calc(100vw - 32px))";
  el.style.maxWidth = "440px";
  el.style.height = "min(640px, calc(100vh - 48px))";
  el.style.maxHeight = "min(640px, calc(100vh - 48px))";
  el.style.borderRadius = "16px";
  el.style.overflow = "hidden";
  el.style.backgroundColor = "#ffffff";
  el.style.background = "#ffffff";
}

function paintPopupWhite(root: ParentNode = document) {
  const iframes = root.querySelectorAll<HTMLIFrameElement>(
    'iframe[src*="calendar.google.com"], iframe[src*="calendar.app.google"]',
  );
  iframes.forEach((iframe) => {
    sizePopupPanel(iframe);
    const parent = iframe.parentElement;
    if (parent) sizePopupPanel(parent);
  });

  const dialogs = root.querySelectorAll<HTMLElement>(
    '[role="dialog"][aria-modal="true"], [aria-modal="true"]',
  );
  dialogs.forEach((el) => {
    // Keep the full-viewport dimmer translucent; only whiten/size the panel
    const looksLikeBackdrop =
      el.childElementCount === 1 ||
      getComputedStyle(el).position === "fixed";
    if (looksLikeBackdrop) {
      el.style.backgroundColor = "rgba(18, 35, 20, 0.55)";
      el.style.background = "rgba(18, 35, 20, 0.55)";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      const panel = el.firstElementChild as HTMLElement | null;
      if (panel) sizePopupPanel(panel);
      return;
    }
    sizePopupPanel(el);
  });
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
    ensurePopupStyles();
    const timers: number[] = [];
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (!m.addedNodes.length) continue;
        paintPopupWhite();
        // Google often applies fullscreen inline styles a tick later
        timers.push(
          window.setTimeout(paintPopupWhite, 50),
          window.setTimeout(paintPopupWhite, 200),
        );
        break;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    const mount = document.createElement("div");
    host.replaceChildren(mount);

    ensureStylesheet();
    ensurePopupStyles();

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
          // Solid fill — Google’s default can read as transparent on dark surfaces
          injected.style.backgroundColor = color;
          injected.style.backgroundImage = "none";
          injected.style.opacity = "1";
          const isLight =
            color.toLowerCase() === "#ffffff" ||
            color.toLowerCase() === "#fff" ||
            color.toLowerCase() === "white";
          injected.style.color = isLight ? "#122314" : "#ffffff";
          injected.style.border = isLight
            ? "1px solid rgba(255,255,255,0.9)"
            : "none";
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
          className={
            color.toLowerCase() === "#ffffff" ||
            color.toLowerCase() === "#fff" ||
            color.toLowerCase() === "white"
              ? "inline-flex h-12 items-center justify-center rounded-action bg-white px-5 text-base font-medium text-ink transition-colors duration-200 hover:bg-mint focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neon"
              : "inline-flex h-12 items-center justify-center rounded-action bg-ink px-5 text-base font-medium text-white transition-colors duration-200 hover:bg-moss focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neon"
          }
        >
          {label}
        </a>
      )}
    </div>
  );
}
