import { getSql } from "@/lib/db";

export type GiftOrderMail = {
  amount: string;
  fromName: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  orderedAt: string;
  orderId?: string;
  buyerEmail?: string;
  stripeId?: string;
};

const STUDIO = "Matt@golfdoctordc.com";
const SITE = "https://golfdoctordc.com";

function clean(value: string, max: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function giftCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const buf = new Uint8Array(8);
  crypto.getRandomValues(buf);
  let raw = "";
  for (const b of buf) raw += alphabet[b % alphabet.length];
  return `GD-${raw.slice(0, 4)}-${raw.slice(4)}`;
}

function randomToken(bytes: number) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function centsFromAmount(amount: string) {
  const n = Number(amount.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}

type CardRow = {
  id: string;
  code: string;
  amount_cents: number | string;
  from_name: string;
  recipient_name: string;
  recipient_email: string;
  message: string;
  status: string;
};

async function sendMail(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new Error("RESEND_API_KEY is not set");
  const from =
    process.env.GIFT_MAIL_FROM?.trim() ||
    "Golf Doctor DC <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  if (!res.ok) throw new Error("Gift card email was not accepted.");
}

export async function issueAndDeliver(input: GiftOrderMail) {
  const orderId = clean(input.orderId || "", 80);
  const stripeId = clean(input.stripeId || orderId, 80);
  const sql = await getSql();
  const existingNotice = stripeId
    ? await sql<{ id: string }>`
        select id from gift_card_notices
        where paypal_txn_id = ${stripeId} or gift_card_id = ${orderId}
      `
    : [];
  if (existingNotice[0]) return { ok: true as const, status: "duplicate" as const };

  let card: CardRow | undefined;
  if (orderId) {
    const rows = await sql<CardRow>`
      select id, code, amount_cents, from_name, recipient_name, recipient_email,
             message, status
      from gift_cards where id = ${orderId}
    `;
    card = rows[0];
  }
  if (!card) {
    const id = orderId || `gc_${randomToken(9)}`;
    const code = giftCode();
    const cents = centsFromAmount(input.amount);
    await sql`
      insert into gift_cards (
        id, code, claim_token, amount_cents, balance_cents, from_name,
        recipient_name, recipient_email, message, status, issued_at
      ) values (
        ${id}, ${code}, ${randomToken(24)}, ${cents}, ${cents},
        ${clean(input.fromName, 80)}, ${clean(input.recipientName, 80)},
        ${clean(input.recipientEmail, 120)}, ${clean(input.message, 280)},
        'issued', now()
      )
    `;
    const created = await sql<CardRow>`
      select id, code, amount_cents, from_name, recipient_name, recipient_email,
             message, status
      from gift_cards where id = ${id}
    `;
    card = created[0];
  } else if (card.status !== "issued") {
    await sql`
      update gift_cards
      set status = 'issued', issued_at = now(), balance_cents = amount_cents
      where id = ${card.id} and status = 'pending'
    `;
  }
  if (!card) throw new Error("Gift card could not be issued.");

  const amount = `$${(Number(card.amount_cents) / 100).toFixed(2)}`;
  const link = `${SITE}/gift-cards/${card.code}`;
  const buyer = clean(input.buyerEmail || "", 120);
  const deliverTo = card.recipient_email || buyer;
  const when = clean(input.orderedAt, 40);
  if (deliverTo) {
    await sendMail(
      deliverTo,
      `Your ${amount} Golf Doctor DC gift card`,
      [
        card.recipient_name ? `${card.recipient_name},` : "Your gift card is ready.",
        "",
        `Amount: ${amount}`,
        card.from_name ? `From: ${card.from_name}` : "",
        card.message ? `Message: ${card.message}` : "",
        `Code: ${card.code}`,
        `E-card: ${link}`,
        "",
        "Bring the code to 1108 K St NW, Floor 3, Washington, DC 20005.",
        "It covers fittings, simulator time, and shop work.",
      ]
        .filter((line) => line !== "")
        .join("\n"),
    );
  }
  const studioBody = [
    "A Golf Doctor DC gift card was issued.",
    "",
    `Amount: ${amount}`,
    `Code: ${card.code}`,
    `E-card: ${link}`,
    `From: ${card.from_name || "(not given)"}`,
    `Recipient: ${card.recipient_name || "(not given)"}`,
    `Recipient email: ${card.recipient_email || "(not given)"}`,
    `Delivered to: ${deliverTo || "studio only — no recipient email"}`,
    `Message: ${card.message || "(none)"}`,
    `Time: ${when || "(not given)"}`,
    `Order: ${card.id}`,
  ].join("\n");
  await sendMail(STUDIO, `Gift card issued ${amount} ${card.code}`, studioBody);
  const noticeId = `gn_${randomToken(9)}`;
  await sql`
    insert into gift_card_notices (
      id, gift_card_id, paypal_txn_id, to_email, subject, body, status
    ) values (
      ${noticeId}, ${card.id}, ${stripeId || card.id}, ${deliverTo || STUDIO},
      ${`Gift card issued ${amount} ${card.code}`}, ${studioBody}, 'sent'
    )
  `;
  return { ok: true as const, status: "sent" as const, code: card.code, link };
}
