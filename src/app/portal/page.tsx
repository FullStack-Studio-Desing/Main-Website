import type { Metadata } from "next";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { PortalHome } from "@/components/studio/PortalHome";
import { PortalProjectActivity } from "@/components/studio/project/PortalProjectActivity";
import { PageIntro } from "@/components/studio/ui";
import { getClientProjectActivity } from "@/lib/portal/project-queries";
import { sampleClientProjectActivity } from "@/lib/portal/project-sample";
import { getPortalHome } from "@/lib/portal/queries";
import { samplePortal, showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Your plan · FullStack Studio",
};

export default async function PortalPage() {
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <PortalHome {...samplePortal()} />
            <PortalProjectActivity activity={sampleClientProjectActivity()} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) {
    return (
      <>
        <PageIntro
          eyebrow="Your plan"
          title="Not linked yet"
          lede="Ask the studio to attach this login to your company. Then your plan, payments, and reports will show up here."
        />
      </>
    );
  }

  const [result, activity] = await Promise.all([
    getPortalHome(session.profile.client_id),
    getClientProjectActivity(session.profile.client_id),
  ]);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data) {
    return (
      <PageIntro
        eyebrow="Your plan"
        title="Not linked yet"
        lede="We could not find a company for this login. Ask the studio to finish the setup."
      />
    );
  }

  return (
    <>
      <PortalHome {...result.data} />
      {activity.ok ? <PortalProjectActivity activity={activity.data} /> : null}
    </>
  );
}
