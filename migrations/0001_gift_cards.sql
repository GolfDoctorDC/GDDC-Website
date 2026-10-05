create table if not exists gift_cards (
  id text primary key,
  code text not null unique,
  claim_token text not null,
  amount_cents integer not null,
  from_name text not null default '',
  recipient_name text not null default '',
  recipient_email text not null default '',
  message text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  issued_at timestamptz
);
