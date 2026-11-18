import Link from "next/link";
import { deleteProject } from "@/lib/portal/actions";
import { formatDate, formatUsd } from "@/lib/portal/format";
import { isUuid } from "@/lib/portal/validators";
import type { ProjectListItem, ProjectRecord } from "@/lib/portal/types";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { StatusBadge } from "@/components/studio/ui";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ProjectList({ projects }: { projects: ProjectListItem[] }) {
  if (projects.length === 0) {
    return (
      <p className="mt-12 max-w-[46ch] text-base leading-relaxed text-body">
        No projects yet. Add the first one for a client, then track status and budget here.
      </p>
    );
  }

  return (
    <Card className="mt-10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead className="hidden sm:table-cell">Client</TableHead>
            <TableHead className="hidden md:table-cell">Due</TableHead>
            <TableHead className="hidden lg:table-cell">Budget</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {project.name}
                </Link>
                {project.description ? (
                  <span className="mt-1 block max-w-[40ch] truncate text-sm text-muted-foreground">
                    {project.description}
                  </span>
                ) : null}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Link
                  href={`/admin/clients/${project.client_id}`}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  {project.company_name}
                </Link>
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                {project.due_on ? formatDate(project.due_on) : "—"}
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                {project.budget !== null ? formatUsd(project.budget) : "—"}
              </TableCell>
              <TableCell className="text-right">
                <StatusBadge status={project.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export function ClientProjects({
  clientId,
  projects,
}: {
  clientId: string;
  projects: ProjectRecord[];
}) {
  const real = isUuid(clientId);

  if (projects.length === 0) {
    return <p className="text-base text-body">No projects yet.</p>;
  }

  return (
    <Card>
      <CardContent className="divide-y divide-border p-0">
        {projects.map((project) => (
          <div
            key={project.id}
            className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
          >
            <div>
              <Link
                href={`/admin/projects/${project.id}`}
                className="text-base font-medium text-foreground hover:underline"
              >
                {project.name}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {project.due_on ? `Due ${formatDate(project.due_on)}` : "No due date"}
                {project.budget !== null ? ` · ${formatUsd(project.budget)}` : ""}
              </p>
              {project.description ? (
                <p className="mt-2 text-sm leading-relaxed text-body">{project.description}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge status={project.status} />
              {real ? (
                <ConfirmForm
                  action={deleteProject.bind(null, clientId, project.id)}
                  message={`Delete project “${project.name}”?`}
                  label="Delete"
                />
              ) : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
