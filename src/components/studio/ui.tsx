import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert as UiAlert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const badgeVariant: Record<string, "success" | "muted" | "soft" | "outline"> = {
  active: "success",
  paid: "success",
  published: "success",
  completed: "success",
  planning: "muted",
  paused: "muted",
  pending: "muted",
  draft: "muted",
  sent: "muted",
  archived: "soft",
  cancelled: "soft",
  failed: "soft",
  refunded: "soft",
  void: "soft",
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
  sent: "Sent",
  void: "Void",
  published: "Published",
  planning: "Planning",
  completed: "Completed",
  cancelled: "Cancelled",
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
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-sm leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
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
    <UiAlert variant={tone === "error" ? "success" : "notice"} role={tone === "error" ? "alert" : "status"}>
      <AlertDescription>{children}</AlertDescription>
    </UiAlert>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={badgeVariant[status] ?? "outline"} className="h-7 px-3 text-sm font-medium">
      {badgeLabels[status] ?? status}
    </Badge>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button asChild variant="link" className="h-auto p-0 text-muted-foreground">
      <Link href={href}>{children}</Link>
    </Button>
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
        {eyebrow ? <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p> : null}
        <h1 className="mt-2 font-display text-[36px] uppercase leading-[0.95] tracking-[-0.02em] text-foreground sm:text-[48px]">
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
      <h2 className="font-display text-[28px] uppercase leading-none tracking-[-0.02em] text-foreground">
        {title}
      </h2>
      {lede ? (
        <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">{lede}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}
