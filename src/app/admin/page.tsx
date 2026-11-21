import type { Metadata } from "next";
import Link from "next/link";
import { FileText, FolderKanban, Plus, Users, Wallet } from "lucide-react";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import {
  EmptyState,
  PageIntro,
  SectionCard,
  StatCard,
  StatusBadge,
  isOverdue,
} from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatUsd, todayISO } from "@/lib/portal/format";
import { listClients, listInvoices, listPayments, listProjects } from "@/lib/portal/queries";
import {
  sampleDirectory,
  sampleInvoices,
  samplePayments,
  sampleProjects,
  showPreview,
} from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";
import type {
  ClientListItem,
  DirectoryStats,
  InvoiceListItem,
  PaymentListItem,
  ProjectListItem,
} from "@/lib/portal/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CRM · FullStack Studio",
};

const DUE_SOON_DAYS = 14;

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
              invoices={sampleInvoices()}
            />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  const [clientsResult, paymentsResult, projectsResult, invoicesResult] = await Promise.all([
    listClients(),
    listPayments(),
    listProjects(),
    listInvoices(),
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
      invoices={invoicesResult.ok ? invoicesResult.data : []}
      invoicesPending={!invoicesResult.ok}
    />
  );
}

/** Whole days from `from` to `to`, both YYYY-MM-DD. */
function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

function dueLabel(days: number) {
  if (days < 0) return `${-days} day${days === -1 ? "" : "s"} overdue`;
  if (days === 0) return "Due today";
  return `Due in ${days} day${days === 1 ? "" : "s"}`;
}

function Overview({
  stats,
  clients,
  payments,
  projects,
  invoices,
  projectsPending = false,
  invoicesPending = false,
}: {
  stats: DirectoryStats;
  clients: ClientListItem[];
  payments: PaymentListItem[];
  projects: ProjectListItem[];
  invoices: InvoiceListItem[];
  projectsPending?: boolean;
  invoicesPending?: boolean;
}) {
  const today = todayISO();
  const recentPayments = payments.slice(0, 6);
  const unpaid = invoices
    .filter((invoice) => invoice.status === "sent" || invoice.status === "failed")
    .sort((a, b) => (a.due_on ?? "9999").localeCompare(b.due_on ?? "9999"));
  const outstanding = unpaid.reduce((sum, invoice) => sum + invoice.amount, 0);
  const activeProjects = projects.filter((project) => project.status === "active");
  const planningCount = projects.filter((project) => project.status === "planning").length;
  const dueSoon = projects
    .filter(
      (project) =>
        project.due_on &&
        ["planning", "active", "paused"].includes(project.status) &&
        daysBetween(today, project.due_on) <= DUE_SOON_DAYS
    )
    .sort((a, b) => a.due_on!.localeCompare(b.due_on!));

  return (
    <div className="space-y-6">
      <PageIntro
        title="Dashboard"
        lede="Clients, money in, and work due — at a glance."
        action={
          <>
            <Button asChild variant="outline">
              <Link href="/admin/projects#new">New project</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/clients/new">
                <Plus />
                Add client
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active clients"
          value={stats.active}
          hint={`${clients.length} total`}
          icon={<Users />}
        />
        <StatCard
          label={`Collected in ${stats.monthLabel}`}
          value={formatUsd(stats.collected)}
          hint="Paid payments this month"
          icon={<Wallet />}
        />
        <StatCard
          label="Outstanding"
          value={invoicesPending ? "—" : formatUsd(outstanding)}
          hint={
            invoicesPending
              ? "Invoices table not installed"
              : `${unpaid.length} unpaid invoice${unpaid.length === 1 ? "" : "s"}`
          }
          icon={<FileText />}
        />
        <StatCard
          label="Active projects"
          value={projectsPending ? "—" : activeProjects.length}
          hint={projectsPending ? "Projects table not installed" : `${planningCount} in planning`}
          icon={<FolderKanban />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Recent payments"
          description="Latest money in across every client."
          action={<ViewAll href="/admin/payments" />}
          contentClassName="px-0 pb-2"
        >
          {recentPayments.length === 0 ? (
            <div className="px-6 pb-4">
              <EmptyState icon={<Wallet />} title="No payments yet" />
            </div>
          ) : (
            <Table>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="pl-6">
                      <Link
                        href={`/admin/clients/${payment.client_id}#payments`}
                        className="font-medium hover:underline"
                      >
                        {payment.company_name}
                      </Link>
                      <span className="block text-xs text-muted-foreground">
                        {payment.paid_on ? formatDate(payment.paid_on) : "No date"}
                        {payment.period_label ? ` · ${payment.period_label}` : ""}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell className="pr-6 text-right font-medium tabular-nums">
                      {formatUsd(payment.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>

        <SectionCard
          title="Unpaid invoices"
          description="Sent or failed, oldest due date first."
          action={<ViewAll href="/admin/invoices" />}
          contentClassName="px-0 pb-2"
        >
          {invoicesPending ? (
            <p className="px-6 pb-4 text-sm text-muted-foreground">
              Run the billing migration in Supabase to enable invoices.
            </p>
          ) : unpaid.length === 0 ? (
            <div className="px-6 pb-4">
              <EmptyState icon={<FileText />} title="Nothing outstanding" />
            </div>
          ) : (
            <Table>
              <TableBody>
                {unpaid.slice(0, 6).map((invoice) => {
                  const late = Boolean(invoice.due_on && invoice.due_on < today);
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="pl-6">
                        <Link
                          href={`/admin/clients/${invoice.client_id}#invoices`}
                          className="font-medium hover:underline"
                        >
                          {invoice.company_name}
                        </Link>
                        <span className="block text-xs text-muted-foreground">
                          {invoice.number}
                        </span>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "whitespace-nowrap text-xs",
                          late ? "font-medium text-destructive" : "text-muted-foreground"
                        )}
                      >
                        {invoice.due_on ? `Due ${formatDate(invoice.due_on)}` : "No due date"}
                      </TableCell>
                      <TableCell className="pr-6 text-right font-medium tabular-nums">
                        {formatUsd(invoice.amount)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Projects due soon"
        description={`Open projects due in the next ${DUE_SOON_DAYS} days, plus anything overdue.`}
        action={<ViewAll href="/admin/projects" />}
        contentClassName="px-0 pb-2"
      >
        {projectsPending ? (
          <p className="px-6 pb-4 text-sm text-muted-foreground">
            Run the CRM projects migration in Supabase to enable projects.
          </p>
        ) : dueSoon.length === 0 ? (
          <div className="px-6 pb-4">
            <EmptyState icon={<FolderKanban />} title="Nothing due in the next two weeks" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Project</TableHead>
                <TableHead className="hidden sm:table-cell">Client</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="pr-6 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dueSoon.slice(0, 8).map((project) => {
                const overdue = isOverdue(project, today);
                return (
                  <TableRow key={project.id}>
                    <TableCell className="pl-6">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="font-medium hover:underline"
                      >
                        {project.name}
                      </Link>
                      <span className="block text-xs text-muted-foreground sm:hidden">
                        {project.company_name}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {project.company_name}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "whitespace-nowrap",
                        overdue ? "font-medium text-destructive" : "text-muted-foreground"
                      )}
                    >
                      {formatDate(project.due_on)}
                      <span className="block text-xs font-normal">
                        {dueLabel(daysBetween(today, project.due_on!))}
                      </span>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <StatusBadge status={project.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}

function ViewAll({ href }: { href: string }) {
  return (
    <Button asChild variant="ghost" size="sm">
      <Link href={href}>View all</Link>
    </Button>
  );
}
