import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { PortalProjectWorkspace } from "@/components/studio/project/PortalProjectWorkspace";
import { BackLink, PageIntro, StatusBadge } from "@/components/studio/ui";
import { formatDate, formatUsd } from "@/lib/portal/format";
import { getProjectWorkspace, type ProjectWorkspace } from "@/lib/portal/project-queries";
import { sampleProjectWorkspace } from "@/lib/portal/project-sample";
import { showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";
import { isUuid } from "@/lib/portal/validators";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Project · FullStack Studio",
};

export default async function PortalProjectPage({ params }: Props) {
  const { id } = await params;
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const sample = sampleProjectWorkspace(id);
      if (!sample) return <Blocked session={session} />;
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <ProjectHeader workspace={sample} backHref="/portal/projects" />
            <PortalProjectWorkspace workspace={sample} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) notFound();
  if (!isUuid(id)) notFound();

  const result = await getProjectWorkspace(id);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data || result.data.client.id !== session.profile.client_id) notFound();

  return (
    <>
      <ProjectHeader workspace={result.data} backHref="/portal/projects" />
      <PortalProjectWorkspace workspace={result.data} />
    </>
  );
}

function ProjectHeader({
  workspace,
  backHref,
}: {
  workspace: ProjectWorkspace;
  backHref: string;
}) {
  const { project } = workspace;
  return (
    <>
      <BackLink href={backHref}>← Projects</BackLink>
      <div className="mt-6">
        <PageIntro
          title={project.name}
          lede={project.description ?? undefined}
          action={<StatusBadge status={project.status} />}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {project.started_on ? `Started ${formatDate(project.started_on)}` : "Start date not set"}
          {project.due_on ? ` · Due ${formatDate(project.due_on)}` : ""}
          {project.budget !== null ? ` · Budget ${formatUsd(project.budget)}` : ""}
        </p>
      </div>
    </>
  );
}