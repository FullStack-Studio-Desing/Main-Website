import type { Metadata } from "next";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { FormDialog } from "@/components/studio/FormDialog";
import { ProjectForm } from "@/components/studio/ProjectForm";
import { ProjectList } from "@/components/studio/ProjectList";
import { PageIntro } from "@/components/studio/ui";
import { createProjectGlobal } from "@/lib/portal/actions";
import { listClientOptions, listProjects } from "@/lib/portal/queries";
import {
  sampleClientOptions,
  sampleProjects,
  showPreview,
} from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Projects · FullStack Studio",
};

export default async function AdminProjectsPage() {
  const session = await requireAdmin();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <ProjectsView projects={sampleProjects()} clients={sampleClientOptions()} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  const [projectsResult, clientsResult] = await Promise.all([
    listProjects(),
    listClientOptions(),
  ]);
  if (!projectsResult.ok) return <QueryError reason={projectsResult.reason} />;
  if (!clientsResult.ok) return <QueryError reason={clientsResult.reason} />;

  return <ProjectsView projects={projectsResult.data} clients={clientsResult.data} />;
}

function ProjectsView({
  projects,
  clients,
}: {
  projects: Parameters<typeof ProjectList>[0]["projects"];
  clients: { id: string; company_name: string }[];
}) {
  return (
    <div className="space-y-6">
      <PageIntro
        title="Projects"
        lede="Deliverables and retainers per client — status, due dates, and budget."
        action={
          <FormDialog
            key={projects.length}
            hash="new"
            trigger="New project"
            title="New project"
            description="Attach a project to a client. You land on their page after saving."
          >
            <ProjectForm
              action={createProjectGlobal}
              clients={clients}
              showClientSelect
              showSeparator={false}
            />
          </FormDialog>
        }
      />
      <ProjectList projects={projects} />
    </div>
  );
}
