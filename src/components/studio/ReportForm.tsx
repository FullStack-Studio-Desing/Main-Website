"use client";

import { useActionState } from "react";
import type { ActionState, ReportRecord, ReportStatus } from "@/lib/portal/types";
import { SubmitButton } from "@/components/studio/SubmitButton";
import { Alert, Field, areaClass, fieldClass } from "@/components/studio/ui";

const sections: { name: keyof Pick<ReportRecord, "traffic" | "campaigns" | "pipeline" | "actions">; label: string; hint: string }[] = [
  {
    name: "traffic",
    label: "Traffic and lead quality",
    hint: "Where people came from, and which sources produced real inquiries.",
  },
  {
    name: "campaigns",
    label: "Campaign and SEO movement",
    hint: "What spend did, what organic work moved, and what changes next.",
  },
  {
    name: "pipeline",
    label: "Conversion and pipeline",
    hint: "Form fills, booked calls, and where leads stalled.",
  },
  {
    name: "actions",
    label: "Actions for the coming week",
    hint: "The short list of what you are shipping.",
  },
];

export function ReportForm({
  action,
  report,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  report?: ReportRecord;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="grid gap-5">
      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state?.notice ? <Alert tone="notice">{state.notice}</Alert> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title">
          <input
            name="title"
            required
            maxLength={140}
            defaultValue={report?.title ?? ""}
            placeholder="What the ads earned"
            className={fieldClass}
          />
        </Field>
        <Field label="Period">
          <input
            name="period_label"
            required
            maxLength={80}
            defaultValue={report?.period_label ?? ""}
            placeholder="Week of Nov 10, 2026"
            className={fieldClass}
          />
        </Field>
      </div>
      <Field label="Summary" hint="The first thing the client reads.">
        <textarea
          name="summary"
          maxLength={8000}
          defaultValue={report?.summary ?? ""}
          className={areaClass}
        />
      </Field>
      {sections.map((section) => (
        <Field key={section.name} label={section.label} hint={section.hint}>
          <textarea
            name={section.name}
            maxLength={8000}
            defaultValue={report?.[section.name] ?? ""}
            className={areaClass}
          />
        </Field>
      ))}
      <Field label="Visibility">
        <select
          name="status"
          defaultValue={report?.status ?? "published"}
          className={fieldClass}
        >
          {(["published", "draft"] as ReportStatus[]).map((status) => (
            <option key={status} value={status}>
              {status === "published" ? "Published — client can see it" : "Draft — studio only"}
            </option>
          ))}
        </select>
      </Field>
      <div>
        <SubmitButton pendingLabel="Saving">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
