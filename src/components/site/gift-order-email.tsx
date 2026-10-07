import { useEffect, useState } from "react";
import { DigitalGiftCard } from "@/components/site/digital-gift-card";
import { emailGiftPurchase } from "@/lib/gift-order-email.functions";
import { clearGiftOrder, loadGiftOrder } from "@/lib/gift-order-mail";

const SENT_KEY = "gddc-gift-order-sent";

type Issued = {
  code: string;
  link: string;
  amount: string;
  fromName: string;
  recipientName: string;
  message: string;
};

export function GiftOrderEmail() {
  const [status, setStatus] = useState("Issuing the gift card…");
  const [card, setCard] = useState<Issued | null>(null);

  useEffect(() => {
    const order = loadGiftOrder();
    if (!order) {
      setStatus(
        "If this browser started the order, the e-card is already issued. Otherwise it is issued when Stripe confirms the payment.",
      );
      return;
    }
    let cancelled = false;
    emailGiftPurchase({ data: order })
      .then((result) => {
        if (order.orderId) sessionStorage.setItem(SENT_KEY, order.orderId);
        clearGiftOrder();
        if (cancelled) return;
        if (result.code && result.link) {
          setCard({
            code: result.code,
            link: result.link,
            amount: result.amount || order.amount,
            fromName: result.fromName || order.fromName,
            recipientName: result.recipientName || order.recipientName,
            message: result.message || order.message,
          });
        }
        if (result.emailed) {
          setStatus("The e-card was emailed to the recipient. A copy is on the studio desk.");
        } else if (result.status === "duplicate") {
          setStatus("This gift card was already issued.");
        } else {
          setStatus(
            `The card is issued, but the email did not send. ${result.emailError || "The live site has no mail key."}`,
          );
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus(
            err instanceof Error
              ? err.message
              : "The payment went through, but the card could not be issued from this page.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const dollars = card ? Number(card.amount.replace(/[^0-9.]/g, "")) : null;

  return (
    <div className="mt-8 max-w-xl">
      <p className="text-muted">{status}</p>
      {card ? (
        <div className="mt-6">
          <DigitalGiftCard
            amount={Number.isFinite(dollars) ? dollars : null}
            fromName={card.fromName}
            recipientName={card.recipientName}
            message={card.message}
            code={card.code}
          />
          <a href={card.link} className="mt-4 inline-flex text-sm font-medium text-clay">
            Open the e-card
          </a>
        </div>
      ) : null}
    </div>
  );
}
