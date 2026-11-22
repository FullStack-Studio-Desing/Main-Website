"use client";

import Link from "next/link";
import { CalendarDays, CircleDollarSign, Flag, LifeBuoy } from "lucide-react";
import { formatDate, formatUsd } from "@/lib/portal/format";
import type { ProjectWorkspace } from "@/lib/portal/project-queries";
import type { ProjectTaskRecord } from "@/lib/portal/types";
import { HashTabs } from "@/components/studio/HashTabs";
import { BillingPanel, billingTotals } from "@/components/studio/project/BillingPanel";
import { ProjectProgress } from "@/components/studio/project/ProjectProgress";
import {
  isOverdue as isTaskOverdue,
  priorityLabel,
  priorityVariant,
  taskProgress,
  taskStatusLabel,
} from "@/components/studio/project/labels";
import { UpdateTimeline, UpdateTimelineItem } from "@/components/studio/project/UpdateTimeline";
import { EmptyState, SectionCard, StatCard, StatusBadge } from "@/components/studio/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function PortalProjectWorkspace({ workspace }: { workspace: ProjectWorkspace }) {
  const { project, tasks, updates, invoices, payments, tasksReady } = workspace;
  const clientUpdates = updates.filter((update) => update.visible_to_client);
  const progress = taskProgress(tasks);
  const totals = billingTotals(project, invoices, payments);
  const openTasks = tasks.filter((task) => task.status !== "done");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "tasks", label: "Tasks", count: progress.open || undefined },
    { value: "updates", label: "Updates", count: clientUpdates.length || undefined },
    { value: "billing", label: "Billing" },
    { value: "support", label: "Support" },
  ];

  return (
    <HashTabs tabs={tabs} defaultValue="overview">
      <TabsContent value="overview" className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Status"
            icon={<Flag />}
            value={<StatusBadge status={project.status} className="text-sm" />}
            hint={project.started_on ? `Started ${formatDate(project.started_on)}` : "No start date"}
          />
          <StatCard
            label="Due"
            icon={<CalendarDays />}
            value={project.due_on ? formatDate(project.due_on) : "Not set"}
            hint={progress.overdue > 0 ? `${progress.overdue} overdue tasks` : "No overdue tasks"}
          />
          <StatCard
            label="Paid"
            icon={<CircleDollarSign />}
            value={formatUsd(totals.paid)}
            hint={
              totals.budget === null
                ? `${formatUsd(totals.invoiced)} invoiced`
                : `of ${formatUsd(totals.budget)} budget`
            }
          />
        </div>

        {tasksReady ? <ProjectProgress tasks={tasks} /> : null}

        {project.description ? (
          <SectionCard title="About this project" description="Scope and goals.">
            <p className="text-sm whitespace-pre-line text-muted-foreground">{project.description}</p>
          </SectionCard>
        ) : null}

        {openTasks.length > 0 ? (
          <SectionCard title="Open tasks" description="What the studio is working on next.">
            <ReadOnlyTaskList tasks={openTasks.slice(0, 5)} />
            {openTasks.length > 5 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {openTasks.length - 5} more on the Tasks tab.
              </p>
            ) : null}
          </SectionCard>
        ) : null}
      </TabsContent>

      <TabsContent value="tasks" className="mt-6 space-y-6">
        {tasksReady ? (
          <>
            <SectionCard title="Open" description="In progress, blocked, or not started.">
              {openTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No open tasks.</p>
              ) : (
                <ReadOnlyTaskList tasks={openTasks} />
              )}
            </SectionCard>
            <SectionCard title="Done" description="Completed work.">
              {doneTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing marked done yet.</p>
              ) : (
                <ReadOnlyTaskList tasks={doneTasks} />
              )}
            </SectionCard>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Tasks are not available yet.</p>
        )}
      </TabsContent>

      <TabsContent value="updates" className="mt-6">
        {clientUpdates.length === 0 ? (
          <EmptyState title="No updates yet" description="The studio will post progress notes here." />
        ) : (
          <UpdateTimeline>
            {clientUpdates.map((update) => (
              <UpdateTimelineItem key={update.id} update={update} />
            ))}
          </UpdateTimeline>
        )}
      </TabsContent>

      <TabsContent value="billing" className="mt-6">
        <BillingPanel project={project} invoices={invoices} payments={payments} />
      </TabsContent>

      <TabsContent value="support" className="mt-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                <LifeBuoy className="size-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground">Project support</h3>
                <p className="text-sm text-muted-foreground">
                  Open a ticket when you need help with this project. Support tickets are coming soon
                  in the portal.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/portal/tickets">Open ticket</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </HashTabs>
  );
}

function ReadOnlyTaskList({ tasks }: { tasks: ProjectTaskRecord[] }) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
  return (
    <ul className="divide-y divide-border">
      {tasks.map((task) => {
        const overdue = isTaskOverdue(task, today);
        return (
          <li key={task.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{task.title}</p>
              {task.details ? (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{task.details}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <Badge variant={priorityVariant[task.priority]}>{priorityLabel[task.priority]}</Badge>
              <Badge variant="outline">{taskStatusLabel[task.status]}</Badge>
              {task.due_on ? (
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    overdue ? "font-medium text-destructive" : "text-muted-foreground"
                  )}
                >
                  Due {formatDate(task.due_on)}
                </span>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}