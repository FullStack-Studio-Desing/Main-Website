"use client";

import { Button } from "@/components/ui/button";

export function ConfirmForm({
  action,
  message,
  label,
}: {
  action: (formData: FormData) => void | Promise<void>;
  message: string;
  label: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      <Button type="submit" variant="ghost" size="sm" className="h-auto px-0 text-destructive hover:text-destructive">
        {label}
      </Button>
    </form>
  );
}
