import { createServerFn } from "@tanstack/react-start";
import type { GiftOrderMail } from "@/lib/gift-order-mail.server";

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export const emailGiftPurchase = createServerFn({ method: "POST" })
  .validator((input: unknown): GiftOrderMail => {
    if (!input || typeof input !== "object") {
      throw new Error("Gift card order is missing.");
    }
    const raw = input as Record<string, unknown>;
    const amount = clean(raw.amount, 40);
    if (!amount) throw new Error("Gift card amount is missing.");
    return {
      amount,
      fromName: clean(raw.fromName, 80),
      recipientName: clean(raw.recipientName, 80),
      recipientEmail: clean(raw.recipientEmail, 120),
      message: clean(raw.message, 280),
      orderedAt: clean(raw.orderedAt, 40),
      orderId: clean(raw.orderId, 80) || undefined,
    };
  })
  .handler(async ({ data }) => {
    const { emailGiftOrder } = await import("@/lib/gift-order-mail.server");
    return emailGiftOrder(data);
  });
