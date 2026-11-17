import { checkoutPlans } from "@/server/billing/plans";
import type { PlanId } from "@/lib/portal/types";

export const portalPlans: { id: PlanId; name: string; amount: number }[] = [
  {
    id: "starter",
    name: checkoutPlans.starter.name,
    amount: checkoutPlans.starter.amount,
  },
  {
    id: "growth",
    name: checkoutPlans.growth.name,
    amount: checkoutPlans.growth.amount,
  },
  {
    id: "scale",
    name: checkoutPlans.scale.name,
    amount: checkoutPlans.scale.amount,
  },
  { id: "custom", name: "Custom", amount: 0 },
];

export const paymentMethods = [
  "Card",
  "Bank transfer",
  "Mercado Pago",
  "Check",
  "Other",
] as const;

export function planById(id: string) {
  return portalPlans.find((plan) => plan.id === id);
}
