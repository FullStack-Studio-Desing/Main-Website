"use client";

import { useActionState, useState } from "react";
import type {
  ActionState,
  ClientContact,
  ClientContactKind,
  ClientPerson,
  ClientRecord,
  ClientStatus,
  PlanId,
} from "@/lib/portal/types";
import { portalPlans } from "@/lib/portal/plans";
import { clientPersonRoles } from "@/lib/portal/validators";
import { SubmitButton } from "@/components/studio/SubmitButton";
import { Alert, Field } from "@/components/studio/ui";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

const statuses: { value: ClientStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "archived", label: "Archived" },
];

type ContactDraft = {
  key: string;
  kind: ClientContactKind;
  value: string;
  label: string;
};

type PersonDraft = {
  key: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};

function newKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function seedContacts(client?: ClientRecord): ContactDraft[] {
  const source = client?.contacts?.length
    ? client.contacts
    : client
      ? ([
          client.email
            ? ({ kind: "email", value: client.email, label: null } as Pick<
                ClientContact,
                "kind" | "value" | "label"
              >)
            : null,
          client.phone
            ? ({ kind: "phone", value: client.phone, label: null } as Pick<
                ClientContact,
                "kind" | "value" | "label"
              >)
            : null,
        ].filter(Boolean) as Pick<ClientContact, "kind" | "value" | "label">[])
      : [];

  if (source.length === 0) {
    return [
      { key: newKey(), kind: "email", value: "", label: "" },
      { key: newKey(), kind: "phone", value: "", label: "" },
    ];
  }

  return source.map((contact) => ({
    key: newKey(),
    kind: contact.kind,
    value: contact.value,
    label: contact.label ?? "",
  }));
}

function seedPeople(client?: ClientRecord): PersonDraft[] {
  const source = client?.people?.length
    ? client.people
    : client
      ? ([
          {
            name: client.contact_name,
            email: client.email,
            phone: client.phone,
            role: "Owner",
          } as Pick<ClientPerson, "name" | "email" | "phone" | "role">,
        ])
      : [];

  if (source.length === 0) {
    return [{ key: newKey(), name: "", email: "", phone: "", role: "Owner" }];
  }

  return source.map((person) => ({
    key: newKey(),
    name: person.name,
    email: person.email ?? "",
    phone: person.phone ?? "",
    role: person.role,
  }));
}

export function ClientForm({
  action,
  client,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  client?: ClientRecord;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, null);
  const [planId, setPlanId] = useState<PlanId>(client?.plan_id ?? "growth");
  const [planName, setPlanName] = useState(client?.plan_name ?? "Growth");
  const [amount, setAmount] = useState(String(client?.monthly_amount ?? 1500));
  const [contacts, setContacts] = useState<ContactDraft[]>(() => seedContacts(client));
  const [people, setPeople] = useState<PersonDraft[]>(() => seedPeople(client));

  function onPlan(id: PlanId) {
    setPlanId(id);
    const plan = portalPlans.find((item) => item.id === id);
    if (!plan) return;
    if (plan.amount > 0) setAmount(String(plan.amount));
    if (id !== "custom") setPlanName(plan.name);
  }

  return (
    <form action={formAction} className="mt-6 space-y-6">
      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company and plan</CardTitle>
          <CardDescription>What the client pays and how they are billed.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field label="Company">
            <Input
              name="company_name"
              required
              maxLength={120}
              defaultValue={client?.company_name ?? ""}
            />
          </Field>
          <Field label="Status">
            <NativeSelect name="status" defaultValue={client?.status ?? "active"}>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Plan">
            <NativeSelect
              name="plan_id"
              value={planId}
              onChange={(event) => onPlan(event.target.value as PlanId)}
            >
              {portalPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                  {plan.amount > 0 ? ` · $${plan.amount.toLocaleString("en-US")}` : ""}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Plan name" hint="This is the name the client sees on their plan.">
            <Input
              name="plan_name"
              required
              maxLength={80}
              value={planName}
              onChange={(event) => setPlanName(event.target.value)}
            />
          </Field>
          <Field label="Monthly amount">
            <Input
              name="monthly_amount"
              type="number"
              min={0}
              step="0.01"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </Field>
          <Field label="Started">
            <Input name="started_on" type="date" defaultValue={client?.started_on ?? ""} />
          </Field>
          <Field label="Tax ID type" hint="Used for Mercado Pago card-on-file charges.">
            <NativeSelect name="tax_id_type" defaultValue={client?.tax_id_type ?? ""}>
              <option value="">Not set</option>
              <option value="RFC">RFC</option>
              <option value="CURP">CURP</option>
            </NativeSelect>
          </Field>
          <Field label="RFC / CURP">
            <Input
              name="tax_id_number"
              maxLength={40}
              defaultValue={client?.tax_id_number ?? ""}
              autoComplete="off"
            />
          </Field>
          <Field label="Notes" hint="Only the studio sees this." className="sm:col-span-2">
            <Textarea
              name="billing_notes"
              maxLength={4000}
              defaultValue={client?.billing_notes ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row flex-wrap items-start justify-between gap-3 space-y-0">
          <div className="space-y-1.5">
            <CardTitle className="text-base">Contact methods</CardTitle>
            <CardDescription>
              Company emails and phones — general inbox, office line, etc.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setContacts((rows) => [
                ...rows,
                { key: newKey(), kind: "email", value: "", label: "" },
              ])
            }
          >
            <Plus />
            Add contact
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {contacts.map((contact, index) => (
            <div
              key={contact.key}
              className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-[8rem_1fr_1fr_auto]"
            >
              <Field label="Type">
                <NativeSelect
                  name="contact_kind"
                  value={contact.kind}
                  onChange={(event) => {
                    const kind = event.target.value as ClientContactKind;
                    setContacts((rows) =>
                      rows.map((row, i) => (i === index ? { ...row, kind } : row)),
                    );
                  }}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </NativeSelect>
              </Field>
              <Field label={contact.kind === "email" ? "Email" : "Phone"}>
                <Input
                  name="contact_value"
                  type={contact.kind === "email" ? "email" : "tel"}
                  maxLength={120}
                  value={contact.value}
                  onChange={(event) => {
                    const value = event.target.value;
                    setContacts((rows) =>
                      rows.map((row, i) => (i === index ? { ...row, value } : row)),
                    );
                  }}
                  autoComplete="off"
                />
              </Field>
              <Field label="Label" hint="Optional">
                <Input
                  name="contact_label"
                  maxLength={80}
                  placeholder="General, Office…"
                  value={contact.label}
                  onChange={(event) => {
                    const label = event.target.value;
                    setContacts((rows) =>
                      rows.map((row, i) => (i === index ? { ...row, label } : row)),
                    );
                  }}
                />
              </Field>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  disabled={contacts.length <= 1}
                  onClick={() =>
                    setContacts((rows) => rows.filter((_, i) => i !== index))
                  }
                >
                  <Trash2 />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row flex-wrap items-start justify-between gap-3 space-y-0">
          <div className="space-y-1.5">
            <CardTitle className="text-base">People</CardTitle>
            <CardDescription>
              Named contacts at the company. The first person is used as the primary contact.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setPeople((rows) => [
                ...rows,
                { key: newKey(), name: "", email: "", phone: "", role: "Owner" },
              ])
            }
          >
            <Plus />
            Add person
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {people.map((person, index) => (
            <div
              key={person.key}
              className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2"
            >
              <Field label="Name">
                <Input
                  name="person_name"
                  required={index === 0}
                  maxLength={120}
                  value={person.name}
                  onChange={(event) => {
                    const name = event.target.value;
                    setPeople((rows) =>
                      rows.map((row, i) => (i === index ? { ...row, name } : row)),
                    );
                  }}
                />
              </Field>
              <Field label="Role">
                <Input
                  name="person_role"
                  list={`person-role-${person.key}`}
                  required={index === 0}
                  maxLength={80}
                  value={person.role}
                  placeholder="Owner, Billing…"
                  onChange={(event) => {
                    const role = event.target.value;
                    setPeople((rows) =>
                      rows.map((row, i) => (i === index ? { ...row, role } : row)),
                    );
                  }}
                />
                <datalist id={`person-role-${person.key}`}>
                  {clientPersonRoles.map((role) => (
                    <option key={role} value={role} />
                  ))}
                </datalist>
              </Field>
              <Field label="Email">
                <Input
                  name="person_email"
                  type="email"
                  maxLength={120}
                  value={person.email}
                  onChange={(event) => {
                    const email = event.target.value;
                    setPeople((rows) =>
                      rows.map((row, i) => (i === index ? { ...row, email } : row)),
                    );
                  }}
                  autoComplete="off"
                />
              </Field>
              <Field label="Phone">
                <Input
                  name="person_phone"
                  type="tel"
                  maxLength={40}
                  value={person.phone}
                  onChange={(event) => {
                    const phone = event.target.value;
                    setPeople((rows) =>
                      rows.map((row, i) => (i === index ? { ...row, phone } : row)),
                    );
                  }}
                  autoComplete="off"
                />
              </Field>
              <div className="sm:col-span-2 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  disabled={people.length <= 1}
                  onClick={() => setPeople((rows) => rows.filter((_, i) => i !== index))}
                >
                  <Trash2 />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Saving">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
