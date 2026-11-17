import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { ClientDetail } from "@/components/studio/ClientDetail";
import { getClientBundle } from "@/lib/portal/queries";
import { sampleBundle, showPreview } from "@/lib/portal/sample";
import { requireAdmin } from "@/lib/portal/session";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Client · FullStack Studio",
};

export default async function ClientPage({ params }: Props) {
  const { id } = await params;
  const session = await requireAdmin();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const sample = sampleBundle(id);
      if (!sample) return <Blocked session={session} />;
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <ClientDetail {...sample} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  const result = await getClientBundle(id);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data) notFound();
  return <ClientDetail {...result.data} />;
}
