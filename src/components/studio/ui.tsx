import Link from "next/link";
import type { ReactNode } from "react";

export const fieldClass =
  "h-12 w-full rounded-md border border-input-edge bg-white px-4 text-base text-ink outline-none transition-colors duration-200 placeholder:text-muted focus:border-leaf disabled:cursor-not-allowed disabled:bg-paper";

export const areaClass =
  "min-h-28 w-full rounded-md border border-input-edge bg-white px-4 py-3 text-base leading-relaxed text-ink outline-none transition-colors duration-200 placeholder:text-muted focus:border-leaf";

const labelClass = "mb-2 block text-sm font-medium text-ink";

const badgeTones: Record<string, string> = {
  active: "bg-mint text-ink",
  paid: "bg-mint text-ink",
  published: "bg-mint text-ink",
  paused: "bg-white text-moss ring-1 ring-rule",
  pending: "bg-white text-moss ring-1 ring-rule",
  draft: "bg-white text-moss ring-1 ring-rule",
  archived: "bg-fog text-muted",
  failed: "bg-fog text-ink",
  refunded: "bg-fog text-muted",
};

const badgeLabels: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  archived: "Archived",
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
  draft: "Draft",
  published: "Published",
};

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={className ?? "block"}>
      <span className={labelClass}>{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-sm leading-relaxed text-muted">{hint}</span> : null}
    </label>
  );
}

export function Alert({
  tone,
  children,
}: {
  tone: "error" | "notice";
  children: ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`border-l-2 px-4 py-3 text-sm leading-relaxed text-ink ${
        tone === "error" ? "border-leaf bg-mint" : "border-neon-active bg-white"
      }`}
    >
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center rounded-action px-3 text-sm font-medium ${
        badgeTones[status] ?? "bg-white text-ink ring-1 ring-rule"
      }`}
    >
      {badgeLabels[status] ?? status}
    </span>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-muted transition-colors duration-200 hover:text-ink">
      {children}
    </Link>
  );
}

export function PageIntro({
  eyebrow,
  title,
  lede,
  action,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-[640px]">
        {eyebrow ? <p className="text-sm font-medium text-muted">{eyebrow}</p> : null}
        <h1 className="mt-2 font-display text-[36px] uppercase leading-[0.95] tracking-[-0.02em] text-ink sm:text-[48px]">
          {title}
        </h1>
        {lede ? <p className="mt-4 text-base leading-relaxed text-body">{lede}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Section({
  id,
  title,
  lede,
  children,
}: {
  id?: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-14 scroll-mt-8">
      <h2 className="font-display text-[28px] uppercase leading-none tracking-[-0.02em] text-ink">
        {title}
      </h2>
      {lede ? <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">{lede}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}
