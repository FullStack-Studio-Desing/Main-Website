import type { Metadata } from "next";
import Link from "next/link";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { ClientList, ClientStats } from "@/components/studio/ClientList";
import { PageIntro } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listClients, listPayments, listProjects } from "@/lib/portal/queries";
import {
  sampleDirectory,
  samplePayments,
  sampleProjects,
  showPreview,
} from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";
import { formatDate, formatUsd } from "@/lib/portal/format";
import type { DirectoryStats, PaymentListItem, ProjectListItem } from "@/lib/portal/types";
import { StatusBadge } from "@/components/studio/ui";

export const metadata: Metadata = {
  title: "CRM · FullStack Studio",
};

export default async function AdminOverviewPage() {
  const session = await requireAdmin();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const sample = sampleDirectory();
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <Overview
              stats={sample.stats}
              clients={sample.clients}
              payments={samplePayments()}
              projects={sampleProjects()}
            />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  const [clientsResult, paymentsResult, projectsResult] = await Promise.all([
    listClients(),
    listPayments(),
    listProjects(),
  ]);
  if (!clientsResult.ok) return <QueryError reason={clientsResult.reason} />;
  if (!paymentsResult.ok) return <QueryError reason={paymentsResult.reason} />;

  return (
    <Overview
      stats={clientsResult.data.stats}
      clients={clientsResult.data.clients}
      payments={paymentsResult.data}
      projects={projectsResult.ok ? projectsResult.data : []}
      projectsPending={!projectsResult.ok}
    />
  );
}

function Overview({
  stats,
  clients,
  payments,
  projects,
  projectsPending = false,
}: {
  stats: DirectoryStats;
  clients: Parameters<typeof ClientList>[0]["clients"];
  payments: PaymentListItem[];
  projects: ProjectListItem[];
  projectsPending?: boolean;
}) {
  const recentPayments = payments.slice(0, 5);
  const openProjects = projects
    .filter((project) => project.status === "active" || project.status === "planning")
    .slice(0, 5);

  return (
    <>
      <PageIntro
        eyebrow="Studio CRM"
        title="Overview"
        lede="Clients, payments, and projects in one place."
        action={
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="brand">
              <Link href="/admin/clients/new">Add client</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/projects">New project</Link>
            </Button>
          </div>
        }
      />
      <ClientStats stats={stats} />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">Open projects</CardTitle>
            <Button asChild variant="link" className="h-auto p-0">
              <Link href="/admin/projects">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectsPending ? (
              <p className="text-sm text-muted-foreground">
                Run the CRM projects migration in Supabase to enable projects.
              </p>
            ) : openProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open projects.</p>
            ) : (
              openProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  className="flex items-start justify-between gap-3"
                >
                  <span>
                    <span className="block font-medium text-foreground">{project.name}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {project.company_name}
                      {project.due_on ? ` · due ${formatDate(project.due_on)}` : ""}
                    </span>
                  </span>
                  <StatusBadge status={project.status} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">Recent payments</CardTitle>
            <Button asChild variant="link" className="h-auto p-0">
              <Link href="/admin/payments">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            ) : (
              recentPayments.map((payment) => (
                <Link
                  key={payment.id}
                  href={`/admin/clients/${payment.client_id}#payments`}
                  className="flex items-start justify-between gap-3"
                >
                  <span>
                    <span className="block font-medium text-foreground">
                      {formatUsd(payment.amount)}
                      {payment.period_label ? ` · ${payment.period_label}` : ""}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {payment.company_name}
                      {payment.paid_on ? ` · ${formatDate(payment.paid_on)}` : ""}
                    </span>
                  </span>
                  <StatusBadge status={payment.status} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-[28px] uppercase leading-none tracking-[-0.02em]">
            Clients
          </h2>
          <Button asChild variant="link" className="h-auto p-0">
            <Link href="/admin/clients">View all</Link>
          </Button>
        </div>
        <ClientList clients={clients.slice(0, 8)} />
      </div>
    </>
  );
}
