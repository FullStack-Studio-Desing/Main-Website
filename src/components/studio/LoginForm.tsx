"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/portal/actions";
import { SubmitButton } from "@/components/studio/SubmitButton";
import { Alert, Field, fieldClass } from "@/components/studio/ui";

export function LoginForm() {
  const [state, action] = useActionState(signIn, null);

  return (
    <form action={action} className="mt-8 space-y-5">
      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
      <Field label="Email">
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className={fieldClass}
        />
      </Field>
      <Field label="Password">
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldClass}
        />
      </Field>
      <SubmitButton className="w-full" pendingLabel="Signing in">
        Sign in
      </SubmitButton>
    </form>
  );
}
