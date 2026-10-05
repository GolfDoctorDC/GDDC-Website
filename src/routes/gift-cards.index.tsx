import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow, Section } from "@/components/site/section";
import { GiftCardPay } from "@/components/site/gift-card-pay";

export const Route = createFileRoute("/gift-cards/")({
  component: GiftCardsPage,
  head: () => ({
    meta: [{ title: "Gift Cards | The Golf Doctor DC" }],
  }),
});

function GiftCardsPage() {
  return (
    <main id="main">
      <PageHero
        image="/images/gift-card.jpg"
        eyebrow="Gift Cards"
        title="The gift that actually fits."
        subtitle="A digital Golf Doctor DC gift card. Pay with PayPal and the card is issued automatically — fittings, simulator time, and shop work."
        compact
      />
      <Section>
        <Eyebrow>Digital gift card</Eyebrow>
        <h2 className="mt-3 font-display text-4xl font-semibold">
          Buy a digital gift card
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Choose an amount, add a note, and pay on this page. When PayPal
          confirms the payment, the card is issued with a redemption code. No
          waiting on the studio to email one.
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <li>Introductory fitting — $150</li>
          <li>Driver or long game — $150</li>
          <li>Iron fitting — $175</li>
          <li>Full bag fitting — $400</li>
        </ul>
        <div className="mt-10">
          <GiftCardPay />
        </div>
      </Section>
    </main>
  );
}
