import Link from "next/link";
import { FileText, FolderKanban, LifeBuoy, Wallet } from "lucide-react";
import { formatDate, formatUsd } from "@/lib/portal/format";
import type { PortalOverview } from "@/lib/portal/portal-overview";
import { UpdateTimeline, UpdateTimelineItem } from "@/components/studio/project/UpdateTimeline";
import { Progress } from "@/components/ui/progress";
import { EmptyState, PageIntro, Section, StatCard, StatusBadge } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PortalOverviewDashboard({ overview }: { overview: PortalOverview }) {
  const { client } = overview;
  const overdue =
    overview.oldestUnpaid?.due_on &&
    overview.oldestUnpaid.due_on < new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());

  return (
    <>
      <PageIntro
        eyebrow="Welcome back"
        title={client.company_name}
        lede={`${client.plan_name} · ${formatUsd(client.monthly_amount)} a month`}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Amount due"
          value={formatUsd(overview.amountDue)}
          hint={overview.unpaidCount ? `${overview.unpaidCount} unpaid` : "All caught up"}
          icon={<FileText />}
        />
        <StatCard
          label="Active projects"
          value={String(overview.activeProjects)}
          hint={overview.openTasks ? `${overview.openTasks} tasks open` : "No open tasks"}
          icon={<FolderKanban />}
        />
        <StatCard
          label="Open tickets"
          value={String(overview.openTickets)}
          hint={overview.awaitingYou ? `${overview.awaitingYou} awaiting your reply` : "No action needed"}
          icon={<LifeBuoy />}
        />
        <StatCard
          label="Paid this year"
          value={formatUsd(overview.paidThisYear)}
          hint={overview.refundedThisYear ? `${formatUsd(overview.refundedThisYear)} refunded` : undefined}
          icon={<Wallet />}
        />
      </div>

      {overview.oldestUnpaid ? (
        <Card className={cn("mt-8", overdue && "border-destructive/40")}>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[13px] text-muted-foreground">{overview.oldestUnpaid.number}</p>
              <p className="text-lg font-semibold">{formatUsd(overview.oldestUnpaid.amount)} USD</p>
              <p className={cn("text-sm", overdue ? "text-destructive" : "text-muted-foreground")}>
                Due {formatDate(overview.oldestUnpaid.due_on)}
              </p>
            </div>
            <Button asChild>
              <Link href={`/portal/invoices/${overview.oldestUnpaid.id}`}>View invoice</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {overview.projectProgress.length === 0 &&
      overview.recentUpdates.length === 0 &&
      overview.unpaidCount === 0 &&
      overview.openTickets === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Your workspace is ready"
            description="Open a support ticket or review your company profile when you need something."
            action={
              <Button asChild variant="outline">
                <Link href="/portal/tickets">Support</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <Section title="Projects" lede="Latest progress on active work.">
            <div className="grid gap-4 md:grid-cols-3">
              {overview.projectProgress.map((project) => (
                <Card key={project.id}>
                  <CardContent className="space-y-3 p-6">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/portal/projects/${project.id}`} className="font-medium hover:underline">
                        {project.name}
                      </Link>
                      <StatusBadge status={project.status} />
                    </div>
                    <Progress
                      value={
                        project.tasks_total === 0
                          ? project.status === "completed"
                            ? 100
                            : 0
                          : Math.round((project.tasks_done / project.tasks_total) * 100)
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      {project.tasks_done} of {project.tasks_total} tasks done
                      {project.due_on ? ` · Due ${formatDate(project.due_on)}` : ""}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button asChild variant="link" className="mt-3 h-auto px-0">
              <Link href="/portal/projects">View all projects</Link>
            </Button>
          </Section>

          {overview.recentUpdates.length ? (
            <Section title="Latest updates" lede="What the studio has shared with you.">
              <UpdateTimeline>
                {overview.recentUpdates.map((update) => (
                  <UpdateTimelineItem
                    key={update.id}
                    update={update}
                    eyebrow={"project_name" in update ? String(update.project_name) : undefined}
                  />
                ))}
              </UpdateTimeline>
            </Section>
          ) : null}
        </>
      )}
    </>
  );
}