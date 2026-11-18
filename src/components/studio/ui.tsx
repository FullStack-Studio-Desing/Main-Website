import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert as UiAlert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const badgeVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  paid: "default",
  published: "default",
  completed: "default",
  planning: "secondary",
  paused: "secondary",
  pending: "secondary",
  draft: "secondary",
  sent: "secondary",
  archived: "outline",
  cancelled: "destructive",
  failed: "destructive",
  refunded: "outline",
  void: "outline",
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
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
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
    <UiAlert
      variant={tone === "error" ? "destructive" : "default"}
      role={tone === "error" ? "alert" : "status"}
    >
      <AlertDescription>{children}</AlertDescription>
    </UiAlert>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={badgeVariant[status] ?? "outline"}>
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
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-2xl space-y-1.5">
        {eyebrow ? <p className="text-sm text-muted-foreground">{eyebrow}</p> : null}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {lede ? <p className="text-sm text-muted-foreground sm:text-base">{lede}</p> : null}
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
    <section id={id} className="mt-10 scroll-mt-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        {lede ? <p className="max-w-2xl text-sm text-muted-foreground">{lede}</p> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
