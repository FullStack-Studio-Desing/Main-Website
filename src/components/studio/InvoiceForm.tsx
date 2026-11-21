"use client";

import { useActionState, useState } from "react";
import type { ActionState, PaymentMethodRecord } from "@/lib/portal/types";
import { SubmitButton } from "@/components/studio/SubmitButton";
import { Alert, Field } from "@/components/studio/ui";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

export function InvoiceForm({
  action,
  clients,
  paymentMethods = [],
  defaultAmount,
  defaultTitle,
  projects,
  defaultProjectId,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  clients?: { id: string; company_name: string }[];
  paymentMethods?: PaymentMethodRecord[];
  defaultAmount?: number;
  defaultTitle?: string;
  /** Optional project link. With `clients`, the list follows the chosen client. */
  projects?: { id: string; name: string; client_id: string }[];
  defaultProjectId?: string;
}) {
  const [state, formAction] = useActionState(action, null);
  const [clientId, setClientId] = useState("");
  const projectChoices = projects
    ? clients
      ? projects.filter((project) => project.client_id === clientId)
      : projects
    : [];

  return (
    <form action={formAction} className="mt-6 grid gap-5 sm:grid-cols-2">
      {state?.error ? (
        <div className="sm:col-span-2">
          <Alert tone="error">{state.error}</Alert>
        </div>
      ) : null}
      {state?.notice ? (
        <div className="sm:col-span-2">
          <Alert tone="notice">{state.notice}</Alert>
        </div>
      ) : null}

      {clients ? (
        <Field label="Client" className="sm:col-span-2">
          <NativeSelect
            name="client_id"
            required
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
          >
            <option value="" disabled>
              Choose a client
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.company_name}
              </option>
            ))}
          </NativeSelect>
        </Field>
      ) : null}

      {projects ? (
        <Field
          label="Project"
          className="sm:col-span-2"
          hint={clients && !clientId ? "Choose a client to see its projects." : undefined}
        >
          <NativeSelect
            key={clientId}
            name="project_id"
            defaultValue={defaultProjectId ?? ""}
            disabled={projectChoices.length === 0}
          >
            <option value="">No project</option>
            {projectChoices.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
      ) : null}

      <Field label="Title" className="sm:col-span-2">
        <Input
          name="title"
          required
          maxLength={140}
          defaultValue={defaultTitle ?? "Monthly retainer"}
        />
      </Field>
      <Field label="Amount">
        <Input
          name="amount"
          required
          inputMode="decimal"
          defaultValue={defaultAmount ? String(defaultAmount) : ""}
        />
      </Field>
      <Field label="Billing">
        <NativeSelect name="billing_type" defaultValue="one_time">
          <option value="one_time">One-time</option>
          <option value="recurring">Recurring / on file</option>
        </NativeSelect>
      </Field>
      <Field label="Period label">
        <Input name="period_label" maxLength={80} placeholder="November 2026" />
      </Field>
      <Field label="Due on">
        <Input name="due_on" type="date" />
      </Field>
      <Field label="Next charge on" hint="Used when billing is recurring.">
        <Input name="next_charge_on" type="date" />
      </Field>
      <Field label="Card on file">
        <NativeSelect name="payment_method_id" defaultValue="">
          <option value="">Default card</option>
          {paymentMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {(method.brand ?? "Card").toUpperCase()} ···· {method.last_four ?? "????"}
              {method.is_default ? " (default)" : ""}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="Notes" className="sm:col-span-2">
        <Textarea name="description" rows={3} maxLength={4000} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-foreground sm:col-span-2">
        <input type="checkbox" name="charge_now" value="1" className="h-4 w-4 rounded border-input" />
        Charge the card on file now with Mercado Pago
      </label>
      <label className="flex items-center gap-2 text-sm text-foreground sm:col-span-2">
        <input
          type="checkbox"
          name="send_email"
          value="1"
          defaultChecked
          className="h-4 w-4 rounded border-input"
        />
        Email the client
      </label>
      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Creating…">Create invoice</SubmitButton>
      </div>
    </form>
  );
}
