"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FolderKanban } from "lucide-react";
import { deleteProject } from "@/lib/portal/actions";
import { formatDate, formatUsd, todayISO } from "@/lib/portal/format";
import { isUuid } from "@/lib/portal/validators";
import type { ClientRecord, ProjectListItem, ProjectRecord } from "@/lib/portal/types";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { FilterBar, matches } from "@/components/studio/FilterBar";
import { EmptyState, StatusBadge, isOverdue } from "@/components/studio/ui";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const statuses = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function ProjectList({ projects }: { projects: ProjectListItem[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const today = todayISO();
  const rows = useMemo(
    () =>
      projects.filter(
        (project) =>
          (status === "all" || project.status === status) &&
          matches(query, project.name, project.company_name, project.description)
      ),
    [projects, query, status]
  );

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderKanban />}
        title="No projects yet"
        description="Add the first one for a client, then track status, due dates, and budget here."
      />
    );
  }

  return (
    <div className="space-y-3">
      <FilterBar
        query={query}
        onQuery={setQuery}
        placeholder="Search projects or clients"
        status={status}
        onStatus={setStatus}
        statuses={statuses}
      />
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead className="hidden sm:table-cell">Client</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="hidden text-right md:table-cell">Budget</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-20 text-center text-sm text-muted-foreground">
                  No projects match these filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((project) => {
                const overdue = isOverdue(project, today);
                return (
                  <TableRow key={project.id}>
                    <TableCell className="min-w-[180px]">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {project.name}
                      </Link>
                      <span className="mt-0.5 block max-w-[40ch] truncate text-xs text-muted-foreground">
                        <span className="sm:hidden">{project.company_name}</span>
                        <span className="hidden sm:inline">{project.description}</span>
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Link
                        href={`/admin/clients/${project.client_id}#projects`}
                        className="text-muted-foreground hover:text-foreground hover:underline"
                      >
                        {project.company_name}
                      </Link>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "whitespace-nowrap",
                        overdue ? "font-medium text-destructive" : "text-muted-foreground"
                      )}
                    >
                      {project.due_on ? formatDate(project.due_on) : "—"}
                      {overdue ? <span className="block text-xs font-normal">Overdue</span> : null}
                    </TableCell>
                    <TableCell className="hidden text-right tabular-nums text-muted-foreground md:table-cell">
                      {project.budget !== null ? formatUsd(project.budget) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={project.status} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
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
  const today = todayISO();

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderKanban />}
        title="No projects yet"
        description="Track deliverables and retainers for this client."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Due</TableHead>
            <TableHead className="hidden text-right sm:table-cell">Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const overdue = isOverdue(project, today);
            return (
              <TableRow key={project.id}>
                <TableCell className="min-w-[160px]">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {project.name}
                  </Link>
                  {project.description ? (
                    <span className="mt-0.5 block max-w-[48ch] truncate text-xs text-muted-foreground">
                      {project.description}
                    </span>
                  ) : null}
                </TableCell>
                <TableCell
                  className={cn(
                    "whitespace-nowrap",
                    overdue ? "font-medium text-destructive" : "text-muted-foreground"
                  )}
                >
                  {project.due_on ? formatDate(project.due_on) : "—"}
                </TableCell>
                <TableCell className="hidden text-right tabular-nums text-muted-foreground sm:table-cell">
                  {project.budget !== null ? formatUsd(project.budget) : "—"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>
                <TableCell className="text-right">
                  {real ? (
                    <ConfirmForm
                      action={deleteProject.bind(null, clientId, project.id)}
                      message={`Delete project “${project.name}”?`}
                      label="Delete"
                    />
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
