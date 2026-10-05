import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow, Section } from "@/components/site/section";
import { CREDENTIALS } from "@/lib/site";

export const Route = createFileRoute("/partners")({
  component: PartnersPage,
  head: () => ({
    meta: [{ title: "Partners | The Golf Doctor DC" }],
  }),
});

function PartnersPage() {
  return (
    <main id="main">
      <PageHero
        image="/images/woods.jpg"
        eyebrow="Partners"
        title="Certified by the names on the shafts."
        subtitle="Independent fitting — with factory recognition from the companies that make the equipment."
        compact
      />
      <Section>
        <Eyebrow>Certifications</Eyebrow>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold">
          The same standards the manufacturers require of their own fitters.
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          We are not a big-box fitting bay. The studio is independently owned,
          and the certifications below are earned — Golf Digest listings,
          clubmaking guilds, and brand fitter programs including PING, Callaway,
          KBS, True Temper, and Rifle.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CREDENTIALS.map((c) => (
            <article
              key={c.title}
              className="flex min-h-40 flex-col justify-between rounded-xl border border-border bg-surface p-6"
            >
              <p className="font-display text-2xl font-semibold leading-snug">
                {c.title}
              </p>
              <p className="mt-4 text-sm text-muted">{c.detail}</p>
            </article>
          ))}
        </div>
        <Button asChild className="mt-10">
          <Link to="/fitting">Book with a certified fitter</Link>
        </Button>
      </Section>
    </main>
  );
}
