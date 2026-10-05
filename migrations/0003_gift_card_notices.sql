create table if not exists gift_card_notices (
  id text primary key,
  gift_card_id text not null unique,
  paypal_txn_id text not null unique,
  to_email text not null,
  subject text not null,
  body text not null,
  status text not null default 'recorded',
  created_at timestamptz not null default now()
);
