import { createFileRoute, Link } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow, Section } from "@/components/site/section";
import { CREDENTIALS } from "@/lib/site";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [{ title: "About | The Golf Doctor DC" }],
  }),
});

const TIMELINE = [
  {
    year: "1996",
    text: "The Golf Doctor is founded with a single goal: properly fitted golf equipment for the golfing public — the same standard of service previously available only to the professional golfer.",
  },
  {
    year: "2011",
    text: "Matt Grabowy is recognized by Golf Digest as a Top 100 Clubfitter, the first of five listings.",
  },
  {
    year: "2016",
    text: "The Golf Doctor-DC opens in Washington, bringing the fitting studio and on-site build shop to K Street.",
  },
  {
    year: "2018",
    text: "Matt is named International Clubmaker of the Year by the International Clubmakers Guild. The studio is also recognized as GCA International Clubmaker of the World and PCS Regional Clubmaker of the Year.",
  },
  {
    year: "2019",
    text: "Matt becomes a founding member of TaylorMade Golf’s National Fitters Council.",
  },
];

function AboutPage() {
  return (
    <main id="main">
      <section className="bg-forest text-forest-fg">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-clay">
            About Us
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold sm:text-6xl">
            The Golf Doctor-DC
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-forest-fg/80 sm:text-lg">
            Expertise and technology in Washington, D.C. — from beginners to PGA
            Tour winners.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <figure className="mx-auto w-44 sm:w-52 lg:col-span-3 lg:mx-0 lg:w-full">
            <img
              src="/images/matt-portrait.jpg"
              alt="Matt Grabowy, co-founder of The Golf Doctor DC"
              className="w-full rounded-xl object-cover object-top"
            />
            <figcaption className="mt-3 text-sm text-muted">
              Matt Grabowy
              <span className="mt-0.5 block text-xs">
                Co-founder · Golf Digest 100 Best Clubfitter
              </span>
            </figcaption>
          </figure>
          <div className="lg:col-span-9">
            <Eyebrow>The fitter</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Matt Grabowy has been fitting and building clubs for more than 20 years.
            </h2>
            <div className="mt-5 space-y-4 text-muted">
              <p>
                Beginning in 2016, The Golf Doctor-DC, led by co-founder Matt
                Grabowy, brought that work to Washington. Players of every skill
                level come through the studio — first-time golfers and Tour
                winners alike.
              </p>
              <p>
                We maintain the highest professional standards in the industry,
                certified by both the Professional Clubmaker’s Society and the
                Golf Clubmakers Association.
              </p>
            </div>
            <Button asChild className="mt-8">
              <Link to="/book">Book a fitting</Link>
            </Button>
          </div>
        </div>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TIMELINE.map((item) => (
            <li key={item.year} className="border-l-2 border-clay pl-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                {item.year}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <section className="border-y border-border bg-surface">
        <Section>
          <Eyebrow>Credentials</Eyebrow>
          <h2 className="mt-3 font-display text-4xl font-semibold">
            Certified, listed, and still independent.
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {CREDENTIALS.map((c) => (
              <li
                key={c.title}
                className="flex gap-3 rounded-xl border border-border bg-paper p-5"
              >
                <Award className="mt-0.5 size-5 shrink-0 text-clay" />
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="mt-1 text-sm text-muted">{c.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-8">
            <Link to="/partners">See partner certifications</Link>
          </Button>
        </Section>
      </section>
    </main>
  );
}
