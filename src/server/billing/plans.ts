/**
 * One-time Checkout API prices in US dollars. Do not convert these amounts.
 *
 * POST /v1/orders has no currency field. A Mexico (MLM) seller account settles
 * in MXN, so Mercado Pago reads total_amount in the account currency. These
 * values stay 999.00, 1500.00, and 2500.00 until that constraint changes.
 */
export const checkoutPlans = {
  starter: {
    id: "starter",
    name: "Starter",
    amount: 999,
    currency: "USD",
    reason: "FullStack Studio Design, Starter",
  },
  growth: {
    id: "growth",
    name: "Growth",
    amount: 1500,
    currency: "USD",
    reason: "FullStack Studio Design, Growth",
  },
  scale: {
    id: "scale",
    name: "Scale",
    amount: 2500,
    currency: "USD",
    reason: "FullStack Studio Design, Scale",
  },
} as const;

export type CheckoutPlanId = keyof typeof checkoutPlans;
export type CheckoutPlan = (typeof checkoutPlans)[CheckoutPlanId];

export function getCheckoutPlan(id: string): CheckoutPlan | undefined {
  if (id in checkoutPlans) return checkoutPlans[id as CheckoutPlanId];
  return undefined;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function amountToMp(amount: number): string {
  return amount.toFixed(2);
}
