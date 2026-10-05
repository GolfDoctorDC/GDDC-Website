import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Recycle, Search, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow, Section } from "@/components/site/section";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/trade-in")({
  component: TradeInPage,
  head: () => ({
    meta: [{ title: "Trade In Clubs | The Golf Doctor DC" }],
  }),
});

const STEPS = [
  {
    icon: Search,
    title: "Look up your clubs",
    body: "Search drivers, irons, wedges, putters, and accessories in the Golf Stix value guide.",
  },
  {
    icon: Recycle,
    title: "Get an instant value",
    body: "Real-time market pricing — not a guess. Trade-in values meet or exceed typical online offers.",
  },
  {
    icon: Wallet,
    title: "Apply it as store credit",
    body: "Credit goes toward a fitting, new clubs, or club work at The Golf Doctor DC.",
  },
] as const;

function TradeInPage() {
  return (
    <main id="main">
      <PageHero
        image="/images/irons.jpg"
        eyebrow="Trade In"
        title="Turn old clubs into store credit."
        subtitle="Look up what you have, get an instant value, and put the credit toward new equipment fit here in the studio."
      />

      <Section>
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold">
          Three steps. Credit you can spend here.
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <article
              key={step.title}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                0{i + 1}
              </p>
              <step.icon className="mt-4 size-5 text-clay" />
              <h3 className="mt-3 font-display text-2xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <section className="border-y border-border bg-surface">
        <Section>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Value guide</Eyebrow>
              <h2 className="mt-3 font-display text-4xl font-semibold">
                Get your trade-in value
              </h2>
              <p className="mt-3 max-w-xl text-muted">
                Search Golf Clubs or Accessories below. When you are ready,
                complete the trade and we will apply the credit at the studio.
              </p>
            </div>
            <Button asChild variant="outline">
              <a href={SITE.tradeIn} target="_blank" rel="noreferrer">
                Open in a new tab
                <ExternalLink />
              </a>
            </Button>
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-paper">
            <iframe
              title="Golf Stix trade-in value guide"
              src={SITE.tradeIn}
              className="h-[52rem] w-full bg-paper sm:h-[58rem]"
            />
          </div>
          <p className="mt-3 text-xs text-muted">
            Powered by Golf Stix Value Guide. Values update with the market.
          </p>
        </Section>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>After you get a value</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Drop clubs at the studio — or ask us to walk through it.
            </h2>
            <p className="mt-4 text-muted">
              Bring the clubs to {SITE.address.line1} and we will handle the
              rest. Prefer to talk first? Call or email and we will go over
              the set with you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href={SITE.phoneHref}>Call {SITE.phone}</a>
              </Button>
              <Button asChild variant="outline">
                <Link to="/location">Hours & address</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold">
              Ready for the new set?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Pair a trade-in with a TrackMan fitting so the credit goes toward
              clubs that actually fit. Full bag, driver, irons, wedges, and
              putter sessions are all by appointment.
            </p>
            <Button asChild className="mt-6">
              <a href={SITE.booksy} target="_blank" rel="noreferrer">
                Book a fitting
                <ExternalLink />
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
