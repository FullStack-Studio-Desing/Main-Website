"use client";

import { useActionState } from "react";
import { paymentMethods } from "@/lib/portal/plans";
import type { ActionState, PaymentStatus } from "@/lib/portal/types";
import { SubmitButton } from "@/components/studio/SubmitButton";
import { Alert, Field } from "@/components/studio/ui";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

const statuses: { value: PaymentStatus; label: string }[] = [
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

/** Manual payment record. Pass `clients` to add a client picker (global payments page). */
export function PaymentForm({
  action,
  clients,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  clients?: { id: string; company_name: string }[];
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      {state?.error ? (
        <div className="sm:col-span-2">
          <Alert tone="error">{state.error}</Alert>
        </div>
      ) : null}
      {clients ? (
        <Field label="Client" className="sm:col-span-2">
          <NativeSelect name="client_id" required defaultValue="">
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.company_name}
              </option>
            ))}
          </NativeSelect>
        </Field>
      ) : null}
      <Field label="Amount">
        <Input name="amount" type="number" min={0.01} step="0.01" required />
      </Field>
      <Field label="Status">
        <NativeSelect name="status" defaultValue="paid">
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="Date" hint="Paid payments without a date use today.">
        <Input name="paid_on" type="date" />
      </Field>
      <Field label="Period">
        <Input name="period_label" maxLength={80} placeholder="November 2026" />
      </Field>
      <Field label="Method">
        <NativeSelect name="method" defaultValue="Card">
          <option value="">Not specified</option>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="Reference">
        <Input name="reference" maxLength={120} placeholder="Receipt or payment id" />
      </Field>
      <Field label="Notes" hint="The client sees this." className="sm:col-span-2">
        <Textarea name="notes" maxLength={4000} />
      </Field>
      <div className="flex justify-end sm:col-span-2">
        <SubmitButton pendingLabel="Saving">Record payment</SubmitButton>
      </div>
    </form>
  );
}
