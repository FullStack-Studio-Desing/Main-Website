-- USD invoices charged in the Mercado Pago account currency (MXN) at the day's rate.
-- `amount` stays in USD everywhere; these columns record what the card was actually charged.
-- Safe to run again.

alter table public.payments
  add column if not exists charge_currency text
    check (charge_currency is null or char_length(charge_currency) = 3),
  add column if not exists charge_amount numeric(14, 2)
    check (charge_amount is null or charge_amount > 0),
  add column if not exists fx_rate numeric(14, 6)
    check (fx_rate is null or fx_rate > 0);

alter table public.payment_refunds
  add column if not exists charge_amount numeric(14, 2)
    check (charge_amount is null or charge_amount > 0);
