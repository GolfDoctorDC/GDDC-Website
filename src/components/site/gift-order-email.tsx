import { useEffect, useState } from "react";
import {
  giftOrderMailto,
  loadGiftOrder,
  STUDIO_GIFT_EMAIL,
  type GiftOrderDraft,
} from "@/lib/gift-order-mail";

export function GiftOrderEmail({ draft }: { draft?: GiftOrderDraft | null }) {
  const [order, setOrder] = useState<GiftOrderDraft | null>(draft ?? null);

  useEffect(() => {
    if (draft) return;
    setOrder(loadGiftOrder());
  }, [draft]);

  const href = giftOrderMailto(order);

  return (
    <div className="mt-8 max-w-2xl rounded-xl border border-border bg-surface p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Studio copy
      </p>
      <h3 className="mt-2 font-display text-2xl font-semibold">
        Email this order to the studio
      </h3>
      <p className="mt-2 text-sm text-muted">
        Sends the amount, names, recipient email, and message to{" "}
        {STUDIO_GIFT_EMAIL}. Stripe still sends the receipt separately.
      </p>
      {order ? (
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="w-32 text-muted">Amount</dt>
            <dd>{order.amount || "(not given)"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-32 text-muted">From</dt>
            <dd>{order.fromName || "(not given)"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-32 text-muted">Recipient</dt>
            <dd>{order.recipientName || "(not given)"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-32 text-muted">Email</dt>
            <dd>{order.recipientEmail || "(not given)"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-32 text-muted">Message</dt>
            <dd>{order.message || "(none)"}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-4 text-sm text-muted">
          This browser does not have the form details. The link still opens a
          note to the studio so the amount can be filled in from the Stripe
          receipt.
        </p>
      )}
      <a
        href={href}
        className="mt-5 inline-flex h-11 items-center rounded-md bg-clay px-5 text-sm font-medium text-clay-fg"
      >
        Email order to {STUDIO_GIFT_EMAIL}
      </a>
    </div>
  );
}
