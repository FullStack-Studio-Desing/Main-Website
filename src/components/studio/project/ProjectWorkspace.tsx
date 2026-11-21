import type { ReactNode } from "react";
import { CalendarDays, CircleDollarSign, Flag } from "lucide-react";
import { formatDate, formatUsd } from "@/lib/portal/format";
import type { ProjectWorkspace as Workspace } from "@/lib/portal/project-queries";
import { SectionCard, StatCard, StatusBadge } from "@/components/studio/ui";
import { BillingPanel, billingTotals } from "@/components/studio/project/BillingPanel";
import { ProjectProgress } from "@/components/studio/project/ProjectProgress";
import { TaskBoard } from "@/components/studio/project/TaskBoard";
import { UpdateTimeline, UpdateTimelineItem } from "@/components/studio/project/UpdateTimeline";
import { UpdatesFeed } from "@/components/studio/project/UpdatesFeed";
import { taskProgress } from "@/components/studio/project/labels";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProjectWorkspace({
  workspace,
  projectForm,
}: {
  workspace: Workspace;
  // The edit form is passed in so the page keeps ownership of the bound action.
  projectForm: ReactNode;
}) {
  const { project, tasks, updates, invoices, payments, tasksReady } = workspace;
  const progress = taskProgress(tasks);
  const totals = billingTotals(project, invoices, payments);

  return (
    <Tabs defaultValue="overview" className="mt-8">
      <TabsList className="grid h-auto w-full grid-cols-4 sm:inline-flex sm:w-auto">
        <TabsTrigger value="overview" className="px-2 sm:px-3">Overview</TabsTrigger>
        <TabsTrigger value="tasks" className="px-2 sm:px-3">
          Tasks
          {progress.open > 0 ? (
            <span className="ml-1.5 hidden tabular-nums text-muted-foreground sm:inline">
              {progress.open}
            </span>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="updates" className="px-2 sm:px-3">
          Updates
          {updates.length > 0 ? (
            <span className="ml-1.5 hidden tabular-nums text-muted-foreground sm:inline">
              {updates.length}
            </span>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="billing" className="px-2 sm:px-3">Billing</TabsTrigger>
      </TabsList>

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

        {updates.length > 0 ? (
          <SectionCard title="Latest updates" description="The three most recent entries.">
            <UpdateTimeline>
              {updates.slice(0, 3).map((update) => (
                <UpdateTimelineItem key={update.id} update={update} showVisibility />
              ))}
            </UpdateTimeline>
          </SectionCard>
        ) : null}

        <SectionCard
          title="Project details"
          description="Name, status, dates, budget and notes."
          contentClassName="[&>form]:mt-0"
        >
          {projectForm}
        </SectionCard>
      </TabsContent>

      <TabsContent value="tasks" className="mt-6">
        {tasksReady ? (
          <TaskBoard projectId={project.id} tasks={tasks} />
        ) : (
          <MigrationNotice />
        )}
      </TabsContent>

      <TabsContent value="updates" className="mt-6">
        {tasksReady ? (
          <UpdatesFeed projectId={project.id} updates={updates} />
        ) : (
          <MigrationNotice />
        )}
      </TabsContent>

      <TabsContent value="billing" className="mt-6">
        <BillingPanel project={project} invoices={invoices} payments={payments} />
      </TabsContent>
    </Tabs>
  );
}

function MigrationNotice() {
  return (
    <Alert>
      <AlertTitle>Tasks and updates are not installed yet</AlertTitle>
      <AlertDescription>
        Run{" "}
        <code className="font-mono text-[13px]">
          supabase/migrations/20261121120000_project_tasks_updates_invoice_links.sql
        </code>{" "}
        in the Supabase SQL editor, then refresh this page.
      </AlertDescription>
    </Alert>
  );
}
