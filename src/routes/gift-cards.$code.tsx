import { createFileRoute, Link } from "@tanstack/react-router";
import { DigitalGiftCard } from "@/components/site/digital-gift-card";
import { Section } from "@/components/site/section";
import { getIssuedGiftCard } from "@/lib/gift-cards.functions";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/gift-cards/$code")({
  loader: ({ params }) => getIssuedGiftCard({ data: { code: params.code } }),
  component: GiftCardRedeemPage,
  head: () => ({
    meta: [{ title: "Digital Gift Card | The Golf Doctor DC" }],
  }),
});

function GiftCardRedeemPage() {
  const card = Route.useLoaderData();

  return (
    <main id="main">
      <Section className="max-w-xl">
        {card ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-clay">
              Digital gift card
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold">
              {card.recipientName
                ? `${card.recipientName}, this is yours.`
                : "Your Golf Doctor DC gift card."}
            </h1>
            <p className="mt-3 text-muted">
              Present this code at {SITE.address.line1}. It covers fittings,
              simulator time, and shop work.
            </p>
            <div className="mt-8">
              <DigitalGiftCard
                amount={card.amount}
                balance={card.balance}
                fromName={card.fromName}
                recipientName={card.recipientName}
                message={card.message}
                code={card.code}
              />
            </div>
          </>
        ) : (
          <>
            <h1 className="font-display text-4xl font-semibold">
              That gift card isn’t active.
            </h1>
            <p className="mt-3 text-muted">
              The code may be mistyped, or the card hasn’t been issued yet.
              Call {SITE.phone} and we’ll look it up.
            </p>
            <Link
              to="/gift-cards"
              className="mt-6 inline-flex text-sm font-medium text-clay"
            >
              Buy a gift card
            </Link>
          </>
        )}
      </Section>
    </main>
  );
}
