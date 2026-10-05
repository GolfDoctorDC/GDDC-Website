import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Kind = "contact" | "gift" | "trade";

const COPY: Record<
  Kind,
  { title: string; blurb: string; subject: string; extra?: string }
> = {
  contact: {
    title: "Send a note",
    blurb: "Appointments are required. Tell us what you need and we’ll get back to you.",
    subject: "Help me break Par!",
  },
  gift: {
    title: "Request a gift card",
    blurb:
      "Choose an amount and we’ll email a Golf Doctor DC gift card. Fittings, simulator time, and club work all apply.",
    subject: "Gift card request",
    extra: "amount",
  },
  trade: {
    title: "Request a trade-in quote",
    blurb:
      "Trade-in prices meet or exceed typical online offers. Describe the clubs and we’ll send a real-time quote.",
    subject: "Trade-in quote request",
    extra: "clubs",
  },
};

export function InquiryForm({
  kind,
  amount,
}: {
  kind: Kind;
  amount?: number | "custom";
}) {
  const [sent, setSent] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const copy = COPY[kind];

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const extra = String(data.get("extra") ?? "").trim();

    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      extra
        ? kind === "gift"
          ? `Gift amount: ${extra}`
          : `Clubs: ${extra}`
        : "",
      "",
      message,
    ]
      .filter((line, i, arr) => line !== "" || (i > 0 && arr[i - 1] !== ""))
      .join("\n");

    const href = `mailto:${SITE.email}?subject=${encodeURIComponent(copy.subject)}&body=${encodeURIComponent(lines)}`;
    window.location.href = href;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-forest text-forest-fg">
          <Check className="size-5" />
        </div>
        <h3 className="mt-4 font-display text-2xl">Thank you</h3>
        <p className="mt-2 text-sm text-muted">
          Your mail app should open with the details. If it doesn’t, write us at{" "}
          <a className="text-clay underline-offset-4 hover:underline" href={SITE.emailHref}>
            {SITE.email}
          </a>{" "}
          or call {SITE.phone}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h3 className="font-display text-2xl font-semibold">{copy.title}</h3>
        <p className="mt-1 text-sm text-muted">{copy.blurb}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${kind}-name`}>Name</Label>
          <Input id={`${kind}-name`} name="name" required autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${kind}-email`}>Email</Label>
          <Input
            id={`${kind}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${kind}-phone`}>Phone</Label>
        <Input
          id={`${kind}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
        />
      </div>
      {kind === "gift" ? (
        <div className="space-y-2">
          <Label htmlFor={`${kind}-extra`}>Amount</Label>
          <Input
            id={`${kind}-extra`}
            name="extra"
            value={
              amount === "custom"
                ? customAmount
                : amount
                  ? `$${amount}`
                  : ""
            }
            onChange={(e) => {
              if (amount === "custom") setCustomAmount(e.target.value);
            }}
            readOnly={amount !== "custom"}
            placeholder={amount === "custom" ? "Enter an amount" : "$150"}
            required
          />
        </div>
      ) : null}
      {kind === "trade" ? (
        <div className="space-y-2">
          <Label htmlFor={`${kind}-extra`}>Clubs to trade</Label>
          <Input
            id={`${kind}-extra`}
            name="extra"
            placeholder="Year, model, shafts, condition"
            required
          />
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor={`${kind}-message`}>
          {kind === "gift" ? "Recipient & note" : "Message"}
        </Label>
        <Textarea
          id={`${kind}-message`}
          name="message"
          required
          placeholder={
            kind === "gift"
              ? "Who is this for, and any message to include"
              : kind === "trade"
                ? "Anything else we should know"
                : "What would you like to book or ask about?"
          }
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        {kind === "gift"
          ? "Request gift card"
          : kind === "trade"
            ? "Request quote"
            : "Send message"}
      </Button>
    </form>
  );
}
