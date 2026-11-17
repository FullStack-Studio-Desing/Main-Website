import type { Metadata } from "next";
import Link from "next/link";
import { btnInverse } from "@/components/buttons";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { ClientList, ClientStats } from "@/components/studio/ClientList";
import { PageIntro } from "@/components/studio/ui";
import { listClients } from "@/lib/portal/queries";
import { sampleDirectory, showPreview } from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";
import type { DirectoryStats } from "@/lib/portal/types";

export const metadata: Metadata = {
  title: "Clients · FullStack Studio",
};

export default async function AdminPage() {
  const session = await requireAdmin();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const sample = sampleDirectory();
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <Directory stats={sample.stats} />
          </div>
          <ClientList clients={sample.clients} />
        </>
      );
    }
    return <Blocked session={session} />;
  }

  const result = await listClients();
  if (!result.ok) return <QueryError reason={result.reason} />;

  return (
    <>
      <Directory stats={result.data.stats} />
      <ClientList clients={result.data.clients} />
    </>
  );
}

function Directory({ stats }: { stats: DirectoryStats }) {
  return (
    <>
      <PageIntro
        eyebrow="Studio"
        title="Clients"
        lede="Plans, payments, and the weekly reports each client sees after they sign in."
        action={
          <Link href="/admin/clients/new" className={btnInverse}>
            Add client
          </Link>
        }
      />
      <ClientStats stats={stats} />
    </>
  );
}
