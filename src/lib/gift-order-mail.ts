export const GIFT_ORDER_KEY = "gddc-gift-order";
export const STUDIO_GIFT_EMAIL = "matt@golfdoctordc.com";

export type GiftOrderDraft = {
  amount: string;
  fromName: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  orderedAt: string;
};

export function saveGiftOrder(order: GiftOrderDraft) {
  try {
    sessionStorage.setItem(GIFT_ORDER_KEY, JSON.stringify(order));
  } catch {
    /* Private browsing can block storage; the mailto still works from the form. */
  }
}

export function loadGiftOrder(): GiftOrderDraft | null {
  try {
    const raw = sessionStorage.getItem(GIFT_ORDER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GiftOrderDraft>;
    if (!parsed || typeof parsed.amount !== "string") return null;
    return {
      amount: parsed.amount,
      fromName: parsed.fromName ?? "",
      recipientName: parsed.recipientName ?? "",
      recipientEmail: parsed.recipientEmail ?? "",
      message: parsed.message ?? "",
      orderedAt: parsed.orderedAt ?? "",
    };
  } catch {
    return null;
  }
}

function line(label: string, value: string) {
  return `${label}: ${value.trim() || "(not given)"}`;
}

export function giftOrderMailto(order: GiftOrderDraft | null) {
  const amount = order?.amount?.trim() || "";
  const body = [
    "Golf Doctor DC gift card order",
    "",
    line("Amount", amount),
    line("From", order?.fromName ?? ""),
    line("Recipient", order?.recipientName ?? ""),
    line("Recipient email", order?.recipientEmail ?? ""),
    line("Message", order?.message ?? ""),
    line("Ordered at", order?.orderedAt ?? ""),
    "",
    "Stripe has the payment. This email is the gift-card note from the website.",
  ].join("\n");
  const subject = amount
    ? `Gift card order ${amount}`
    : "Gift card order";
  return `mailto:${STUDIO_GIFT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
