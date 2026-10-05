import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow, Section } from "@/components/site/section";
import { FITTINGS, SITE } from "@/lib/site";

export const Route = createFileRoute("/book")({
  component: BookPage,
  head: () => ({
    meta: [{ title: "Book Now | The Golf Doctor DC" }],
  }),
});

function BookPage() {
  return (
    <main id="main">
      <PageHero
        image="/images/putting-1.jpg"
        eyebrow="Book Now"
        title="Schedule a fitting."
        subtitle="Online booking is through Booksy. Prefer the phone? Call the studio and we’ll find a time."
        compact
      />
      <Section>
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <Eyebrow>Booksy</Eyebrow>
            <h2 className="mt-2 font-display text-3xl font-semibold">
              Reserve a time online
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Choose a service, pick a slot, and you’re on the books. All
              fittings are by appointment only.
            </p>
          </div>
          <Button asChild size="lg">
            <a href={SITE.booksy} target="_blank" rel="noreferrer">
              Open Booksy
              <ExternalLink />
            </a>
          </Button>
        </div>

        <h3 className="mt-12 font-display text-2xl font-semibold">Services</h3>
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-paper">
          {FITTINGS.map((fit) => (
            <li
              key={fit.id}
              className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{fit.name}</p>
                <p className="text-sm text-muted">{fit.duration}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="tabular-nums text-clay">{fit.price}</span>
                <Button asChild size="sm">
                  <a href={SITE.booksy} target="_blank" rel="noreferrer">
                    Book
                  </a>
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-muted">
          Questions before you book?{" "}
          <a className="text-clay underline-offset-4 hover:underline" href={SITE.phoneHref}>
            {SITE.phone}
          </a>{" "}
          ·{" "}
          <Link to="/location" className="text-clay underline-offset-4 hover:underline">
            Hours & address
          </Link>
        </p>
      </Section>
    </main>
  );
}
