import Link from "next/link";
import { formatDate, formatUsd } from "@/lib/portal/format";
import type { ClientListItem, DirectoryStats } from "@/lib/portal/types";
import { StatusBadge } from "@/components/studio/ui";

export function ClientStats({ stats }: { stats: DirectoryStats }) {
  const items = [
    { label: "Active", value: String(stats.active) },
    { label: `Collected in ${stats.monthLabel}`, value: formatUsd(stats.collected) },
    { label: `Reports in ${stats.monthLabel}`, value: String(stats.reports) },
  ];

  return (
    <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-sm text-muted">{item.label}</dt>
          <dd className="mt-1 text-lg font-medium text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ClientList({ clients }: { clients: ClientListItem[] }) {
  if (clients.length === 0) {
    return (
      <p className="mt-12 max-w-[46ch] text-base leading-relaxed text-body">
        No clients yet. Add the first company, then create their portal login from the client page.
      </p>
    );
  }

  return (
    <div className="mt-10 border-t border-rule">
      {clients.map((client) => (
        <Link
          key={client.id}
          href={`/admin/clients/${client.id}`}
          className="block border-b border-rule py-5 transition-colors duration-200 hover:bg-white"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-medium text-ink">{client.company_name}</p>
              <p className="mt-1 text-sm text-muted">
                {client.contact_name} · {client.plan_name} · {formatUsd(client.monthly_amount)}/mo
              </p>
            </div>
            <StatusBadge status={client.status} />
          </div>
          <p className="mt-3 text-sm text-body">
            {client.latest_payment
              ? `${formatUsd(client.latest_payment.amount)} · ${
                  client.latest_payment.status.charAt(0).toUpperCase() +
                  client.latest_payment.status.slice(1)
                }${
                  client.latest_payment.paid_on
                    ? ` · ${formatDate(client.latest_payment.paid_on)}`
                    : ""
                }`
              : "No payments yet"}
          </p>
        </Link>
      ))}
    </div>
  );
}
