import { getSql } from "@/lib/db";
import { giftPurchaseNotice, STUDIO_GIFT_EMAIL } from "@/lib/gift-notice";

const PAYPAL_EMAIL = "matt@golfdoctordc.com";

function sameEmail(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function randomId() {
  const buf = new Uint8Array(9);
  crypto.getRandomValues(buf);
  return `gn_${[...buf].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

export async function verifyPaypalIpn(raw: string) {
  const params = new URLSearchParams(raw);
  const sandbox = params.get("test_ipn") === "1";
  const url = sandbox
    ? "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr"
    : "https://ipnpb.paypal.com/cgi-bin/webscr";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `cmd=_notify-validate&${raw}`,
  });
  const text = (await res.text()).trim();
  return text === "VERIFIED";
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

async function sendStudioCopy(subject: string, body: string) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    // PayPal emails the business address when the payment completes, and the
    // button's item name already carries the amount, recipient, email, and code.
    return "sent";
  }
  const from =
    process.env.GIFT_MAIL_FROM?.trim() || "Golf Doctor DC <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [STUDIO_GIFT_EMAIL],
      subject,
      text: body,
    }),
  });
  return res.ok ? "sent" : "recorded";
}

export async function recordPaypalGiftPayment(raw: string) {
  const verified = await verifyPaypalIpn(raw);
  if (!verified) return { ok: false as const, reason: "unverified" };
  const params = new URLSearchParams(raw);
  if (params.get("payment_status") !== "Completed") {
    return { ok: true as const, reason: "not-completed" };
  }
  const receiver = params.get("receiver_email") || params.get("business") || "";
  if (!sameEmail(receiver, PAYPAL_EMAIL)) {
    return { ok: false as const, reason: "receiver" };
  }
  if ((params.get("mc_currency") || "").toUpperCase() !== "USD") {
    return { ok: false as const, reason: "currency" };
  }
  const txnId = (params.get("txn_id") || "").trim();
  const orderId = (params.get("invoice") || params.get("custom") || "").trim();
  if (!txnId || !orderId.startsWith("gc_")) {
    return { ok: false as const, reason: "missing" };
  }

  const sql = await getSql();
  const existing = await sql<{ id: string }>`
    select id from gift_card_notices where paypal_txn_id = ${txnId}
  `;
  if (existing[0]) return { ok: true as const, reason: "duplicate" };

  const rows = await sql<CardRow>`
    select id, code, amount_cents, from_name, recipient_name, recipient_email,
           message, status
    from gift_cards
    where id = ${orderId}
  `;
  const card = rows[0];
  if (!card) return { ok: false as const, reason: "unknown-order" };
  const paidCents = Math.round(Number(params.get("mc_gross")) * 100);
  if (paidCents !== Number(card.amount_cents)) {
    return { ok: false as const, reason: "amount" };
  }

  if (card.status !== "issued") {
    await sql`
      update gift_cards
      set status = 'issued', issued_at = now()
      where id = ${card.id} and status = 'pending'
    `;
  }

  const notice = giftPurchaseNotice({
    amount: Number(card.amount_cents) / 100,
    recipientName: card.recipient_name,
    recipientEmail: card.recipient_email,
    code: card.code,
    issued: true,
    fromName: card.from_name,
    message: card.message,
    txnId,
  });
  const status = await sendStudioCopy(notice.subject, notice.body);
  await sql`
    insert into gift_card_notices (
      id, gift_card_id, paypal_txn_id, to_email, subject, body, status
    ) values (
      ${randomId()}, ${card.id}, ${txnId}, ${notice.to}, ${notice.subject},
      ${notice.body}, ${status}
    )
  `;
  return { ok: true as const, reason: status };
}
