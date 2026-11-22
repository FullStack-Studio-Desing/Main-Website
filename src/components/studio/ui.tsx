import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert as UiAlert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { todayISO } from "@/lib/portal/format";
import type { ProjectRecord } from "@/lib/portal/types";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

// Every status the CRM renders, mapped onto the four shadcn badge variants.
const badges: Record<string, { variant: BadgeVariant; label: string }> = {
  // Clients, projects, reports
  active: { variant: "default", label: "Active" },
  paused: { variant: "secondary", label: "Paused" },
  archived: { variant: "outline", label: "Archived" },
  planning: { variant: "secondary", label: "Planning" },
  completed: { variant: "default", label: "Completed" },
  cancelled: { variant: "destructive", label: "Cancelled" },
  published: { variant: "default", label: "Published" },
  // Payments and invoices
  paid: { variant: "default", label: "Paid" },
  pending: { variant: "secondary", label: "Pending" },
  failed: { variant: "destructive", label: "Failed" },
  refunded: { variant: "outline", label: "Refunded" },
  partially_refunded: { variant: "outline", label: "Partly refunded" },
  draft: { variant: "secondary", label: "Draft" },
  sent: { variant: "secondary", label: "Sent" },
  void: { variant: "outline", label: "Void" },
  overdue: { variant: "destructive", label: "Overdue" },
  // Support tickets
  open: { variant: "default", label: "Open" },
  awaiting_studio: { variant: "secondary", label: "Waiting on studio" },
  awaiting_client: { variant: "outline", label: "Waiting on you" },
  resolved: { variant: "outline", label: "Resolved" },
  closed: { variant: "outline", label: "Closed" },
  bug: { variant: "destructive", label: "Bug" },
  change_request: { variant: "secondary", label: "Change request" },
  question: { variant: "outline", label: "Question" },
  content_update: { variant: "secondary", label: "Content update" },
  billing: { variant: "outline", label: "Billing" },
  account: { variant: "outline", label: "Account" },
  other: { variant: "outline", label: "Other" },
  // Tasks
  todo: { variant: "outline", label: "To do" },
  in_progress: { variant: "secondary", label: "In progress" },
  blocked: { variant: "destructive", label: "Blocked" },
  done: { variant: "default", label: "Done" },
  // Task priority
  low: { variant: "outline", label: "Low" },
  normal: { variant: "secondary", label: "Normal" },
  high: { variant: "default", label: "High" },
  urgent: { variant: "destructive", label: "Urgent" },
  // Project updates
  note: { variant: "outline", label: "Note" },
  milestone: { variant: "secondary", label: "Milestone" },
  delivery: { variant: "default", label: "Delivery" },
  blocker: { variant: "destructive", label: "Blocker" },
};

export function statusLabel(status: string) {
  return badges[status]?.label ?? status;
}

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

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge variant={badges[status]?.variant ?? "outline"} className={cn("whitespace-nowrap", className)}>
      {statusLabel(status)}
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
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 max-w-2xl space-y-1">
        {eyebrow ? <p className="text-sm text-muted-foreground">{eyebrow}</p> : null}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {lede ? <p className="text-sm text-muted-foreground">{lede}</p> : null}
      </div>
      {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
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

/** KPI tile: label + icon on top, big value, optional hint underneath. */
export function StatCard({
  label,
  value,
  hint,
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        {icon ? <span className="text-muted-foreground [&>svg]:size-4">{icon}</span> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

/** Card with a title row (and optional action) above arbitrary content. */
export function SectionCard({
  id,
  title,
  description,
  action,
  className,
  contentClassName,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <Card id={id} className={cn("scroll-mt-8", className)}>
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div className="min-w-0 flex-1 space-y-1.5">
          <CardTitle className="text-base">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action ? <div className="-my-1 flex shrink-0 items-center gap-2">{action}</div> : null}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center",
        className
      )}
    >
      {icon ? (
        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground [&>svg]:size-5">
          {icon}
        </div>
      ) : null}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/** Two-letter initials for avatar fallbacks. */
export function initials(value: string) {
  const words = value.trim().split(/[\s@._-]+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Open projects whose due date has passed. */
export function isOverdue(project: Pick<ProjectRecord, "status" | "due_on">, today = todayISO()) {
  return (
    Boolean(project.due_on) &&
    project.due_on! < today &&
    project.status !== "completed" &&
    project.status !== "cancelled"
  );
}
