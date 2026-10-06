export const GIFT_ORDER_KEY = "gddc-gift-order";
export const STUDIO_GIFT_EMAIL = "matt@golfdoctordc.com";

export type GiftOrderDraft = {
  amount: string;
  fromName: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  orderedAt: string;
  orderId?: string;
};

export function saveGiftOrder(order: GiftOrderDraft) {
  try {
    sessionStorage.setItem(GIFT_ORDER_KEY, JSON.stringify(order));
  } catch {
    /* Private browsing can block storage. The Stripe note still has the order. */
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
      orderId: parsed.orderId,
    };
  } catch {
    return null;
  }
}

export function clearGiftOrder() {
  try {
    sessionStorage.removeItem(GIFT_ORDER_KEY);
  } catch {
    /* Ignore storage failures. */
  }
}
