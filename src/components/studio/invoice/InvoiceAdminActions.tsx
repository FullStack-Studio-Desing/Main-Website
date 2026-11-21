"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ban, CreditCard, ExternalLink, HandCoins, Mail } from "lucide-react";
import { toast } from "sonner";
import type { ActionState } from "@/lib/portal/types";
import { formatUsd, todayISO } from "@/lib/portal/format";
import { CopyPayLinkButton } from "@/components/studio/invoice/CopyPayLinkButton";
import { Alert, Field } from "@/components/studio/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { NativeSelect } from "@/components/ui/native-select";

type Action = () => Promise<ActionState>;

function report(result: ActionState) {
  if (result?.error) toast.error(result.error);
  else if (result?.notice) toast.success(result.notice);
}

export function InvoiceAdminActions({
  number,
  amount,
  status,
  payPath,
  hasCardOnFile,
  notice,
  send,
  charge,
  markPaid,
  voidInvoice,
}: {
  number: string;
  amount: number;
  status: string;
  payPath: string | null;
  hasCardOnFile: boolean;
  notice?: string;
  send: Action;
  charge: Action;
  markPaid: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  voidInvoice: Action;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const open = status === "draft" || status === "sent" || status === "failed";

  // Surface the result of createInvoice, which redirects here with ?notice=.
  useEffect(() => {
    if (!notice) return;
    toast.success(notice);
    router.replace(window.location.pathname, { scroll: false });
  }, [notice, router]);

  function run(action: Action) {
    startTransition(async () => {
      report(await action());
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {payPath ? (
        <>
          <CopyPayLinkButton path={payPath} />
          <Button asChild variant="outline" size="sm">
            <a href={payPath} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden />
              Open pay page
            </a>
          </Button>
        </>
      ) : null}

      {open ? (
        <>
          <Button variant="outline" size="sm" disabled={pending} onClick={() => run(send)}>
            <Mail aria-hidden />
            {status === "draft" ? "Send email" : "Resend email"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pending || !hasCardOnFile}
            title={hasCardOnFile ? undefined : "This client has no card on file."}
            onClick={() => run(charge)}
          >
            <CreditCard aria-hidden />
            Charge card on file
          </Button>
          <MarkPaidDialog number={number} amount={amount} action={markPaid} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" disabled={pending}>
                <Ban aria-hidden />
                Void
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="studio-app">
              <AlertDialogHeader>
                <AlertDialogTitle>Void invoice {number}?</AlertDialogTitle>
                <AlertDialogDescription>
                  The pay link stops accepting payments. Payments already recorded stay in the ledger.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep invoice</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => run(voidInvoice)}
                >
                  Void invoice
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : null}
    </div>
  );
}

function MarkPaidDialog({
  number,
  amount,
  action,
}: {
  number: string;
  amount: number;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [method, setMethod] = useState("Bank transfer");
  const [state, formAction, pending] = useActionState(async (prev: ActionState, formData: FormData) => {
    const result = await action(prev, formData);
    if (!result?.error) {
      report(result);
      setIsOpen(false);
      router.refresh();
    }
    return result;
  }, null);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HandCoins aria-hidden />
          Mark paid
        </Button>
      </DialogTrigger>
      <DialogContent className="studio-app sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record a manual payment</DialogTitle>
          <DialogDescription>
            {formatUsd(amount)} for {number}, received outside Mercado Pago.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
          <Field label="Method">
            <NativeSelect name="method" value={method} onChange={(event) => setMethod(event.target.value)}>
              <option>Bank transfer</option>
              <option>Zelle</option>
              <option>Wire</option>
              <option>Check</option>
              <option>Cash</option>
              <option>Other</option>
            </NativeSelect>
          </Field>
          {method === "Other" ? (
            <Field label="Describe the method">
              <Input name="method_other" maxLength={40} required />
            </Field>
          ) : null}
          <Field label="Reference" hint="Confirmation number, check number, or a short note.">
            <Input name="reference" maxLength={120} />
          </Field>
          <Field label="Received on">
            <Input name="paid_on" type="date" defaultValue={todayISO()} />
          </Field>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Mark as paid"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
