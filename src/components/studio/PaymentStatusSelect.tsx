"use client";

import { updatePaymentStatus } from "@/lib/portal/actions";
import type { PaymentStatus } from "@/lib/portal/types";
import { fieldClass } from "@/components/studio/ui";

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
  const action = updatePaymentStatus.bind(null, clientId);

  return (
    <form action={action}>
      <input type="hidden" name="id" value={paymentId} />
      <label className="sr-only" htmlFor={`payment-status-${paymentId}`}>
        Payment status
      </label>
      <select
        id={`payment-status-${paymentId}`}
        name="status"
        defaultValue={status}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className={`${fieldClass} h-10 w-[132px] capitalize`}
      >
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </option>
        ))}
      </select>
    </form>
  );
}
