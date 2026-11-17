"use client";

import { useActionState } from "react";
import { paymentMethods } from "@/lib/portal/plans";
import type { ActionState, PaymentStatus } from "@/lib/portal/types";
import { SubmitButton } from "@/components/studio/SubmitButton";
import { Alert, Field, areaClass, fieldClass } from "@/components/studio/ui";

const statuses: { value: PaymentStatus; label: string }[] = [
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export function PaymentForm({
  action,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-8 grid gap-5 border-t border-rule pt-8 sm:grid-cols-2">
      {state?.error ? (
        <div className="sm:col-span-2">
          <Alert tone="error">{state.error}</Alert>
        </div>
      ) : null}
      <Field label="Amount">
        <input name="amount" type="number" min={0.01} step="0.01" required className={fieldClass} />
      </Field>
      <Field label="Status">
        <select name="status" defaultValue="paid" className={fieldClass}>
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Date" hint="Paid payments without a date use today.">
        <input name="paid_on" type="date" className={fieldClass} />
      </Field>
      <Field label="Period">
        <input
          name="period_label"
          maxLength={80}
          placeholder="November 2026"
          className={fieldClass}
        />
      </Field>
      <Field label="Method">
        <select name="method" defaultValue="Card" className={fieldClass}>
          <option value="">Not specified</option>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Reference">
        <input name="reference" maxLength={120} placeholder="Receipt or payment id" className={fieldClass} />
      </Field>
      <Field label="Notes" hint="The client sees this." className="sm:col-span-2">
        <textarea name="notes" maxLength={4000} className={areaClass} />
      </Field>
      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Saving">Add payment</SubmitButton>
      </div>
    </form>
  );
}
