"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FolderKanban } from "lucide-react";
import { formatDate } from "@/lib/portal/format";
import type { ClientProjectActivity, ProjectActivityItem } from "@/lib/portal/project-queries";
import { EmptyState, StatusBadge, isOverdue } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const filters = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "all", label: "All" },
] as const;

type Filter = (typeof filters)[number]["value"];

function matchesFilter(project: ProjectActivityItem, filter: Filter) {
  if (filter === "all") return project.status !== "cancelled";
  if (filter === "active") {
    return project.status === "active" || project.status === "planning" || project.status === "paused";
  }
  return project.status === "completed";
}

export function PortalProjectsList({ activity }: { activity: ClientProjectActivity }) {
  const [filter, setFilter] = useState<Filter>("active");
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
  const projects = useMemo(
    () => activity.projects.filter((project) => matchesFilter(project, filter)),
  [activity.projects, filter]);

  if (activity.projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderKanban />}
        title="No projects yet"
        description="Projects show up here once work is scheduled."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((chip) => (
          <Button
            key={chip.value}
            type="button"
            size="sm"
            variant={filter === chip.value ? "secondary" : "outline"}
            onClick={() => setFilter(chip.value)}
          >
            {chip.label}
          </Button>
        ))}
      </div>
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects match this filter.</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => {
            const percent =
              project.tasks_total === 0
                ? project.status === "completed"
                  ? 100
                  : 0
                : Math.round((project.tasks_done / project.tasks_total) * 100);
            const overdue = isOverdue(project, today);
            return (
              <Link key={project.id} href={`/portal/projects/${project.id}`} className="group block">
                <Card className="transition-colors group-hover:bg-muted/30">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <h3 className="font-semibold leading-tight text-foreground group-hover:underline">
                          {project.name}
                        </h3>
                        {project.description ? (
                          <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                        ) : null}
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                    <Progress value={percent} aria-label={`${project.name} progress`} />
                    <div className="flex flex-wrap justify-between gap-2 text-sm text-muted-foreground">
                      <span className="tabular-nums">
                        {project.tasks_total === 0
                          ? "No tasks yet"
                          : `${project.tasks_done} of ${project.tasks_total} tasks done`}
                      </span>
                      {project.due_on ? (
                        <span className={cn(overdue && "font-medium text-destructive")}>
                          Due {formatDate(project.due_on)}
                        </span>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}