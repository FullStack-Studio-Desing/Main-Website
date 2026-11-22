"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type CardField = "number" | "name" | "expiry" | "cvc" | null;
export type CardBrand = "visa" | "mastercard" | "amex" | null;

export function detectBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return null;
}

const BRAND_LABEL: Record<Exclude<CardBrand, null>, string> = {
  visa: "VISA",
  mastercard: "mastercard",
  amex: "AMERICAN EXPRESS",
};

/** Slot layout for the number: Amex is 4-6-5, everything else 4-4-4-4. */
function groupsFor(brand: CardBrand) {
  return brand === "amex" ? [4, 6, 5] : [4, 4, 4, 4];
}

const spring = { type: "spring", stiffness: 260, damping: 30 } as const;

/** "1" → "1•/••", "113" → "11/3•". */
function expiryDisplay(expiry: string) {
  const digits = expiry.replace(/\D/g, "");
  return `${digits.slice(0, 2).padEnd(2, "•")}/${digits.slice(2, 4).padEnd(2, "•")}`;
}

/**
 * A live card that fills in as the payer types. It flips to the back for the
 * security code, which only ever shows as dots. Purely visual: no card data leaves it.
 */
export function CardPreview({
  number,
  name,
  expiry,
  cvcLength,
  focused,
  brandOverride,
}: {
  /** Digits only ("•" for masked digits of a saved card). */
  number: string;
  /** Brand of a saved card, whose digits are masked and cannot be detected. */
  brandOverride?: CardBrand;
  name: string;
  /** "MM/YY" as typed. */
  expiry: string;
  cvcLength: number;
  focused: CardField;
}) {
  const reduceMotion = useReducedMotion();
  const brand = brandOverride !== undefined ? brandOverride : detectBrand(number);
  const flipped = focused === "cvc";

  let cursor = 0;
  const groups = groupsFor(brand).map((size) => {
    const slots = Array.from({ length: size }, (_, i) => number[cursor + i] ?? null);
    cursor += size;
    return slots;
  });

  return (
    <div className="mx-auto w-full max-w-[22rem] [perspective:1200px]" aria-hidden>
      <motion.div
        className="relative aspect-[1.586] w-full [transform-style:preserve-3d]"
        animate={reduceMotion ? undefined : { rotateY: flipped ? 180 : 0 }}
        transition={spring}
      >
        {/* Front */}
        <Face hidden={reduceMotion ? flipped : false}>
          <div className="flex items-start justify-between">
            <Chip />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={brand ?? "none"}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  "text-right font-semibold text-white/90",
                  brand === "visa" && "text-xl italic tracking-tight",
                  brand === "mastercard" && "text-base tracking-tight",
                  brand === "amex" && "max-w-[7rem] text-[10px] leading-tight tracking-[0.12em]",
                )}
              >
                {brand ? BRAND_LABEL[brand] : <span className="text-xs font-medium text-white/40">CARD</span>}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="mt-auto">
            <p className="flex gap-[0.55em] font-mono text-[clamp(1rem,4.6vw,1.3rem)] text-white">
              {groups.map((slots, g) => (
                <span key={g} className="flex">
                  {slots.map((digit, i) => (
                    <span key={i} className="relative inline-block w-[0.66em] text-center">
                      <AnimatePresence initial={false} mode="popLayout">
                        <motion.span
                          key={digit ?? "empty"}
                          className={cn("inline-block", !digit && "text-white/35")}
                          initial={reduceMotion ? false : { opacity: 0, y: 8, filter: "blur(2px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                        >
                          {digit ?? "•"}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  ))}
                </span>
              ))}
            </p>
          </div>

          <div className="mt-3 flex items-end justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/50">Card holder</p>
              <p className="mt-0.5 truncate text-sm font-medium uppercase tracking-wider text-white">
                {name.trim() || "Your name"}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/50">Expires</p>
              <p className="mt-0.5 font-mono text-sm text-white">
                <span className={cn(!expiry && "text-white/35")}>{expiryDisplay(expiry)}</span>
              </p>
            </div>
          </div>
        </Face>

        {/* Back */}
        <Face back hidden={reduceMotion ? !flipped : false}>
          <div className="-mx-6 mt-2 h-10 bg-black/70" />
          <div className="mt-5 flex items-center gap-3">
            <div className="h-9 flex-1 rounded-sm bg-white/85 [background-image:repeating-linear-gradient(135deg,transparent_0_6px,rgba(0,0,0,0.05)_6px_12px)]" />
            <div className="flex h-9 min-w-[3.75rem] items-center justify-center rounded-sm bg-white px-2 font-mono text-base tracking-[0.2em] text-neutral-900 ring-2 ring-white/40">
              {cvcLength ? "•".repeat(cvcLength) : <span className="text-neutral-400">CVC</span>}
            </div>
          </div>
          <p className="mt-auto text-[10px] leading-snug text-white/45">
            The security code stays hidden and is encrypted by Mercado Pago.
          </p>
        </Face>
      </motion.div>
    </div>
  );
}

function Face({ back = false, hidden, children }: { back?: boolean; hidden: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-[#13241a] p-6 shadow-xl ring-1 ring-black/10 [backface-visibility:hidden]",
        back && "[transform:rotateY(180deg)]",
        hidden && "invisible",
      )}
    >
      {/* Quiet sheen so the card reads as a physical object without a loud gradient. */}
      <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-white/[0.06]" />
      <div className="pointer-events-none absolute -bottom-28 -left-10 h-56 w-56 rounded-full bg-emerald-300/[0.07]" />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}

function Chip() {
  return (
    <div className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 to-amber-400/80 p-[3px] shadow-inner">
      <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-px rounded-[4px] opacity-40">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="rounded-[1px] border border-amber-900/50" />
        ))}
      </div>
    </div>
  );
}
