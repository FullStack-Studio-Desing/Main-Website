import type { Metadata } from "next";
import { createClientAction } from "@/lib/portal/actions";
import { Blocked, PreviewNote } from "@/components/studio/Blocked";
import { ClientForm } from "@/components/studio/ClientForm";
import { BackLink, PageIntro } from "@/components/studio/ui";
import { showPreview } from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Add a client · FullStack Studio",
};

export default async function NewClientPage() {
  const session = await requireAdmin();
  if (session.kind !== "ready" && !(session.kind === "unconfigured" && showPreview())) {
    return <Blocked session={session} />;
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
        <BackLink href="/admin/clients">← Clients</BackLink>
        <div className="mt-6">
          <PageIntro
            eyebrow="Studio"
            title="Add a client"
            lede="The company record comes first. You create their portal login on the next screen."
          />
        </div>
        <ClientForm action={createClientAction} submitLabel="Save client" />
      </div>
    </>
  );
}
