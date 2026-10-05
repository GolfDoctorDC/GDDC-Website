import { getSql } from "@/lib/db";
import type { AdminCard } from "@/lib/admin.functions";

const COOKIE = "gddc_admin";
const DAY = 60 * 60 * 12;

export function adminPassword() {
  const fromEnv = process.env.GIFT_ADMIN_PASSWORD?.trim();
  if (!fromEnv) throw new Error("GIFT_ADMIN_PASSWORD is not set");
  return fromEnv;
}

function sessionSecret() {
  return process.env.GIFT_ADMIN_SECRET?.trim() || `${adminPassword()}:gddc-desk`;
}

function safeEqual(a: string, b: string) {
  const enc = new TextEncoder();
  const left = enc.encode(a);
  const right = enc.encode(b);
  const length = Math.max(left.length, right.length);
  let mismatch = left.length === right.length ? 0 : 1;
  for (let i = 0; i < length; i += 1) {
    mismatch |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return mismatch === 0;
}

function b64url(bytes: ArrayBuffer) {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return b64url(sig);
}

async function cookies() {
  return import("@tanstack/react-start/server");
}

export async function writeAdminSession() {
  const exp = Math.floor(Date.now() / 1000) + DAY;
  const token = `${exp}.${await hmac(String(exp))}`;
  const { setCookie, getRequestProtocol } = await cookies();
  const https = getRequestProtocol() === "https";
  setCookie(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: https,
    maxAge: DAY,
  });
}

export async function clearAdminSession() {
  const { deleteCookie } = await cookies();
  deleteCookie(COOKIE, { path: "/" });
}

export async function hasAdminSession() {
  const { getCookie } = await cookies();
  const raw = getCookie(COOKIE);
  if (!raw) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmac(exp);
  return safeEqual(sig, expected);
}

export function passwordMatches(password: string) {
  return safeEqual(password, adminPassword());
}

type AdminRow = {
  id: string;
  code: string;
  amount_cents: number | string;
  balance_cents: number | string | null;
  from_name: string;
  recipient_name: string;
  recipient_email: string;
  message: string;
  status: string;
  created_at: string | Date;
  issued_at: string | Date | null;
  redeemed_at: string | Date | null;
  notice_to: string | null;
  notice_subject: string | null;
  notice_body: string | null;
  notice_status: string | null;
};

function stamp(value: string | Date | null) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

export async function listAdminCards(): Promise<AdminCard[]> {
  const sql = await getSql();
  const rows = await sql<AdminRow>`
    select g.id, g.code, g.amount_cents, g.from_name, g.recipient_name,
           g.recipient_email, g.message, g.status, g.created_at, g.issued_at,
           g.redeemed_at, g.balance_cents, n.to_email as notice_to, n.subject as notice_subject,
           n.body as notice_body, n.status as notice_status
    from gift_cards g
    left join gift_card_notices n on n.gift_card_id = g.id
    order by g.created_at desc
  `;
  return rows.map((row) => {
    const amount = Number(row.amount_cents) / 100;
    const stored =
      row.balance_cents == null || row.balance_cents === ""
        ? Number(row.amount_cents)
        : Number(row.balance_cents);
    let balance = stored / 100;
    const redeemed = row.redeemed_at != null && String(row.redeemed_at) !== "";
    if (redeemed && balance === amount) balance = 0;
    return {
      id: row.id,
      code: row.code,
      amount,
      balance,
      fromName: row.from_name,
      recipientName: row.recipient_name,
      recipientEmail: row.recipient_email,
      message: row.message,
      status: row.status === "issued" ? "issued" : "pending",
      createdAt: stamp(row.created_at),
      issuedAt: stamp(row.issued_at),
      redeemedAt: stamp(row.redeemed_at),
      notice: row.notice_body
        ? {
            to: row.notice_to || "",
            subject: row.notice_subject || "",
            body: row.notice_body,
            status: row.notice_status || "recorded",
          }
        : null,
    };
  });
}

export async function deleteGiftCard(id: string) {
  const sql = await getSql();
  await sql`delete from gift_card_notices where gift_card_id = ${id}`;
  await sql`delete from gift_cards where id = ${id}`;
}

export async function setCardRedeemed(id: string, redeemed: boolean) {
  const sql = await getSql();
  if (redeemed) {
    await sql`
      update gift_cards
      set redeemed_at = now(), balance_cents = 0
      where id = ${id} and status = 'issued'
    `;
  } else {
    await sql`
      update gift_cards
      set redeemed_at = null, balance_cents = amount_cents
      where id = ${id}
    `;
  }
}

export async function resetGiftCardBalance(id: string, amount: number) {
  const sql = await getSql();
  const rows = await sql<{ amount_cents: number | string; status: string }>`
    select amount_cents, status from gift_cards where id = ${id}
  `;
  const card = rows[0];
  if (!card || card.status !== "issued") {
    throw new Error("Only an issued card can change value.");
  }
  const cents = Math.round(amount * 100);
  const original = Number(card.amount_cents);
  if (!Number.isFinite(cents) || cents < 0 || cents > original) {
    throw new Error("Enter a remaining amount from $0 up to the purchase amount.");
  }
  if (cents === 0) {
    await sql`
      update gift_cards
      set balance_cents = 0, redeemed_at = coalesce(redeemed_at, now())
      where id = ${id}
    `;
  } else {
    await sql`
      update gift_cards
      set balance_cents = ${cents}, redeemed_at = null
      where id = ${id}
    `;
  }
}
