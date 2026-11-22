import type { Metadata } from "next";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { PortalOverviewDashboard } from "@/components/studio/portal/PortalOverview";
import { PageIntro } from "@/components/studio/ui";
import { getPortalOverview } from "@/lib/portal/portal-overview";
import { sampleClientProjectActivity } from "@/lib/portal/project-sample";
import { samplePortal, showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Overview · FullStack Studio",
};

export default async function PortalPage() {
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const home = samplePortal();
      const activity = sampleClientProjectActivity();
      const previewOverview = {
        client: home.client,
        amountDue: home.invoices
          .filter((i) => i.status === "sent")
          .reduce((s, i) => s + i.amount, 0),
        unpaidCount: home.invoices.filter((i) => i.status === "sent").length,
        oldestUnpaid: home.invoices.find((i) => i.status === "sent") ?? null,
        activeProjects: home.projects.filter((p) => p.status === "active").length,
        openTasks: activity.projects.reduce((n, p) => n + p.tasks_open, 0),
        openTickets: 1,
        awaitingYou: 1,
        paidThisYear: home.payments.reduce((s, p) => s + p.amount, 0),
        refundedThisYear: 0,
        projectProgress: activity.projects.slice(0, 3),
        recentUpdates: activity.updates.slice(0, 5),
      };
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <PortalOverviewDashboard overview={previewOverview} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) {
    return (
      <PageIntro
        eyebrow="Welcome back"
        title="Not linked yet"
        lede="Ask the studio to attach this login to your company. Then your plan, payments, and reports will show up here."
      />
    );
  }

  const result = await getPortalOverview(session.profile.client_id);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data) {
    return (
      <PageIntro
        eyebrow="Welcome back"
        title="Not linked yet"
        lede="We could not find a company for this login. Ask the studio to finish the setup."
      />
    );
  }

  return <PortalOverviewDashboard overview={result.data} />;
}