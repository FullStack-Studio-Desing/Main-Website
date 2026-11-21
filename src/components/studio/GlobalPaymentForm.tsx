"use client";

import type { ActionState } from "@/lib/portal/types";
import { PaymentForm } from "@/components/studio/PaymentForm";

export function GlobalPaymentForm({
  action,
  clients,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  clients: { id: string; company_name: string }[];
}) {
  return <PaymentForm action={action} clients={clients} />;
}
