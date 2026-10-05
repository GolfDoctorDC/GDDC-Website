import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow, Section } from "@/components/site/section";
import { SHOP_SERVICES, SITE } from "@/lib/site";

export const Route = createFileRoute("/club-making")({
  component: ClubMakingPage,
  head: () => ({
    meta: [{ title: "Club Making | The Golf Doctor DC" }],
  }),
});

function ClubMakingPage() {
  return (
    <main id="main">
      <PageHero
        image="/images/workshop-bench.jpg"
        eyebrow="Club Making"
        title="Built on site. By the same person who fitted you."
        subtitle="The best fitting in the world is worthless if the clubs you play don't match the prescription."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>What happens after the fitting</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              You know exactly who is building your clubs.
            </h2>
            <div className="mt-5 space-y-4 text-muted">
              <p>
                In most shops, the fitter takes your numbers and phones or emails
                them off to some unidentified person who — hopefully — builds the
                clubs to match. Maybe they take the time. Maybe they don’t. Maybe
                it is an assembly line where ten people touch your clubs and none
                of them are accountable for mistakes.
              </p>
              <p>
                In the end, you are at the mercy of whoever builds your clubs. At
                The Golf Doctor-DC it is all done on site. We are certified by
                the Professional Clubmakers Society and the Golf Clubmakers
                Association.
              </p>
            </div>
          </div>
          <img
            src="/images/workshop.jpg"
            alt="Loft and lie machine in the club making workshop"
            className="h-80 w-full rounded-xl object-cover"
          />
        </div>
      </Section>

      <section className="border-y border-border bg-surface">
        <Section>
          <Eyebrow>Full-service shop</Eyebrow>
          <h2 className="mt-3 font-display text-4xl font-semibold">
            Alterations and adjustments for the clubs you already own.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHOP_SERVICES.map((svc) => (
              <article
                key={svc.title}
                className="rounded-xl border border-border bg-paper p-6"
              >
                <h3 className="font-display text-2xl font-semibold">
                  {svc.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {svc.text}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild>
              <a href={SITE.phoneHref}>Call about shop work</a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/fitting">Start with a fitting</Link>
            </Button>
          </div>
        </Section>
      </section>
    </main>
  );
}
