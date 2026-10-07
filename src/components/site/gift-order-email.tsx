import { useEffect, useState } from "react";
import { emailGiftPurchase } from "@/lib/gift-order-email.functions";
import { clearGiftOrder, loadGiftOrder } from "@/lib/gift-order-mail";

const SENT_KEY = "gddc-gift-order-sent";

export function GiftOrderEmail() {
  const [status, setStatus] = useState("Issuing the gift card…");

  useEffect(() => {
    const order = loadGiftOrder();
    if (!order) {
      setStatus(
        "If this browser started the order, the e-card is already issued. Otherwise it is issued when Stripe confirms the payment.",
      );
      return;
    }
    const sentId = sessionStorage.getItem(SENT_KEY);
    if (order.orderId && sentId === order.orderId) {
      setStatus("This gift card was already issued and emailed.");
      return;
    }
    let cancelled = false;
    emailGiftPurchase({ data: order })
      .then((result) => {
        if (order.orderId) sessionStorage.setItem(SENT_KEY, order.orderId);
        clearGiftOrder();
        if (cancelled) return;
        setStatus(
          result.status === "duplicate"
            ? "This gift card was already issued and emailed."
            : "The e-card was emailed to the recipient, or to you if no recipient email was given. A copy is on the studio desk.",
        );
      })
      .catch(() => {
        if (!cancelled) {
          setStatus(
            "The payment went through. The e-card email did not send from this page; Stripe will retry it when the webhook confirms the payment.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <p className="mt-6 max-w-2xl text-muted">{status}</p>;
}
