/**
 * One-time Checkout API prices in US dollars.
 *
 * POST /v1/orders has no currency field and a Mexico (MLM) seller account charges
 * in MXN, so createCardCharge converts these USD prices at the current rate
 * (src/server/billing/fx.ts). Keep the values here in USD.
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
