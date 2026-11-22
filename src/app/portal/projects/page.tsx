import type { Metadata } from "next";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { PortalProjectsList } from "@/components/studio/portal/PortalProjectsList";
import { PageIntro } from "@/components/studio/ui";
import { getClientProjectActivity } from "@/lib/portal/project-queries";
import { sampleClientProjectActivity } from "@/lib/portal/project-sample";
import { showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Projects · FullStack Studio",
};

export default async function PortalProjectsPage() {
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12 space-y-6">
            <PageIntro title="Projects" lede="Active work, progress, and due dates." />
            <PortalProjectsList activity={sampleClientProjectActivity()} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) {
    return (
      <PageIntro
        title="Projects"
        lede="Your login is not linked to a company yet. Ask the studio to finish setup."
      />
    );
  }

  const result = await getClientProjectActivity(session.profile.client_id);
  if (!result.ok) return <QueryError reason={result.reason} />;

  return (
    <div className="space-y-6">
      <PageIntro title="Projects" lede="Active work, progress, and due dates." />
      <PortalProjectsList activity={result.data} />
    </div>
  );
}