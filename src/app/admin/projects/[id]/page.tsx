import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { ProjectForm } from "@/components/studio/ProjectForm";
import { BackLink, PageIntro } from "@/components/studio/ui";
import { deleteProjectAndLeave, updateProject } from "@/lib/portal/actions";
import { getProject } from "@/lib/portal/queries";
import { sampleProject, showPreview } from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";
import type { ClientRecord, ProjectRecord } from "@/lib/portal/types";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Project · FullStack Studio",
};

export default async function AdminProjectPage({ params }: Props) {
  const { id } = await params;
  const session = await requireAdmin();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const sample = sampleProject(id);
      if (!sample) return <Blocked session={session} />;
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <ProjectView {...sample} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  const result = await getProject(id);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data) notFound();
  return <ProjectView {...result.data} />;
}

function ProjectView({
  project,
  client,
}: {
  project: ProjectRecord;
  client: ClientRecord;
}) {
  return (
    <>
      <BackLink href="/admin/projects">← Projects</BackLink>
      <div className="mt-6">
        <PageIntro
          eyebrow={client.company_name}
          title={project.name}
          lede={project.description ?? undefined}
          action={
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/admin/clients/${client.id}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                View client
              </Link>
              <ConfirmForm
                action={deleteProjectAndLeave.bind(null, client.id, project.id)}
                message={`Delete project “${project.name}”?`}
                label="Delete"
              />
            </div>
          }
        />
      </div>
      <ProjectForm
        action={updateProject.bind(null, project.id, client.id)}
        project={project}
        submitLabel="Save project"
        showSeparator={false}
      />
    </>
  );
}
