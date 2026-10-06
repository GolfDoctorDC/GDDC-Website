import { getSql } from "@/lib/db";
import { STUDIO_GIFT_EMAIL } from "@/lib/gift-notice";

export type GiftOrderMail = {
  amount: string;
  fromName: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  orderedAt: string;
  orderId?: string;
};

const TO = "Matt@golfdoctordc.com";

function clean(value: string, max: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export function normalizeGiftOrder(input: GiftOrderMail): GiftOrderMail {
  return {
    amount: clean(input.amount, 40),
    fromName: clean(input.fromName, 80),
    recipientName: clean(input.recipientName, 80),
    recipientEmail: clean(input.recipientEmail, 120),
    message: clean(input.message, 280),
    orderedAt: clean(input.orderedAt, 40),
    orderId: input.orderId ? clean(input.orderId, 80) : undefined,
  };
}

function noticeBody(order: GiftOrderMail) {
  return [
    "A Golf Doctor DC gift card was purchased.",
    "",
    `Amount: ${order.amount || "(not given)"}`,
    `From: ${order.fromName || "(not given)"}`,
    `Recipient: ${order.recipientName || "(not given)"}`,
    `Recipient email: ${order.recipientEmail || "(not given)"}`,
    `Message: ${order.message || "(none)"}`,
    `Time: ${order.orderedAt || "(not given)"}`,
    order.orderId ? `Order: ${order.orderId}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

async function alreadySent(orderId: string) {
  try {
    const sql = await getSql();
    const rows = await sql<{ id: string }>`
      select id from gift_card_notices
      where gift_card_id = ${orderId} or paypal_txn_id = ${orderId}
    `;
    return Boolean(rows[0]);
  } catch {
    return false;
  }
}

async function remember(orderId: string, subject: string, body: string, status: string) {
  try {
    const sql = await getSql();
    const id = `gn_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
    await sql`
      insert into gift_card_notices (
        id, gift_card_id, paypal_txn_id, to_email, subject, body, status
      ) values (
        ${id}, ${orderId}, ${orderId}, ${TO}, ${subject}, ${body}, ${status}
      )
    `;
  } catch {
    /* A missing table should not block the email. */
  }
}

export async function emailGiftOrder(input: GiftOrderMail) {
  const order = normalizeGiftOrder(input);
  const orderId = order.orderId || "";
  if (orderId && (await alreadySent(orderId))) {
    return { ok: true as const, status: "duplicate" as const };
  }
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }
  const subject = order.amount
    ? `Gift card purchase ${order.amount}`
    : "Gift card purchase";
  const body = noticeBody(order);
  const from =
    process.env.GIFT_MAIL_FROM?.trim() ||
    "Golf Doctor DC <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [TO, STUDIO_GIFT_EMAIL],
      subject,
      text: body,
    }),
  });
  if (!res.ok) {
    throw new Error("Gift card email was not accepted.");
  }
  if (orderId) await remember(orderId, subject, body, "sent");
  return { ok: true as const, status: "sent" as const };
}
