import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { GIFT_AMOUNTS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DigitalGiftCard } from "@/components/site/digital-gift-card";
import { paypalPurchaseLabel } from "@/lib/gift-notice";
import {
  createGiftCardOrder,
  deliverGiftCard,
  type IssuedGiftCard,
} from "@/lib/gift-cards.functions";

const MIN_CUSTOM = 25;
const MAX_CUSTOM = 5000;

function parseCustom(raw: string) {
  const n = Number(raw.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

function PayPalLockup() {
  return (
    <span
      className="text-[17px] font-bold tracking-tight"
      style={{ fontFamily: "Verdana, Geneva, Tahoma, sans-serif" }}
    >
      <span className="text-[#003087]">Pay</span>
      <span className="text-[#009CDE]">Pal</span>
    </span>
  );
}

function DeliveredCard({ card }: { card: IssuedGiftCard }) {
  const [copied, setCopied] = useState("");
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/gift-cards/${card.code}`
      : `/gift-cards/${card.code}`;

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
    } catch {
      setCopied("");
    }
  }

  const mail = card.recipientEmail
    ? `mailto:${encodeURIComponent(card.recipientEmail)}?subject=${encodeURIComponent(
        `${SITE.shortName} gift card`,
      )}&body=${encodeURIComponent(
        `${card.recipientName ? `Hi ${card.recipientName},\n\n` : ""}A ${card.amount.toFixed(2)} Golf Doctor DC digital gift card is ready.\n\nCode: ${card.code}\n${link}\n${card.message ? `\n“${card.message}”\n` : ""}\nPresent the code at ${SITE.address.line1}.`,
      )}`
    : "";

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-forest text-forest-fg">
          <Check className="size-5" />
        </div>
        <div>
          <h3 className="font-display text-3xl">Gift card issued</h3>
          <p className="text-sm text-muted">
            Payment cleared. This card is ready to forward
            {card.recipientEmail ? ` to ${card.recipientEmail}` : ""}.
          </p>
        </div>
      </div>
      <DigitalGiftCard
        amount={card.amount}
        fromName={card.fromName}
        recipientName={card.recipientName}
        message={card.message}
        code={card.code}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => copy("code", card.code)}
          className="h-10 rounded-md border border-border bg-surface px-4 text-sm font-medium"
        >
          {copied === "code" ? "Code copied" : "Copy code"}
        </button>
        <button
          type="button"
          onClick={() => copy("link", link)}
          className="h-10 rounded-md border border-border bg-surface px-4 text-sm font-medium"
        >
          {copied === "link" ? "Link copied" : "Copy card link"}
        </button>
        {mail ? (
          <a
            href={mail}
            className="inline-flex h-10 items-center rounded-md bg-clay px-4 text-sm font-medium text-clay-fg"
          >
            Email the card
          </a>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-muted">
        The recipient opens the link, or reads the code at the studio. Questions?
        Call {SITE.phone}.
      </p>
    </div>
  );
}

export function GiftCardPay() {
  const [amount, setAmount] = useState<number | "custom">(150);
  const [custom, setCustom] = useState("");
  const [fromName, setFromName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [delivered, setDelivered] = useState<IssuedGiftCard | null>(null);
  const [origin, setOrigin] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    const params = new URLSearchParams(window.location.search);
    const order = params.get("order");
    const token = params.get("token");
    if (!order || !token) return;
    setIssuing(true);
    deliverGiftCard({ data: { id: order, claimToken: token } })
      .then(setDelivered)
      .catch(() => setError("We couldn’t issue that gift card. Call the studio."))
      .finally(() => setIssuing(false));
  }, []);

  const dollars = useMemo(() => {
    if (amount === "custom") return parseCustom(custom);
    return amount;
  }, [amount, custom]);

  const valid =
    dollars !== null && dollars >= MIN_CUSTOM && dollars <= MAX_CUSTOM;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!valid || dollars === null) {
      setError(
        amount === "custom"
          ? `Enter an amount between $${MIN_CUSTOM} and $${MAX_CUSTOM.toLocaleString()}.`
          : "Choose a gift card amount.",
      );
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const order = await createGiftCardOrder({
        data: {
          amount: dollars,
          fromName,
          recipientName: recipient,
          recipientEmail,
          message,
        },
      });
      const form = formRef.current;
      if (!form) return;
      const set = (name: string, value: string) => {
        const field = form.elements.namedItem(name);
        if (field instanceof HTMLInputElement) field.value = value;
      };
      set("amount", order.amount.toFixed(2));
      set("invoice", order.id);
      set("custom", order.id);
      set(
        "item_name",
        paypalPurchaseLabel({
          amount: order.amount,
          recipientName: recipient.trim() || "recipient not named",
          recipientEmail: recipientEmail.trim() || "no email",
          code: order.code,
          issued: true,
        }),
      );
      set("notify_url", `${origin}/api/paypal-ipn`);
      set(
        "return",
        `${origin}/gift-cards?order=${encodeURIComponent(order.id)}&token=${encodeURIComponent(order.claimToken)}`,
      );
      set("cancel_return", `${origin}/gift-cards`);
      form.submit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t start checkout.");
      setSubmitting(false);
    }
  }

  if (issuing) {
    return (
      <p className="text-sm text-muted" role="status">
        Payment received. Issuing the digital gift card…
      </p>
    );
  }

  if (delivered) return <DeliveredCard card={delivered} />;

  const itemName = recipient
    ? `${SITE.shortName} Gift Card for ${recipient}`
    : `${SITE.shortName} Digital Gift Card`;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2">
      <DigitalGiftCard
        amount={valid ? dollars : null}
        fromName={fromName}
        recipientName={recipient}
        message={message}
      />
      <form
        ref={formRef}
        action="https://www.paypal.com/cgi-bin/webscr"
        method="post"
        onSubmit={onSubmit}
        className="rounded-xl border border-border bg-surface p-6 sm:p-8"
      >
        <input type="hidden" name="cmd" value="_xclick" />
        <input type="hidden" name="business" value={SITE.paypalEmail} />
        <input type="hidden" name="currency_code" value="USD" />
        <input type="hidden" name="no_shipping" value="1" />
        <input type="hidden" name="no_note" value="1" />
        <input type="hidden" name="tax" value="0" />
        <input type="hidden" name="lc" value="US" />
        <input type="hidden" name="charset" value="utf-8" />
        <input type="hidden" name="rm" value="1" />
        <input
          type="hidden"
          name="bn"
          value="PP-BuyNowBF:btn_buynow_LG.gif:NonHosted"
        />
        <input type="hidden" name="item_name" value={itemName} />
        <input type="hidden" name="item_number" value="GIFT-CARD" />
        <input type="hidden" name="invoice" value="" />
        <input type="hidden" name="custom" value="" />
        <input type="hidden" name="notify_url" value="" />
        <input
          type="hidden"
          name="amount"
          value={valid && dollars !== null ? dollars.toFixed(2) : ""}
        />
        <input type="hidden" name="return" value="" />
        <input type="hidden" name="cancel_return" value="" />

        <h3 className="font-display text-2xl font-semibold">
          Payment for Gift Card
        </h3>
        <p className="mt-1 text-sm text-muted">
          Pay with PayPal. When PayPal confirms the payment, a purchase email
          goes to the studio with the amount, recipient, and code.
        </p>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium">Select amount</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {GIFT_AMOUNTS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setAmount(n);
                  setError("");
                }}
                className={cn(
                  "h-12 rounded-md border text-sm font-medium tabular-nums transition-colors duration-150",
                  amount === n
                    ? "border-clay bg-clay text-clay-fg"
                    : "border-border bg-paper text-ink hover:border-clay/50",
                )}
              >
                ${n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setAmount("custom");
                setError("");
              }}
              className={cn(
                "h-12 rounded-md border text-sm font-medium transition-colors duration-150",
                amount === "custom"
                  ? "border-clay bg-clay text-clay-fg"
                  : "border-border bg-paper text-ink hover:border-clay/50",
              )}
            >
              Custom
            </button>
          </div>
        </fieldset>

        {amount === "custom" ? (
          <div className="mt-4 space-y-2">
            <Label htmlFor="gift-custom">Custom amount</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                $
              </span>
              <Input
                id="gift-custom"
                inputMode="decimal"
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setError("");
                }}
                placeholder="25.00"
                className="pl-7"
                required
              />
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gift-from">Your name</Label>
            <Input
              id="gift-from"
              autoComplete="name"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="Who is this from?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gift-recipient">Recipient</Label>
            <Input
              id="gift-recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Who is this for?"
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="gift-recipient-email">Recipient email</Label>
          <Input
            id="gift-recipient-email"
            type="email"
            autoComplete="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="Where should the card go?"
          />
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="gift-message">Message (optional)</Label>
          <Textarea
            id="gift-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="A short note to include with the card"
            className="min-h-24"
          />
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Total
          </p>
          <p className="font-display text-3xl font-semibold tabular-nums">
            {valid && dollars !== null ? `$${dollars.toFixed(2)}` : "—"}
          </p>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#FFC439] shadow-sm transition-colors hover:bg-[#f2b72b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003087] focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50"
          disabled={!valid || submitting}
          aria-label={
            valid && dollars !== null
              ? `Pay $${dollars.toFixed(2)} with PayPal`
              : "Pay with PayPal"
          }
        >
          <span className="text-sm font-semibold text-[#003087]">
            {submitting ? "Starting checkout…" : "Pay with"}
          </span>
          {submitting ? null : <PayPalLockup />}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Checkout opens on PayPal. The studio email is sent after PayPal
          records the payment.
        </p>
      </form>
    </div>
  );
}
