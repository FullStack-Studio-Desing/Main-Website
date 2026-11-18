"use client";

import { useActionState, useState } from "react";
import type { ActionState, ClientRecord, ClientStatus, PlanId } from "@/lib/portal/types";
import { portalPlans } from "@/lib/portal/plans";
import { SubmitButton } from "@/components/studio/SubmitButton";
import { Alert, Field } from "@/components/studio/ui";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

const statuses: { value: ClientStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "archived", label: "Archived" },
];

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

  function onPlan(id: PlanId) {
    setPlanId(id);
    const plan = portalPlans.find((item) => item.id === id);
    if (!plan) return;
    if (plan.amount > 0) setAmount(String(plan.amount));
    if (id !== "custom") setPlanName(plan.name);
  }

  return (
    <form action={formAction} className="mt-10 grid gap-5 sm:grid-cols-2">
      {state?.error ? (
        <div className="sm:col-span-2">
          <Alert tone="error">{state.error}</Alert>
        </div>
      ) : null}
      <Field label="Company">
        <Input name="company_name" required maxLength={120} defaultValue={client?.company_name ?? ""} />
      </Field>
      <Field label="Contact name">
        <Input name="contact_name" required maxLength={120} defaultValue={client?.contact_name ?? ""} />
      </Field>
      <Field label="Email">
        <Input name="email" type="email" required autoComplete="off" defaultValue={client?.email ?? ""} />
      </Field>
      <Field label="Phone">
        <Input name="phone" maxLength={40} autoComplete="off" defaultValue={client?.phone ?? ""} />
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
        <Textarea name="billing_notes" maxLength={4000} defaultValue={client?.billing_notes ?? ""} />
      </Field>
      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Saving">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
