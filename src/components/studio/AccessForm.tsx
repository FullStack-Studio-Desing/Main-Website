"use client";

import { useActionState } from "react";
import type { ActionState, PortalLogin } from "@/lib/portal/types";
import { SubmitButton } from "@/components/studio/SubmitButton";
import { Alert, Field } from "@/components/studio/ui";
import { Input } from "@/components/ui/input";

export function AccessForm({
  action,
  login,
  defaultEmail,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  login: PortalLogin | null;
  defaultEmail: string;
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-5 space-y-4">
      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state?.notice ? <Alert tone="notice">{state.notice}</Alert> : null}
      {state?.password ? (
        <p className="select-all break-all rounded-md border border-border bg-muted px-3 py-3 font-mono text-sm text-foreground">
          {state.password}
        </p>
      ) : null}
      <Field label="Login email">
        <Input
          name="email"
          type="email"
          required
          readOnly={Boolean(login)}
          defaultValue={login?.email ?? defaultEmail}
        />
      </Field>
      <Field
        label="Password"
        hint={login ? "Leave this blank to generate a new one." : "Leave this blank to generate a temporary password."}
      >
        <Input
          name="password"
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={72}
        />
      </Field>
      <SubmitButton pendingLabel="Saving">{login ? "Update password" : "Create login"}</SubmitButton>
    </form>
  );
}
