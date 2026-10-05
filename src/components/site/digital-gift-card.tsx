import { SITE } from "@/lib/site";

export function DigitalGiftCard({
  amount,
  balance,
  fromName,
  recipientName,
  message,
  code,
}: {
  amount: number | null;
  balance?: number | null;
  fromName?: string;
  recipientName?: string;
  message?: string;
  code?: string;
}) {
  const showing =
    balance != null && amount != null && Number.isFinite(balance) ? balance : amount;
  const dollars =
    showing !== null && Number.isFinite(showing) ? `$${showing.toFixed(2)}` : "—";
  const partial =
    balance != null &&
    amount != null &&
    Number.isFinite(balance) &&
    Number.isFinite(amount) &&
    balance < amount;
  const who = recipientName?.trim()
    ? `For ${recipientName.trim()}`
    : "For a golfer";
  const from = fromName?.trim() ? `From ${fromName.trim()}` : "";

  return (
    <article className="relative overflow-hidden rounded-2xl bg-forest text-forest-fg shadow-soft">
      <img
        src="/images/gift-card.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-forest/92 via-forest/84 to-forest-deep/92" />
      <div className="relative flex min-h-64 flex-col p-6 sm:min-h-72 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
              Digital gift card
            </p>
            <p className="mt-2 font-display text-3xl leading-none sm:text-4xl">
              {SITE.shortName}
            </p>
          </div>
          <p className="font-display text-4xl leading-none tabular-nums sm:text-5xl">
            {dollars}
          </p>
          {partial && amount != null ? (
            <p className="mt-2 text-sm text-forest-fg/70">
              of ${amount.toFixed(2)} purchased
            </p>
          ) : null}
        </div>
        <p className="mt-6 text-sm text-forest-fg/80">
          {who}
          {from ? <span className="text-forest-fg/50"> · {from}</span> : null}
        </p>
        {message?.trim() ? (
          <p className="mt-3 max-w-md font-display text-2xl italic leading-snug text-forest-fg">
            “{message.trim()}”
          </p>
        ) : (
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-forest-fg/70">
            Fittings, simulator time, and shop work at the K Street studio.
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-forest-fg/15 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-forest-fg/55">
              Redemption code
            </p>
            <p className="mt-1 font-mono text-lg tracking-[0.18em]">
              {code ?? "Issued after payment"}
            </p>
          </div>
          <p className="text-right text-xs leading-relaxed text-forest-fg/70">
            {SITE.tagline}
            <br />
            {SITE.address.line1}
          </p>
        </div>
      </div>
    </article>
  );
}
