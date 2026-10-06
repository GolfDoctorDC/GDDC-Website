import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow, Section } from "@/components/site/section";
import { GiftOrderEmail } from "@/components/site/gift-order-email";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/gift-card-thanks")({
  component: GiftCardThanksPage,
  head: () => ({
    meta: [{ title: "Payment received | The Golf Doctor DC" }],
  }),
});

function GiftCardThanksPage() {
  return (
    <main id="main">
      <PageHero
        image="/images/gift-card.jpg"
        eyebrow="Payment received"
        title="Your gift card is on the way."
        subtitle="Stripe confirmed the payment. The studio is emailed the amount, names, recipient email, message, and time."
        compact
      />
      <Section>
        <Eyebrow>Golf Doctor DC</Eyebrow>
        <h2 className="mt-3 font-display text-4xl font-semibold">
          What happens next
        </h2>
        <ol className="mt-6 max-w-2xl space-y-4 text-muted">
          <li>
            <span className="font-medium text-ink">1. The studio gets the order.</span>{" "}
            Amount, from name, recipient, recipient email, message, and time go
            to {SITE.email} automatically.
          </li>
          <li>
            <span className="font-medium text-ink">2. Check your email.</span>{" "}
            The receipt comes from Stripe. The gift-card code comes from the
            studio, at {SITE.email}.
          </li>
          <li>
            <span className="font-medium text-ink">3. Keep the code.</span>{" "}
            It covers fittings, simulator time, and shop work. It does not
            expire at checkout.
          </li>
          <li>
            <span className="font-medium text-ink">4. Redeem it at the studio.</span>{" "}
            Bring the code to {SITE.address.line1}, {SITE.address.line2}.
          </li>
        </ol>
        <GiftOrderEmail />
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={SITE.booksy}
            className="inline-flex h-11 items-center rounded-md bg-clay px-5 text-sm font-medium text-clay-fg"
          >
            Book a fitting
          </a>
          <Link
            to="/gift-cards"
            className="inline-flex h-11 items-center rounded-md border border-border px-5 text-sm font-medium"
          >
            Back to gift cards
          </Link>
          <a
            href={SITE.phoneHref}
            className="inline-flex h-11 items-center rounded-md border border-border px-5 text-sm font-medium"
          >
            {SITE.phone}
          </a>
        </div>
      </Section>
    </main>
  );
}
