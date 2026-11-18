"use client";

import { useActionState } from "react";
import type { ActionState, ProjectRecord, ProjectStatus } from "@/lib/portal/types";
import { SubmitButton } from "@/components/studio/SubmitButton";
import { Alert, Field } from "@/components/studio/ui";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const statuses: { value: ProjectStatus; label: string }[] = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function ProjectForm({
  action,
  project,
  clients,
  showClientSelect = false,
  submitLabel = "Add project",
  showSeparator = true,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  project?: ProjectRecord;
  clients?: { id: string; company_name: string }[];
  showClientSelect?: boolean;
  submitLabel?: string;
  showSeparator?: boolean;
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-8 grid gap-5 sm:grid-cols-2">
      {showSeparator ? <Separator className="sm:col-span-2" /> : null}
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
      {showClientSelect ? (
        <Field label="Client" className="sm:col-span-2">
          <NativeSelect name="client_id" required defaultValue={project?.client_id ?? ""}>
            <option value="">Select a client</option>
            {(clients ?? []).map((client) => (
              <option key={client.id} value={client.id}>
                {client.company_name}
              </option>
            ))}
          </NativeSelect>
        </Field>
      ) : null}
      <Field label="Project name" className="sm:col-span-2">
        <Input name="name" required maxLength={140} defaultValue={project?.name ?? ""} />
      </Field>
      <Field label="Status">
        <NativeSelect name="status" defaultValue={project?.status ?? "active"}>
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="Budget">
        <Input
          name="budget"
          type="number"
          min={0}
          step="0.01"
          defaultValue={project?.budget ?? ""}
          placeholder="Optional"
        />
      </Field>
      <Field label="Start date">
        <Input name="started_on" type="date" defaultValue={project?.started_on ?? ""} />
      </Field>
      <Field label="Due date">
        <Input name="due_on" type="date" defaultValue={project?.due_on ?? ""} />
      </Field>
      <Field label="Description" className="sm:col-span-2">
        <Textarea name="description" maxLength={4000} defaultValue={project?.description ?? ""} />
      </Field>
      <Field label="Internal notes" className="sm:col-span-2">
        <Textarea name="notes" maxLength={4000} defaultValue={project?.notes ?? ""} />
      </Field>
      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Saving">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
