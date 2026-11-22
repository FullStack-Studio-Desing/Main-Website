import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSchemaError } from "@/lib/portal/errors";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ticketCounts } from "@/lib/portal/ticket-queries";
import type { StudioNavItem } from "@/components/studio/shell";

export type PortalNavCounts = {
  unpaidInvoices: number;
  unreadTickets: number;
};

export async function getPortalNavCounts(clientId: string): Promise<PortalNavCounts> {
  if (!isSupabaseConfigured()) {
    return { unpaidInvoices: 0, unreadTickets: 0 };
  }
  try {
    const supabase = await createClient();
    const invoicesRes = await supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("client_id", clientId)
      .in("status", ["sent", "failed"]);
    if (invoicesRes.error && !isSchemaError(invoicesRes.error)) {
      console.error("[portal-nav]", invoicesRes.error.message);
    }
    let unreadTickets = 0;
    const ticketRes = await ticketCounts({ clientId });
    if (ticketRes.ok) unreadTickets = ticketRes.data.clientUnread;

    return {
      unpaidInvoices: invoicesRes.error ? 0 : (invoicesRes.count ?? 0),
      unreadTickets,
    };
  } catch {
    return { unpaidInvoices: 0, unreadTickets: 0 };
  }
}

export function buildPortalNav(counts: PortalNavCounts): StudioNavItem[] {
  const badge = (value: number) => (value > 0 ? value : undefined);
  return [
    { href: "/portal", label: "Overview", icon: "dashboard" },
    { href: "/portal/projects", label: "Projects", icon: "projects" },
    {
      href: "/portal/tickets",
      label: "Support",
      icon: "support",
      badge: badge(counts.unreadTickets),
    },
    {
      href: "/portal/invoices",
      label: "Invoices",
      icon: "invoices",
      badge: badge(counts.unpaidInvoices),
    },
    { href: "/portal/payments", label: "Payments", icon: "payments" },
    { href: "/portal/payment-methods", label: "Payment methods", icon: "wallet" },
    { href: "/portal/reports", label: "Reports", icon: "reports" },
    { href: "/portal/company", label: "Company", icon: "company" },
  ];
}