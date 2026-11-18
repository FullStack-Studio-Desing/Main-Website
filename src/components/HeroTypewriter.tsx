"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const TYPE_MS = 42;
const DELETE_MS = 28;
const HOLD_MS = 2000;
const GAP_MS = 320;

type Props = {
  phrases: readonly string[];
  className?: string;
};

/**
 * Neon typewriter that types / deletes between rotating phrases.
 * Reduced motion: shows the first phrase with no typing loop.
 */
export function HeroTypewriter({ phrases, className }: Props) {
  const reduce = useReducedMotion();
  const list = phrases.length > 0 ? phrases : ["actually sell"];

  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(list[0].length);
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">(
    "holding",
  );
  const [announced, setAnnounced] = useState(list[0]);

  const phrase = list[index % list.length];
  const visible = phrase.slice(0, chars);

  useEffect(() => {
    if (reduce) return;

    let timer: ReturnType<typeof setTimeout>;

    if (phase === "holding") {
      timer = setTimeout(() => setPhase("deleting"), HOLD_MS);
    } else if (phase === "deleting") {
      if (chars > 0) {
        timer = setTimeout(() => setChars((c) => c - 1), DELETE_MS);
      } else {
        timer = setTimeout(() => {
          setIndex((i) => (i + 1) % list.length);
          setPhase("typing");
        }, GAP_MS);
      }
    } else if (phase === "typing") {
      if (chars < phrase.length) {
        timer = setTimeout(() => setChars((c) => c + 1), TYPE_MS);
      } else {
        setAnnounced(phrase);
        setPhase("holding");
      }
    }

    return () => clearTimeout(timer);
  }, [reduce, phase, chars, phrase, list.length]);

  if (reduce) {
    return <span className={className}>{list[0]}</span>;
  }

  return (
    <span className={`inline-grid ${className ?? ""}`}>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announced}
      </span>
      {/* Invisible copies of every phrase lock the cell to the max size */}
      {list.map((p) => (
        <span
          key={p}
          className="invisible col-start-1 row-start-1 whitespace-pre-wrap"
          aria-hidden="true"
        >
          {p}
          <span className="ml-[0.06em] inline-block h-[0.82em] w-[0.08em]" />
        </span>
      ))}
      <span
        className="col-start-1 row-start-1 whitespace-pre-wrap"
        aria-hidden="true"
      >
        {visible}
        <span className="hero-type-caret ml-[0.06em] inline-block h-[0.82em] w-[0.08em] translate-y-[0.06em] bg-neon align-baseline" />
      </span>
    </span>
  );
}
