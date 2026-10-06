import { useMemo, useState, type FormEvent } from "react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DigitalGiftCard } from "@/components/site/digital-gift-card";

const STRIPE_GIFT_CARDS: Record<number, string> = {
  50: "https://buy.stripe.com/aFa9AT24JcIadua1I86Vq06",
  100: "https://buy.stripe.com/cNi00j24JbE6ahY3Qg6Vq07",
  150: "https://buy.stripe.com/6oU00jcJn8rUbm2fyY6Vq05",
  175: "https://buy.stripe.com/9B628rbFjgYq89Q5Yo6Vq03",
  200: "https://buy.stripe.com/dRmfZhcJn8rU9dU72s6Vq04",
  250: "https://buy.stripe.com/eVq14n10F9vYfCigD26Vq02",
  400: "https://buy.stripe.com/aFa00j9xb9vYbm23Qg6Vq01",
  1000: "https://buy.stripe.com/5kQeVd6kZgYqahYcmM6Vq00",
};

const STRIPE_CUSTOM =
  "https://buy.stripe.com/5kQ5kD38N4bEfCi86w6Vq08";

const AMOUNTS = Object.keys(STRIPE_GIFT_CARDS)
  .map(Number)
  .sort((a, b) => a - b);

const MIN_CUSTOM = 25;
const MAX_CUSTOM = 10000;

function parseCustom(raw: string) {
  const n = Number(raw.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

export function GiftCardPay() {
  const [amount, setAmount] = useState<number | "custom">(150);
  const [custom, setCustom] = useState("");
  const [fromName, setFromName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dollars = useMemo(() => {
    if (amount === "custom") return parseCustom(custom);
    return amount;
  }, [amount, custom]);

  const valid =
    amount === "custom"
      ? dollars !== null && dollars >= MIN_CUSTOM && dollars <= MAX_CUSTOM
      : amount in STRIPE_GIFT_CARDS;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!valid || dollars === null) {
      setError(
        amount === "custom"
          ? `Enter an amount between $${MIN_CUSTOM} and $${MAX_CUSTOM.toLocaleString()}.`
          : "Choose a gift card amount.",
      );
      return;
    }
    const base =
      amount === "custom" ? STRIPE_CUSTOM : STRIPE_GIFT_CARDS[amount];
    const url = new URL(base);
    if (recipientEmail.trim()) {
      url.searchParams.set("prefilled_email", recipientEmail.trim());
    }
    const note = [
      fromName.trim() && `From: ${fromName.trim()}`,
      recipient.trim() && `For: ${recipient.trim()}`,
      message.trim() && `Note: ${message.trim()}`,
    ]
      .filter(Boolean)
      .join(" | ");
    if (note) url.searchParams.set("client_reference_id", note.slice(0, 200));
    window.location.assign(url.toString());
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2">
      <DigitalGiftCard
        amount={valid ? dollars : null}
        fromName={fromName}
        recipientName={recipient}
        message={message}
      />
      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-border bg-surface p-6 sm:p-8"
      >
        <h3 className="font-display text-2xl font-semibold">
          Payment for Gift Card
        </h3>
        <p className="mt-1 text-sm text-muted">
          Pay with card, Apple Pay, or Google Pay on Stripe. The studio emails
          the redemption code after the payment clears.
        </p>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium">Select amount</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {AMOUNTS.map((n) => (
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
                ${n.toLocaleString()}
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
                placeholder="250.00"
                className="pl-7"
                required
              />
            </div>
            <p className="text-xs text-muted">
              Stripe will ask you to confirm this amount on the next page.
            </p>
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
          className="mt-5 flex h-12 w-full items-center justify-center rounded-md bg-clay text-sm font-medium text-clay-fg transition-colors hover:bg-clay-deep disabled:opacity-50"
          disabled={!valid}
        >
          {valid && dollars !== null
            ? `Pay $${dollars.toFixed(2)} with Stripe`
            : "Pay with Stripe"}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Checkout opens on Stripe for {SITE.shortName}. Apple Pay and Google
          Pay appear when the device supports them. Questions? Call {SITE.phone}.
        </p>
      </form>
    </div>
  );
}
