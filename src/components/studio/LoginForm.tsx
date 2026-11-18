"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/portal/actions";
import { SubmitButton } from "@/components/studio/SubmitButton";
import { Alert, Field } from "@/components/studio/ui";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [state, action] = useActionState(signIn, null);

  return (
    <form action={action} className="space-y-5">
      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
      <Field label="Email">
        <Input name="email" type="email" autoComplete="username" required />
      </Field>
      <Field label="Password">
        <Input name="password" type="password" autoComplete="current-password" required />
      </Field>
      <SubmitButton className="w-full" pendingLabel="Signing in">
        Sign in
      </SubmitButton>
    </form>
  );
}
