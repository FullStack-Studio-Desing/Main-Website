import { AlertTriangle, CircleSlash, ListChecks } from "lucide-react";
import type { ProjectTaskRecord } from "@/lib/portal/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { taskProgress } from "@/components/studio/project/labels";

export function ProjectProgress({
  tasks,
  className,
}: {
  tasks: Pick<ProjectTaskRecord, "status" | "due_on">[];
  className?: string;
}) {
  const stats = taskProgress(tasks);

  return (
    <Card className={className}>
      <CardContent className="space-y-3 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-muted-foreground">Progress</p>
          <p className="text-sm font-medium tabular-nums text-foreground">
            {stats.done} of {stats.total} done
            <span className="ml-2 text-muted-foreground">{stats.percent}%</span>
          </p>
        </div>
        <Progress value={stats.percent} aria-label="Tasks completed" />
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ListChecks className="size-4" aria-hidden />
            {stats.open} open
          </span>
          <span
            className={
              stats.overdue > 0
                ? "inline-flex items-center gap-1.5 text-destructive"
                : "inline-flex items-center gap-1.5"
            }
          >
            <AlertTriangle className="size-4" aria-hidden />
            {stats.overdue} overdue
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CircleSlash className="size-4" aria-hidden />
            {stats.blocked} blocked
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
