import { FolderKanban, Newspaper } from "lucide-react";
import { formatDate } from "@/lib/portal/format";
import type { ClientProjectActivity } from "@/lib/portal/project-queries";
import { EmptyState, SectionCard, StatusBadge } from "@/components/studio/ui";
import { UpdateTimeline, UpdateTimelineItem } from "@/components/studio/project/UpdateTimeline";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Read-only project progress and client-visible updates for the portal.
export function PortalProjectActivity({
  activity,
  updatesLimit = 10,
}: {
  activity: ClientProjectActivity;
  updatesLimit?: number;
}) {
  const { projects, updates } = activity;
  const showProjectName = projects.length > 1;

  return (
    <div className="space-y-6">
      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban />}
          title="No projects yet"
          description="Projects show up here once work is scheduled."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => {
            const percent =
              project.tasks_total === 0
                ? project.status === "completed"
                  ? 100
                  : 0
                : Math.round((project.tasks_done / project.tasks_total) * 100);
            return (
              <Card key={project.id}>
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-semibold leading-tight text-foreground">
                        {project.name}
                      </h3>
                      {project.description ? (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {project.description}
                        </p>
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
                    {project.due_on ? <span>Due {formatDate(project.due_on)}</span> : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <SectionCard title="Project updates" description="Progress notes from the studio.">
        {updates.length === 0 ? (
          <EmptyState icon={<Newspaper />} title="No updates yet" />
        ) : (
          <UpdateTimeline>
            {updates.slice(0, updatesLimit).map((update) => (
              <UpdateTimelineItem
                key={update.id}
                update={update}
                eyebrow={showProjectName ? update.project_name : undefined}
              />
            ))}
          </UpdateTimeline>
        )}
      </SectionCard>
    </div>
  );
}
