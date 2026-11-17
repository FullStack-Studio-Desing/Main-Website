"use client";

import { useActionState, useState } from "react";
import type { ActionState, ClientRecord, ClientStatus, PlanId } from "@/lib/portal/types";
import { portalPlans } from "@/lib/portal/plans";
import { SubmitButton } from "@/components/studio/SubmitButton";
import { Alert, Field, areaClass, fieldClass } from "@/components/studio/ui";

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
        <input
          name="company_name"
          required
          maxLength={120}
          defaultValue={client?.company_name ?? ""}
          className={fieldClass}
        />
      </Field>
      <Field label="Contact name">
        <input
          name="contact_name"
          required
          maxLength={120}
          defaultValue={client?.contact_name ?? ""}
          className={fieldClass}
        />
      </Field>
      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          autoComplete="off"
          defaultValue={client?.email ?? ""}
          className={fieldClass}
        />
      </Field>
      <Field label="Phone">
        <input
          name="phone"
          maxLength={40}
          autoComplete="off"
          defaultValue={client?.phone ?? ""}
          className={fieldClass}
        />
      </Field>
      <Field label="Status">
        <select name="status" defaultValue={client?.status ?? "active"} className={fieldClass}>
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Plan">
        <select
          name="plan_id"
          value={planId}
          onChange={(event) => onPlan(event.target.value as PlanId)}
          className={fieldClass}
        >
          {portalPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
              {plan.amount > 0 ? ` · $${plan.amount.toLocaleString("en-US")}` : ""}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Plan name" hint="This is the name the client sees on their plan.">
        <input
          name="plan_name"
          required
          maxLength={80}
          value={planName}
          onChange={(event) => setPlanName(event.target.value)}
          className={fieldClass}
        />
      </Field>
      <Field label="Monthly amount">
        <input
          name="monthly_amount"
          type="number"
          min={0}
          step="0.01"
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className={fieldClass}
        />
      </Field>
      <Field label="Started">
        <input
          name="started_on"
          type="date"
          defaultValue={client?.started_on ?? ""}
          className={fieldClass}
        />
      </Field>
      <Field
        label="Notes"
        hint="Only the studio sees this."
        className="sm:col-span-2"
      >
        <textarea
          name="billing_notes"
          maxLength={4000}
          defaultValue={client?.billing_notes ?? ""}
          className={areaClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Saving">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
