"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";
import { toast } from "sonner";
import { refundPayment } from "@/lib/portal/refund-actions";
import { formatUsd } from "@/lib/portal/format";
import type { ActionState } from "@/lib/portal/types";
import { Alert, Field } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/** Refund button + dialog for one payment. Full or partial, with an optional reason. */
export function RefundDialog({
  paymentId,
  amount,
  refundedAmount = 0,
  viaMercadoPago,
  label = "Refund",
  size = "sm",
}: {
  paymentId: string;
  amount: number;
  refundedAmount?: number;
  viaMercadoPago: boolean;
  label?: string;
  size?: "sm" | "default";
}) {
  const router = useRouter();
  const remaining = Number((amount - refundedAmount).toFixed(2));
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"full" | "partial">("full");
  const [state, formAction, pending] = useActionState(async (prev: ActionState, formData: FormData) => {
    const result = await refundPayment(paymentId, prev, formData);
    if (!result?.error) {
      if (result?.notice) toast.success(result.notice);
      setIsOpen(false);
      setMode("full");
      router.refresh();
    }
    return result;
  }, null);

  if (remaining <= 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size={size}>
          <Undo2 aria-hidden />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="studio-app sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Refund payment</DialogTitle>
          <DialogDescription>
            {viaMercadoPago
              ? "Mercado Pago returns the money to the card that paid. This cannot be undone."
              : "This payment was not made through Mercado Pago. The refund is recorded here; send the money back the same way it was paid."}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
          <input type="hidden" name="mode" value={mode} />
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Refund amount">
            {(
              [
                ["full", "Full refund", formatUsd(remaining)],
                ["partial", "Partial refund", "Choose amount"],
              ] as const
            ).map(([value, title, hint]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={mode === value}
                onClick={() => setMode(value)}
                className={cn(
                  "rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                  mode === value ? "border-foreground bg-accent" : "border-border hover:bg-accent/60"
                )}
              >
                <span className="block font-medium">{title}</span>
                <span className="block text-xs text-muted-foreground">{hint}</span>
              </button>
            ))}
          </div>
          {mode === "partial" ? (
            <Field label="Amount" hint={`Up to ${formatUsd(remaining)}.`}>
              <Input
                name="amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                max={remaining}
                required
                autoFocus
              />
            </Field>
          ) : null}
          {refundedAmount > 0 ? (
            <p className="text-sm text-muted-foreground">
              {formatUsd(refundedAmount)} of {formatUsd(amount)} was already refunded.
            </p>
          ) : null}
          <Field label="Reason" hint="Optional. Kept in the CRM, not sent to the client.">
            <Textarea name="reason" rows={2} maxLength={1000} />
          </Field>
          <DialogFooter>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? "Refunding…" : mode === "full" ? `Refund ${formatUsd(remaining)}` : "Refund amount"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
