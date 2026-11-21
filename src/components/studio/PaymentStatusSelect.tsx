"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updatePaymentStatus } from "@/lib/portal/actions";
import type { PaymentStatus } from "@/lib/portal/types";
import { statusLabel } from "@/components/studio/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses: PaymentStatus[] = ["paid", "pending", "failed", "refunded"];

export function PaymentStatusSelect({
  clientId,
  paymentId,
  status,
}: {
  clientId: string;
  paymentId: string;
  status: PaymentStatus;
}) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  function onChange(next: string) {
    const nextStatus = next as PaymentStatus;
    setValue(nextStatus);
    const formData = new FormData();
    formData.set("id", paymentId);
    formData.set("status", nextStatus);
    startTransition(async () => {
      await updatePaymentStatus(clientId, formData);
      toast.success(`Payment marked ${statusLabel(nextStatus).toLowerCase()}`);
    });
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={pending}>
      <SelectTrigger className="h-8 w-[120px] px-3 text-sm" aria-label="Payment status">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="studio-app">
        {statuses.map((item) => (
          <SelectItem key={item} value={item}>
            {statusLabel(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
