import { ChevronDown, Landmark } from "lucide-react";
import { formatUsd } from "@/lib/portal/format";

export type StatementLine = {
  /** Merchant name sent to Mercado Pago as the statement descriptor. */
  descriptor: string;
  /** Short date shown on the line, e.g. "Nov 21". */
  date: string;
  /** Invoice amount in USD; the bank's own conversion lands close to it. */
  usd: number;
  /** What Mercado Pago actually charges, e.g. "MX$1,902.93". Null when charged in USD. */
  chargedAs: string | null;
};

/**
 * Collapsed by default: one line saying how the charge is labelled. Opening it shows a mock
 * bank-statement row and the currency note, so the payer recognises the charge when it posts.
 */
export function StatementPreview({ line, settled = false }: { line: StatementLine; settled?: boolean }) {
  const amount = `${line.chargedAs ? "≈ " : ""}${formatUsd(line.usd)}`;

  return (
    <details className="group rounded-lg border bg-muted/40 text-sm [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2.5 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
        <Landmark className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="shrink-0 text-xs font-medium">{settled ? "On your card statement" : "On your statement"}</span>
        <span className="min-w-0 flex-1 truncate text-right font-mono text-xs text-foreground">
          {line.descriptor}
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
          aria-hidden
        />
      </summary>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-3 rounded-md border bg-background px-3 py-2.5 font-mono text-[13px] text-foreground shadow-sm">
          <span className="shrink-0 text-muted-foreground">{line.date}</span>
          <span className="min-w-0 flex-1 truncate font-semibold tracking-wide">{line.descriptor}</span>
          <span className="shrink-0 tabular-nums">{amount}</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {line.chargedAs
            ? `Processed by Mercado Pago in Mexico as ${line.chargedAs}; your bank converts it to US dollars, so the posted amount can differ by a few cents. The name may show a Mercado Pago prefix.`
            : "The name may show a Mercado Pago prefix."}
        </p>
      </div>
    </details>
  );
}
