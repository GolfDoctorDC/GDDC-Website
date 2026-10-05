alter table gift_cards add column if not exists balance_cents integer;
update gift_cards set balance_cents = amount_cents where balance_cents is null;
