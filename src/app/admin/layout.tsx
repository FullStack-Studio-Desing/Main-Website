import type { Metadata } from "next";
import { headers } from "next/headers";
import { StudioShell, type StudioNavItem } from "@/components/studio/shell";
import { Toaster } from "@/components/ui/sonner";
import { requireAdmin } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "CRM · FullStack Studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const nav: StudioNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/clients", label: "Clients", icon: "clients" },
  { href: "/admin/projects", label: "Projects", icon: "projects" },
  { href: "/admin/invoices", label: "Invoices", icon: "invoices" },
  { href: "/admin/payments", label: "Payments", icon: "payments" },
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
      <Toaster theme="light" position="top-right" />
    </StudioShell>
  );
}
