import type { Metadata } from "next";
import { headers } from "next/headers";
import { StudioShell } from "@/components/studio/shell";
import { requireAdmin } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "CRM · FullStack Studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/projects", label: "Projects" },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAdmin();
  const pathname = (await headers()).get("x-pathname") ?? "";

  return (
    <StudioShell
      homeHref="/admin"
      pathname={pathname}
      email={session.kind === "ready" ? session.email : undefined}
      preview={session.kind === "unconfigured"}
      nav={nav}
    >
      {children}
    </StudioShell>
  );
}
