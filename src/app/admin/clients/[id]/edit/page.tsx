import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteClient, updateClientAction } from "@/lib/portal/actions";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { ClientForm } from "@/components/studio/ClientForm";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { BackLink, PageIntro } from "@/components/studio/ui";
import { Card } from "@/components/ui/card";
import { getClientBundle } from "@/lib/portal/queries";
import { sampleBundle, showPreview } from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";
import { isUuid } from "@/lib/portal/validators";
import type { ClientRecord } from "@/lib/portal/types";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Edit client · FullStack Studio",
};

export default async function EditClientPage({ params }: Props) {
  const { id } = await params;
  const session = await requireAdmin();
  let client: ClientRecord | null = null;

  if (session.kind !== "ready") {
    if (!(session.kind === "unconfigured" && showPreview())) {
      return <Blocked session={session} />;
    }
    client = sampleBundle(id)?.client ?? null;
    if (!client) return <Blocked session={session} />;
  } else {
    const result = await getClientBundle(id);
    if (!result.ok) return <QueryError reason={result.reason} />;
    if (!result.data) notFound();
    client = result.data.client;
  }

  return (
    <>
      {session.kind === "unconfigured" ? (
        <>
          <Blocked session={session} />
          <PreviewNote />
        </>
      ) : null}
      <div className={session.kind === "unconfigured" ? "mt-12" : undefined}>
        <BackLink href={`/admin/clients/${client.id}`}>← {client.company_name}</BackLink>
        <div className="mt-4">
          <PageIntro eyebrow={client.company_name} title="Edit client" />
        </div>
        <ClientForm
          action={updateClientAction.bind(null, client.id)}
          client={client}
          submitLabel="Save changes"
        />
        {isUuid(client.id) ? (
          <Card className="mt-6 flex flex-col gap-4 border-destructive/40 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-semibold">Delete client</p>
              <p className="text-sm text-muted-foreground">
                Removes the company and all of their projects, payments, and reports.
              </p>
            </div>
            <ConfirmForm
              action={deleteClient.bind(null, client.id)}
              message={`Delete ${client.company_name} and all of their projects, payments, and reports? This cannot be undone.`}
              label="Delete client"
            />
          </Card>
        ) : null}
      </div>
    </>
  );
}
