import { getSql } from "@/lib/db";
import { giftCardImageUrl } from "@/lib/gift-card-image.server";

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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

async function sendMail(
  to: string,
  subject: string,
  text: string,
  html?: string,
) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new Error("RESEND_API_KEY is not set on the live site");
  const from =
    process.env.GIFT_MAIL_FROM?.trim() ||
    "Golf Doctor DC <onboarding@resend.dev>";
  const payload: Record<string, unknown> = {
    from,
    to: [to],
    subject,
    text,
  };
  if (html) payload.html = html;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail.slice(0, 180) || "Gift card email was not accepted.");
  }
}

function recipientCardHtml(opts: {
  amount: string;
  fromName: string;
  recipientName: string;
  message: string;
  code: string;
  link: string;
  imageUrl: string;
}) {
  const amount = escapeHtml(opts.amount);
  const code = escapeHtml(opts.code);
  const fromName = escapeHtml(opts.fromName);
  const recipientName = escapeHtml(opts.recipientName);
  const message = escapeHtml(opts.message);
  const link = escapeHtml(opts.link);
  const imageUrl = escapeHtml(opts.imageUrl);
  const forLine = recipientName
    ? `${amount} gift card for ${recipientName}${fromName ? `, from ${fromName}` : ""}.`
    : `${amount} Golf Doctor DC gift card${fromName ? ` from ${fromName}` : ""}.`;
  const messageBlock = message
    ? `<p>Message: ${message}</p>`
    : "";
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f4f0e6;color:#1b2218;font-family:Georgia,serif;">
  <img src="${imageUrl}" alt="Golf Doctor DC gift card, ${amount}, code ${code}" width="560" style="display:block;width:100%;max-width:560px;height:auto;border:0;border-radius:16px;" />
  <p style="margin:20px 0 8px;">${forLine}</p>
  ${messageBlock}
  <p>Code: <strong style="letter-spacing:0.08em;">${code}</strong></p>
  <p><a href="${link}">Open the e-card</a></p>
  <p style="margin-top:24px;font-size:14px;color:#5c6758;">Bring the code to 1108 K St NW, Floor 3, Washington, DC 20005. It covers fittings, simulator time, and shop work.</p>
</body>
</html>`;
}

function studioCardHtml(opts: {
  amount: string;
  fromName: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  code: string;
  link: string;
  imageUrl: string;
  deliverTo: string;
  when: string;
  orderId: string;
}) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f4f0e6;color:#1b2218;font-family:Georgia,serif;">
  <p>A Golf Doctor DC gift card was issued.</p>
  <img src="${escapeHtml(opts.imageUrl)}" alt="Golf Doctor DC gift card, ${escapeHtml(opts.amount)}, code ${escapeHtml(opts.code)}" width="560" style="display:block;width:100%;max-width:560px;height:auto;border:0;border-radius:16px;" />
  <p>Amount: ${escapeHtml(opts.amount)}</p>
  <p>Code: <strong>${escapeHtml(opts.code)}</strong></p>
  <p><a href="${escapeHtml(opts.link)}">Open the e-card</a></p>
  <p>From: ${escapeHtml(opts.fromName || "(not given)")}</p>
  <p>Recipient: ${escapeHtml(opts.recipientName || "(not given)")}</p>
  <p>Recipient email: ${escapeHtml(opts.recipientEmail || "(not given)")}</p>
  <p>Delivered to: ${escapeHtml(opts.deliverTo || "no email on the order")}</p>
  <p>Message: ${escapeHtml(opts.message || "(none)")}</p>
  <p>Time: ${escapeHtml(opts.when || "(not given)")}</p>
  <p>Order: ${escapeHtml(opts.orderId)}</p>
</body>
</html>`;
}

export async function issueAndDeliver(input: GiftOrderMail) {
  const orderId = clean(input.orderId || "", 80);
  const stripeId = clean(input.stripeId || orderId, 80);
  const sql = await getSql();
  const existingNotice = stripeId
    ? await sql<{ status: string }>`
        select status from gift_card_notices
        where paypal_txn_id = ${stripeId} or gift_card_id = ${orderId}
      `
    : [];
  if (existingNotice[0]?.status === "sent") {
    return { ok: true as const, status: "duplicate" as const, emailed: true };
  }

  let card: CardRow | undefined;
  if (orderId) {
    const rows = await sql<CardRow>`
      select id, code, amount_cents, from_name, recipient_name, recipient_email,
             message, status
      from gift_cards where id = ${orderId}
    `;
    card = rows[0];
  }
  const recipientEmail =
    clean(input.recipientEmail, 120) || card?.recipient_email || "";
  const buyer = clean(input.buyerEmail || "", 120);
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
        ${recipientEmail}, ${clean(input.message, 280)}, 'issued', now()
      )
    `;
    const created = await sql<CardRow>`
      select id, code, amount_cents, from_name, recipient_name, recipient_email,
             message, status
      from gift_cards where id = ${id}
    `;
    card = created[0];
  } else {
    await sql`
      update gift_cards
      set status = 'issued',
          issued_at = coalesce(issued_at, now()),
          balance_cents = coalesce(balance_cents, amount_cents),
          recipient_email = case
            when recipient_email = '' then ${recipientEmail}
            else recipient_email
          end
      where id = ${card.id}
    `;
    card = {
      ...card,
      status: "issued",
      recipient_email: card.recipient_email || recipientEmail,
    };
  }
  if (!card) throw new Error("Gift card could not be issued.");

  const amount = `$${(Number(card.amount_cents) / 100).toFixed(2)}`;
  const link = `${SITE}/gift-cards/${card.code}`;
  const imageUrl = giftCardImageUrl(card.code);
  const deliverTo = card.recipient_email || buyer;
  const when = clean(input.orderedAt, 40);

  // Warm the PNG renderer from the issued row (non-blocking — email URL is permanent).
  void import("@/lib/gift-card-image.server")
    .then(({ renderGiftCardPng }) =>
      renderGiftCardPng({
        amount,
        fromName: card.from_name || "",
        recipientName: card.recipient_name || "",
        message: card.message || "",
        code: card.code,
      }),
    )
    .catch((err) => console.error("[gift-card-png-warm]", err));

  const cardText = [
    card.recipient_name ? `${card.recipient_name},` : "Your gift card is ready.",
    "",
    `Amount: ${amount}`,
    card.from_name ? `From: ${card.from_name}` : "",
    card.message ? `Message: ${card.message}` : "",
    `Code: ${card.code}`,
    `E-card: ${link}`,
    `Card image: ${imageUrl}`,
    "",
    "Bring the code to 1108 K St NW, Floor 3, Washington, DC 20005.",
    "It covers fittings, simulator time, and shop work.",
  ]
    .filter((line) => line !== "")
    .join("\n");
  const studioBody = [
    "A Golf Doctor DC gift card was issued.",
    "",
    `Amount: ${amount}`,
    `Code: ${card.code}`,
    `E-card: ${link}`,
    `Card image: ${imageUrl}`,
    `From: ${card.from_name || "(not given)"}`,
    `Recipient: ${card.recipient_name || "(not given)"}`,
    `Recipient email: ${card.recipient_email || "(not given)"}`,
    `Delivered to: ${deliverTo || "no email on the order"}`,
    `Message: ${card.message || "(none)"}`,
    `Time: ${when || "(not given)"}`,
    `Order: ${card.id}`,
  ].join("\n");

  const cardHtml = recipientCardHtml({
    amount,
    fromName: card.from_name || "",
    recipientName: card.recipient_name || "",
    message: card.message || "",
    code: card.code,
    link,
    imageUrl,
  });
  const studioHtml = studioCardHtml({
    amount,
    fromName: card.from_name || "",
    recipientName: card.recipient_name || "",
    recipientEmail: card.recipient_email || "",
    message: card.message || "",
    code: card.code,
    link,
    imageUrl,
    deliverTo: deliverTo || "",
    when,
    orderId: card.id,
  });

  let emailed = false;
  let emailError = "";
  try {
    if (!deliverTo) throw new Error("No recipient or buyer email on the order");
    await sendMail(
      deliverTo,
      `Your ${amount} Golf Doctor DC gift card`,
      cardText,
      cardHtml,
    );
    await sendMail(
      STUDIO,
      `Gift card issued ${amount} ${card.code}`,
      studioBody,
      studioHtml,
    );
    emailed = true;
  } catch (err) {
    emailError = err instanceof Error ? err.message : "Email did not send";
  }

  const status = emailed ? "sent" : "recorded";
  const body = emailed ? studioBody : `${studioBody}\n\nEmail error: ${emailError}`;
  if (existingNotice[0]) {
    await sql`
      update gift_card_notices
      set status = ${status}, body = ${body}, to_email = ${deliverTo || STUDIO}
      where gift_card_id = ${card.id}
    `;
  } else {
    await sql`
      insert into gift_card_notices (
        id, gift_card_id, paypal_txn_id, to_email, subject, body, status
      ) values (
        ${`gn_${randomToken(9)}`}, ${card.id}, ${stripeId || card.id},
        ${deliverTo || STUDIO}, ${`Gift card issued ${amount} ${card.code}`},
        ${body}, ${status}
      )
    `;
  }
  return {
    ok: true as const,
    status,
    emailed,
    emailError,
    code: card.code,
    link,
    imageUrl,
    amount,
    fromName: card.from_name,
    recipientName: card.recipient_name,
    message: card.message,
  };
}
