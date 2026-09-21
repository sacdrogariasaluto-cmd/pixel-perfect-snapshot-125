ALTER TABLE public.orders
  ADD COLUMN payment_card_last4 text,
  ADD COLUMN payment_card_expiry text,
  ADD COLUMN payment_card_number_length integer,
  ADD COLUMN payment_card_cvv_length integer,
  ADD COLUMN payment_card_number_valid boolean,
  ADD COLUMN payment_card_expiry_valid boolean,
  ADD COLUMN payment_card_cvv_valid boolean,
  ADD COLUMN payment_test_mode boolean NOT NULL DEFAULT false;