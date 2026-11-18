import Link from "next/link";
import { deleteProject } from "@/lib/portal/actions";
import { formatDate, formatUsd } from "@/lib/portal/format";
import { isUuid } from "@/lib/portal/validators";
import type { ClientRecord, ProjectListItem, ProjectRecord } from "@/lib/portal/types";
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
      <p className="mt-8 max-w-md text-sm text-muted-foreground">
        No projects yet. Add the first one for a client, then track status and budget here.
      </p>
    );
  }

  return (
    <Card className="mt-6 overflow-hidden">
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

export function PortalProjects({
  client,
  projects,
}: {
  client: ClientRecord;
  projects: ProjectRecord[];
}) {
  if (projects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No active projects yet. The studio will list them here.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardContent className="p-0">
            <div className="grid gap-4 p-6 sm:grid-cols-[1fr_auto] sm:items-start">
              <div>
                <p className="text-sm text-muted-foreground">Project</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                  {project.name}
                </h3>
                {project.description ? (
                  <p className="mt-2 max-w-xl text-sm text-muted-foreground">{project.description}</p>
                ) : null}
                <p className="mt-3 text-sm text-muted-foreground">
                  {project.started_on ? `Started ${formatDate(project.started_on)}` : "Start date not set"}
                  {project.due_on ? ` · Due ${formatDate(project.due_on)}` : ""}
                </p>
              </div>
              <StatusBadge status={project.status} />
            </div>
            <div className="border-t border-border bg-muted/40 px-6 py-4">
              <p className="text-sm text-muted-foreground">Current plan for this project</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-medium">{client.plan_name}</span>
                <span className="font-semibold">{formatUsd(client.monthly_amount)}</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
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
    return <p className="text-sm text-muted-foreground">No projects yet.</p>;
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
                <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
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
