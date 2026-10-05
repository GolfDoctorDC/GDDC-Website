export const STUDIO_GIFT_EMAIL = "matt@golfdoctordc.com";

export type GiftPurchaseNotice = {
  to: string;
  subject: string;
  body: string;
  paypalLabel: string;
};

export function giftPurchaseNotice(input: {
  amount: number;
  recipientName: string;
  recipientEmail: string;
  code: string;
  issued: boolean;
  fromName?: string;
  message?: string;
  txnId?: string;
}): GiftPurchaseNotice {
  const who = input.recipientName.trim() || "—";
  const email = input.recipientEmail.trim() || "—";
  const issued = input.issued ? "yes" : "no";
  const amount = `$${input.amount.toFixed(2)}`;
  const subject = `Gift card payment ${amount} for ${who === "—" ? "a recipient" : who}`;
  const lines = [
    "PayPal confirmed a Golf Doctor DC gift card payment.",
    "",
    `Amount: ${amount}`,
    `For: ${who}`,
    `Email: ${email}`,
    `Issued: ${issued}`,
    `Code: ${input.code}`,
  ];
  if (input.fromName?.trim()) lines.push(`From: ${input.fromName.trim()}`);
  if (input.message?.trim()) lines.push(`Note: ${input.message.trim()}`);
  if (input.txnId?.trim()) lines.push(`PayPal transaction: ${input.txnId.trim()}`);
  const paypalLabel = paypalPurchaseLabel({
    amount: input.amount,
    recipientName: who === "—" ? "recipient not named" : who,
    recipientEmail: email === "—" ? "no email" : email,
    code: input.code,
    issued: input.issued,
  });
  return {
    to: STUDIO_GIFT_EMAIL,
    subject,
    body: lines.join("\n"),
    paypalLabel,
  };
}

export function paypalPurchaseLabel(input: {
  amount: number;
  recipientName: string;
  recipientEmail: string;
  code: string;
  issued: boolean;
}) {
  const issued = input.issued ? "Issued: yes" : "Issued: when PayPal confirms";
  const tail = ` | ${input.code}`;
  const head = `${issued} | $${input.amount.toFixed(2)} | for ${input.recipientName} | ${input.recipientEmail}`;
  const room = 127 - tail.length;
  return `${head.slice(0, Math.max(0, room))}${tail}`.slice(0, 127);
}
