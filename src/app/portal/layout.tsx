import type { Metadata } from "next";
import { headers } from "next/headers";
import { StudioShell } from "@/components/studio/shell";
import { Toaster } from "@/components/ui/sonner";
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

  return (
    <StudioShell
      homeHref="/portal"
      pathname={pathname}
      email={session.kind === "ready" ? session.email : undefined}
      preview={session.kind === "unconfigured"}
      nav={[{ href: "/portal", label: "Overview", icon: "dashboard" }]}
    >
      {children}
      <Toaster theme="light" position="top-right" />
    </StudioShell>
  );
}
