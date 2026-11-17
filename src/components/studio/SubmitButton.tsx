"use client";

import { useFormStatus } from "react-dom";
import { btnInverse } from "@/components/buttons";

export function SubmitButton({
  children,
  pendingLabel,
  className,
}: {
  children: string;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${btnInverse} disabled:opacity-60 ${className ?? ""}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
