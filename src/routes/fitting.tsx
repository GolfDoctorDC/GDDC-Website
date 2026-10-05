import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow, Section } from "@/components/site/section";
import { FITTINGS, SITE } from "@/lib/site";

export const Route = createFileRoute("/fitting")({
  component: FittingPage,
  head: () => ({
    meta: [{ title: "Club Fitting | The Golf Doctor DC" }],
  }),
});

function FittingPage() {
  return (
    <main id="main">
      <PageHero
        image="/images/sunset-golf.jpg"
        eyebrow="Club Fitting"
        title="better golf…by design"
        subtitle="A comprehensive, performance-based process developed over 20 years — with thousands of test club combinations and TrackMan 4."
      />

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <img
            src="/images/fitting-bay.jpg"
            alt="TaylorMade golf balls on the studio turf with the club wall and TrackMan bay behind"
            className="h-80 w-full rounded-xl object-cover object-bay"
          />
          <div>
            <Eyebrow>The process</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Clubs that outperform what you play now.
            </h2>
            <div className="mt-5 space-y-4 text-muted">
              <p>
                We use the latest analysis equipment, including TrackMan 4, to
                collect data while you hit — and more importantly, so you can
                see what is actually happening and where your shots actually go.
                Ball speed, spin rate, and the rest of the story, live.
              </p>
              <p>
                Other so-called fitting systems give you few options even as
                they make you believe you are being accurately fit. We have
                literally thousands of different test club combinations to
                determine the proper shaft for you.
              </p>
            </div>
            <Button asChild className="mt-6">
              <a href={SITE.booksy} target="_blank" rel="noreferrer">
                Book a fitting
              </a>
            </Button>
          </div>
        </div>
      </Section>

      <section className="border-y border-border bg-surface">
        <Section>
          <Eyebrow>Sessions & pricing</Eyebrow>
          <h2 className="mt-3 font-display text-4xl font-semibold">
            Choose the work that matches the bag.
          </h2>
          <div className="mt-10 space-y-8">
            {FITTINGS.map((fit) => (
              <article
                key={fit.id}
                id={fit.id}
                className="scroll-mt-28 rounded-xl border border-border bg-paper p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-3xl font-semibold">
                      {fit.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {fit.duration ?? "By appointment"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-3xl tabular-nums text-clay">
                      {fit.price}
                    </p>
                    {fit.featured ? (
                      <Badge className="mt-1">$200 off unbundled</Badge>
                    ) : null}
                  </div>
                </div>
                <div className="mt-5 space-y-3 text-muted">
                  {fit.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <Button asChild className="mt-6">
                  <a href={SITE.booksy} target="_blank" rel="noreferrer">
                    Book Now
                  </a>
                </Button>
              </article>
            ))}
          </div>
        </Section>
      </section>

      <Section className="text-center">
        <h2 className="font-display text-3xl font-semibold">
          Prefer to talk it through first?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          Call {SITE.phone} or send a note. All fittings are by appointment.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <a href={SITE.phoneHref}>Call the studio</a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/location">Visit & hours</Link>
          </Button>
        </div>
      </Section>
    </main>
  );
}
