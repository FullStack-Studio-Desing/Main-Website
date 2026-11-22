import type { Metadata } from "next";
import { Blocked, PreviewNote } from "@/components/studio/Blocked";
import { TicketFormPlaceholder } from "@/components/studio/tickets/TicketFormPlaceholder";
import { BackLink, PageIntro } from "@/components/studio/ui";
import { samplePortal, showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Open ticket · FullStack Studio",
};

export default async function PortalNewTicketPage() {
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const { projects } = samplePortal();
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12 space-y-6">
            <BackLink href="/portal/tickets">Back to Support</BackLink>
            <PageIntro title="Open a ticket" lede="Describe what you need. The studio gets an email right away." />
            <TicketFormPlaceholder projects={projects} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) {
    return (
      <PageIntro
        title="Open a ticket"
        lede="This login is not linked to a company yet. Ask the studio to finish the setup."
      />
    );
  }

  const supabase = await createClient();
  const projectsRes = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", session.profile.client_id)
    .order("status", { ascending: true })
    .order("name", { ascending: true });

  const projects = projectsRes.data ?? [];

  return (
    <div className="space-y-6">
      <BackLink href="/portal/tickets">Back to Support</BackLink>
      <PageIntro title="Open a ticket" lede="Describe what you need. The studio gets an email right away." />
      <TicketFormPlaceholder projects={projects} />
    </div>
  );
}