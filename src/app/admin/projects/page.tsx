import type { Metadata } from "next";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { ProjectForm } from "@/components/studio/ProjectForm";
import { ProjectList } from "@/components/studio/ProjectList";
import { PageIntro, Section } from "@/components/studio/ui";
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
    <>
      <PageIntro
        eyebrow="CRM"
        title="Projects"
        lede="Deliverables and retainers per client — status, due dates, and budget."
      />
      <ProjectList projects={projects} />
      <Section id="new" title="Add project" lede="Attach a project to a client.">
        <ProjectForm
          action={createProjectGlobal}
          clients={clients}
          showClientSelect
          showSeparator={false}
        />
      </Section>
    </>
  );
}
