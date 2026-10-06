import { useEffect, useState } from "react";
import { emailGiftPurchase } from "@/lib/gift-order-email.functions";
import { clearGiftOrder, loadGiftOrder } from "@/lib/gift-order-mail";

const SENT_KEY = "gddc-gift-order-sent";

export function GiftOrderEmail() {
  const [status, setStatus] = useState("Sending the order to the studio…");

  useEffect(() => {
    const order = loadGiftOrder();
    if (!order) {
      setStatus(
        "Stripe has the payment. If this browser did not start the order, the studio email comes from the payment webhook.",
      );
      return;
    }
    const sentId = sessionStorage.getItem(SENT_KEY);
    if (order.orderId && sentId === order.orderId) {
      setStatus("The studio already has this order by email.");
      return;
    }
    let cancelled = false;
    emailGiftPurchase({ data: order })
      .then(() => {
        if (order.orderId) sessionStorage.setItem(SENT_KEY, order.orderId);
        clearGiftOrder();
        if (!cancelled) setStatus("The studio has been emailed this order.");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus(
            "The payment went through. The studio email did not send from this page; the payment webhook will retry it.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <p className="mt-6 max-w-2xl text-muted">{status}</p>;
}
