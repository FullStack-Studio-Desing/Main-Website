import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Mail, Phone, UserRound } from "lucide-react";
import { Blocked, PreviewNote, QueryError } from "@/components/studio/Blocked";
import { EmptyState, PageIntro, SectionCard, StatusBadge } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatUsd } from "@/lib/portal/format";
import { getClientBundle } from "@/lib/portal/queries";
import { sampleBundle, showPreview } from "@/lib/portal/sample";
import { requireClient } from "@/lib/portal/session";
import type { ClientContact, ClientPerson, ClientRecord } from "@/lib/portal/types";

export const metadata: Metadata = {
  title: "Company · FullStack Studio",
};

export default async function PortalCompanyPage() {
  const session = await requireClient();

  if (session.kind !== "ready") {
    if (session.kind === "unconfigured" && showPreview()) {
      const bundle = sampleBundle("sample-northwind");
      if (!bundle) return <Blocked session={session} />;
      return (
        <>
          <Blocked session={session} />
          <PreviewNote />
          <div className="mt-12">
            <CompanyProfile client={bundle.client} />
          </div>
        </>
      );
    }
    return <Blocked session={session} />;
  }

  if (!session.profile.client_id) {
    return <PageIntro title="Company" lede="Your login is not linked to a company yet." />;
  }

  const result = await getClientBundle(session.profile.client_id);
  if (!result.ok) return <QueryError reason={result.reason} />;
  if (!result.data) {
    return <PageIntro title="Company" lede="We could not find your company record." />;
  }

  return <CompanyProfile client={result.data.client} />;
}

function CompanyProfile({ client }: { client: ClientRecord }) {
  const contacts = client.contacts ?? [];
  const people = client.people ?? [];

  return (
    <div className="space-y-6">
      <PageIntro
        title={client.company_name}
        lede="Your company profile and contacts on file with the studio."
        action={<StatusBadge status={client.status} />}
      />

      <Card>
        <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
          <ProfileField label="Primary contact" value={client.contact_name ?? "—"} />
          <ProfileField label="Email" value={client.email} />
          <ProfileField label="Phone" value={client.phone ?? "—"} />
          <ProfileField
            label="Plan"
            value={`${client.plan_name} · ${formatUsd(client.monthly_amount)}/mo`}
          />
          <ProfileField
            label="Start date"
            value={client.started_on ? formatDate(client.started_on) : "Not set"}
          />
          <ProfileField label="Tax ID" value={maskTaxId(client.tax_id_type, client.tax_id_number)} />
        </CardContent>
      </Card>

      <SectionCard title="Contacts" description="Extra emails and phone numbers we can reach.">
        {contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No extra contacts on file.</p>
        ) : (
          <ul className="divide-y divide-border">
            {contacts.map((contact) => (
              <ContactRow key={contact.id} contact={contact} />
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="People" description="Who we work with day to day.">
        {people.length === 0 ? (
          <EmptyState icon={<UserRound />} title="No people listed" />
        ) : (
          <ul className="divide-y divide-border">
            {people.map((person) => (
              <PersonRow key={person.id} person={person} />
            ))}
          </ul>
        )}
      </SectionCard>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Need to change something?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Open a support ticket and we will update your profile.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/portal/tickets">Contact support</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ContactRow({ contact }: { contact: ClientContact }) {
  const Icon = contact.kind === "email" ? Mail : Phone;
  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{contact.value}</p>
        <p className="text-xs text-muted-foreground">
          {contact.label ?? (contact.kind === "email" ? "Email" : "Phone")}
        </p>
      </div>
    </li>
  );
}

function PersonRow({ person }: { person: ClientPerson }) {
  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <Building2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{person.name}</p>
        <p className="text-xs text-muted-foreground">
          {person.role}
          {person.email ? ` · ${person.email}` : ""}
          {person.phone ? ` · ${person.phone}` : ""}
        </p>
      </div>
    </li>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

function maskTaxId(type: ClientRecord["tax_id_type"], number: string | null) {
  if (!number) return "Not on file";
  const label = type ? `${type} ` : "";
  if (number.length <= 4) return `${label}${number}`;
  return `${label}${"•".repeat(Math.min(number.length - 4, 12))}${number.slice(-4)}`;
}