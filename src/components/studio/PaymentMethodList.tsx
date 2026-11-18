import { removePaymentMethod } from "@/lib/portal/billing-actions";
import type { PaymentMethodRecord } from "@/lib/portal/types";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { Card, CardContent } from "@/components/ui/card";

export function PaymentMethodList({
  clientId,
  methods,
}: {
  clientId: string;
  methods: PaymentMethodRecord[];
}) {
  if (methods.length === 0) {
    return <p className="text-base text-body">No card on file yet.</p>;
  }

  return (
    <Card>
      <CardContent className="divide-y divide-border p-0">
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex items-start justify-between gap-4 px-5 py-4"
          >
            <div>
              <p className="text-base font-medium text-foreground">
                {(method.brand ?? "Card").toUpperCase()} ···· {method.last_four ?? "????"}
                {method.is_default ? " · Default" : ""}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {method.holder_name ?? "Card on file"}
                {method.exp_month && method.exp_year
                  ? ` · Exp ${String(method.exp_month).padStart(2, "0")}/${method.exp_year}`
                  : ""}
              </p>
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
