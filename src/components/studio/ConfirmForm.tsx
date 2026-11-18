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
      <Button type="submit" variant="link" className="h-auto p-0 text-moss">
        {label}
      </Button>
    </form>
  );
}
