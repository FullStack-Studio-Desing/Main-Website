import type { Metadata } from "next";
import Link from "next/link";
import { FolderKanban, Plus, Repeat, Users, Wallet } from "lucide-react";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { ClientList } from "@/components/studio/ClientList";
import { PageIntro, StatCard } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { formatUsd } from "@/lib/portal/format";
import { listClients } from "@/lib/portal/queries";
import { sampleDirectory, showPreview } from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";
import type { ClientListItem, DirectoryStats } from "@/lib/portal/types";

export const metadata: Metadata = {
  title: "Clients · FullStack Studio",
};

export default async function AdminClientsPage() {
  const session = await requireAdmin();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const sample = sampleDirectory();
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <Directory stats={sample.stats} clients={sample.clients} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  const result = await listClients();
  if (!result.ok) return <QueryError reason={result.reason} />;

  return <Directory stats={result.data.stats} clients={result.data.clients} />;
}

function Directory({ stats, clients }: { stats: DirectoryStats; clients: ClientListItem[] }) {
  const mrr = clients
    .filter((client) => client.status === "active")
    .reduce((sum, client) => sum + client.monthly_amount, 0);

  return (
    <div className="space-y-6">
      <PageIntro
        title="Clients"
        lede="Companies, plans, portal logins, payments, and projects."
        action={
          <Button asChild>
            <Link href="/admin/clients/new">
              <Plus />
              Add client
            </Link>
          </Button>
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
          label="Monthly recurring"
          value={formatUsd(mrr)}
          hint="Active plans"
          icon={<Repeat />}
        />
        <StatCard
          label={`Collected in ${stats.monthLabel}`}
          value={formatUsd(stats.collected)}
          icon={<Wallet />}
        />
        <StatCard label="Open projects" value={stats.projects} icon={<FolderKanban />} />
      </div>
      <ClientList clients={clients} />
    </div>
  );
}
