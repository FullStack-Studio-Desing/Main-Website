import type { Metadata } from "next";
import { headers } from "next/headers";
import { StudioShell } from "@/components/studio/shell";
import { Toaster } from "@/components/ui/sonner";
import { buildPortalNav, getPortalNavCounts } from "@/lib/portal/portal-nav";
import { samplePortal, showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Your plan · FullStack Studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireClient();
  const pathname = (await headers()).get("x-pathname") ?? "";

  let counts = { unpaidInvoices: 0, unreadTickets: 0 };
  if (session.kind === "ready" && session.profile.client_id) {
    counts = await getPortalNavCounts(session.profile.client_id);
  } else if (session.kind === "unconfigured" && showPreview()) {
    const unpaid = samplePortal().invoices.filter(
      (invoice) => invoice.status === "sent" || invoice.status === "failed"
    ).length;
    counts = { unpaidInvoices: unpaid, unreadTickets: 0 };
  }

  return (
    <StudioShell
      homeHref="/portal"
      pathname={pathname}
      email={session.kind === "ready" ? session.email : undefined}
      preview={session.kind === "unconfigured"}
      nav={buildPortalNav(counts)}
    >
      {children}
      <Toaster theme="light" position="top-right" />
    </StudioShell>
  );
}
