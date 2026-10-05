import { createServerFn } from "@tanstack/react-start";

export type IssuedGiftCard = {
  code: string;
  amount: number;
  balance: number;
  fromName: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  issuedAt: string;
};

const MIN_CENTS = 2500;
const MAX_CENTS = 500_000;

type OrderInput = {
  amount: number;
  fromName: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
};

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function emailOk(value: string) {
  return value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseOrder(input: unknown): OrderInput {
  if (!input || typeof input !== "object") throw new Error("Invalid gift card.");
  const raw = input as Record<string, unknown>;
  const amount = Number(raw.amount);
  const cents = Math.round(amount * 100);
  if (!Number.isFinite(amount) || cents < MIN_CENTS || cents > MAX_CENTS) {
    throw new Error("Enter an amount between $25 and $5,000.");
  }
  const recipientEmail = clean(raw.recipientEmail, 120);
  if (!emailOk(recipientEmail)) throw new Error("Enter a valid recipient email.");
  return {
    amount: cents / 100,
    fromName: clean(raw.fromName, 80),
    recipientName: clean(raw.recipientName, 80),
    recipientEmail,
    message: clean(raw.message, 280),
  };
}

function randomToken(bytes: number) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function giftCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const buf = new Uint8Array(8);
  crypto.getRandomValues(buf);
  let raw = "";
  for (const b of buf) raw += alphabet[b % alphabet.length];
  return `GD-${raw.slice(0, 4)}-${raw.slice(4)}`;
}

type Row = {
  id: string;
  code: string;
  claim_token: string;
  amount_cents: number | string;
  balance_cents: number | string | null;
  from_name: string;
  recipient_name: string;
  recipient_email: string;
  message: string;
  status: string;
  issued_at: string | Date | null;
  redeemed_at: string | Date | null;
};

function moneyCents(value: number | string | null) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toCard(row: Row): IssuedGiftCard {
  const issued =
    row.issued_at instanceof Date
      ? row.issued_at.toISOString()
      : String(row.issued_at ?? "");
  const amount = Number(row.amount_cents) / 100;
  let balanceCents = moneyCents(row.balance_cents);
  if (balanceCents == null) balanceCents = Number(row.amount_cents);
  let balance = balanceCents / 100;
  const redeemed = row.redeemed_at != null && String(row.redeemed_at) !== "";
  if (redeemed && balance === amount) balance = 0;
  return {
    code: row.code,
    amount,
    balance,
    fromName: row.from_name,
    recipientName: row.recipient_name,
    recipientEmail: row.recipient_email,
    message: row.message,
    issuedAt: issued,
  };
}

export const createGiftCardOrder = createServerFn({ method: "POST" })
  .validator(parseOrder)
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const id = `gc_${randomToken(9)}`;
    const code = giftCode();
    const claimToken = randomToken(24);
    const cents = Math.round(data.amount * 100);
    await sql`
      insert into gift_cards (
        id, code, claim_token, amount_cents, balance_cents, from_name, recipient_name,
        recipient_email, message
      ) values (
        ${id}, ${code}, ${claimToken}, ${cents}, ${cents}, ${data.fromName},
        ${data.recipientName}, ${data.recipientEmail}, ${data.message}
      )
    `;
    return { id, claimToken, amount: data.amount, code };
  });

export const deliverGiftCard = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Gift card not found.");
    const raw = input as Record<string, unknown>;
    const id = clean(raw.id, 80);
    const claimToken = clean(raw.claimToken, 80);
    if (!id || !claimToken) throw new Error("Gift card not found.");
    return { id, claimToken };
  })
  .handler(async ({ data }): Promise<IssuedGiftCard> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<Row>`
      select id, code, claim_token, amount_cents, balance_cents, from_name, recipient_name,
             recipient_email, message, status, issued_at, redeemed_at
      from gift_cards
      where id = ${data.id}
    `;
    const row = rows[0];
    if (!row || row.claim_token !== data.claimToken) {
      throw new Error("Gift card not found.");
    }
    if (row.status !== "issued") {
      await sql`
        update gift_cards
        set status = 'issued', issued_at = now()
        where id = ${data.id} and status = 'pending'
      `;
      const again = await sql<Row>`
        select id, code, claim_token, amount_cents, balance_cents, from_name, recipient_name,
               recipient_email, message, status, issued_at, redeemed_at
        from gift_cards
        where id = ${data.id}
      `;
      if (!again[0] || again[0].status !== "issued") {
        throw new Error("Gift card not found.");
      }
      return toCard(again[0]);
    }
    return toCard(row);
  });

export const getIssuedGiftCard = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") return { code: "" };
    const code = clean((input as Record<string, unknown>).code, 40).toUpperCase();
    return { code };
  })
  .handler(async ({ data }): Promise<IssuedGiftCard | null> => {
    if (!data.code) return null;
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<Row>`
      select id, code, claim_token, amount_cents, balance_cents, from_name, recipient_name,
             recipient_email, message, status, issued_at, redeemed_at
      from gift_cards
      where code = ${data.code} and status = 'issued'
    `;
    return rows[0] ? toCard(rows[0]) : null;
  });
