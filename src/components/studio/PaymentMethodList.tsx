import { removePaymentMethod } from "@/lib/portal/billing-actions";
import type { PaymentMethodRecord } from "@/lib/portal/types";
import { CreditCard } from "lucide-react";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { EmptyState } from "@/components/studio/ui";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function PaymentMethodList({
  clientId,
  methods,
}: {
  clientId: string;
  methods: PaymentMethodRecord[];
}) {
  if (methods.length === 0) {
    return <EmptyState icon={<CreditCard />} title="No card on file yet" />;
  }

  return (
    <Card>
      <CardContent className="divide-y divide-border p-0">
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                <CreditCard className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                  {(method.brand ?? "Card").toUpperCase()} ···· {method.last_four ?? "????"}
                  {method.is_default ? <Badge variant="secondary">Default</Badge> : null}
                </p>
                <p className="text-xs text-muted-foreground">
                  {method.holder_name ?? "Card on file"}
                  {method.exp_month && method.exp_year
                    ? ` · Exp ${String(method.exp_month).padStart(2, "0")}/${method.exp_year}`
                    : ""}
                </p>
              </div>
            </div>
            <ConfirmForm
              action={async (formData) => {
                "use server";
                await removePaymentMethod(clientId, method.id, formData);
              }}
              message="Remove this card from Mercado Pago and the portal?"
              label="Remove"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
