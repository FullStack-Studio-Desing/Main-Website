import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { ProjectForm } from "@/components/studio/ProjectForm";
import { ProjectWorkspace } from "@/components/studio/project/ProjectWorkspace";
import { BackLink, PageIntro } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { deleteProjectAndLeave, updateProject } from "@/lib/portal/actions";
import { getProjectWorkspace, type ProjectWorkspace as Workspace } from "@/lib/portal/project-queries";
import { listAdminTickets } from "@/lib/portal/ticket-queries";
import { sampleAdminTickets } from "@/lib/portal/ticket-sample";
import { sampleProjectWorkspace } from "@/lib/portal/project-sample";
import { showPreview } from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";
import type { TicketListItem } from "@/lib/portal/types";
import { sampleTickets } from "@/lib/portal/ticket-sample";
import { isUuid } from "@/lib/portal/validators";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Project · FullStack Studio",
};

export default async function AdminProjectPage({ params }: Props) {
  const { id } = await params;
  const session = await requireAdmin();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const sample = sampleProjectWorkspace(id);
      if (!sample) return <Blocked session={session} />;
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <ProjectView
              workspace={sample}
              tickets={sampleTickets().filter((ticket) => ticket.project_id === id)}
              ticketsPending={false}
            />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!isUuid(id)) notFound();
  const [result, ticketsResult] = await Promise.all([
    getProjectWorkspace(id),
    listAdminTickets({ projectId: id, limit: 50 }),
  ]);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data) notFound();
  const tickets = ticketsResult.ok ? ticketsResult.data : [];
  const ticketsPending = !ticketsResult.ok && ticketsResult.reason === "schema";
  return <ProjectView workspace={result.data} tickets={tickets} ticketsPending={ticketsPending} />;
}

function ProjectView({
  workspace,
  tickets = [],
  ticketsPending = false,
}: {
  workspace: Workspace;
  tickets?: TicketListItem[];
  ticketsPending?: boolean;
}) {
  const { project, client } = workspace;

  return (
    <>
      <BackLink href="/admin/projects">← Projects</BackLink>
      <div className="mt-6">
        <PageIntro
          eyebrow={client.company_name}
          title={project.name}
          lede={project.description ?? undefined}
          action={
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/clients/${client.id}`}>View client</Link>
              </Button>
              <ConfirmForm
                action={deleteProjectAndLeave.bind(null, client.id, project.id)}
                message={`Delete project “${project.name}” with its tasks and updates? This cannot be undone.`}
                label="Delete project"
              />
            </>
          }
        />
      </div>
      <ProjectWorkspace
        workspace={workspace}
        tickets={tickets}
        ticketsPending={ticketsPending}
        projectForm={
          <ProjectForm
            action={updateProject.bind(null, project.id, client.id)}
            project={project}
            submitLabel="Save project"
            showSeparator={false}
          />
        }
      />
    </>
  );
}
