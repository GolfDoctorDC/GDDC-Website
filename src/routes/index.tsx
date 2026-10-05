import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Award,
  Calendar,
  Cpu,
  Mail,
  Recycle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eyebrow, Section } from "@/components/site/section";
import {
  CREDENTIALS,
  FITTINGS,
  GALLERY,
  REVIEWS,
  SITE,
} from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      {
        title: "The Golf Doctor DC | Club Fitting in Washington, D.C.",
      },
    ],
  }),
});

function Home() {
  return (
    <main id="main">
      <section className="relative isolate flex min-h-dvh items-end overflow-hidden bg-forest">
        <img
          src="/images/hero-fairway.jpg"
          alt="Sunlit golf fairway with sand bunkers under a stormy sky"
          className="absolute inset-0 size-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-forest/20" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:px-6 sm:pb-24">
          <p className="reveal text-xs font-semibold uppercase tracking-[0.28em] text-clay">
            Downtown Washington, D.C.
          </p>
          <h1 className="reveal reveal-delay-1 mt-4 max-w-3xl font-display text-5xl font-semibold leading-none text-forest-fg sm:text-7xl">
            The Golf Doctor DC
          </h1>
          <p className="reveal reveal-delay-2 mt-5 max-w-xl text-lg text-forest-fg/85 sm:text-xl">
            {SITE.headline}
          </p>
          <p className="reveal reveal-delay-2 mt-3 font-display text-2xl italic text-forest-fg/80">
            {SITE.tagline}
          </p>
          <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={SITE.booksy} target="_blank" rel="noreferrer">
                Book a Fitting
              </a>
            </Button>
            <Button asChild size="lg" variant="inverse">
              <a href={SITE.phoneHref}>Call {SITE.phone}</a>
            </Button>
            <Button asChild size="lg" variant="inverse">
              <a href={SITE.emailHref}>
                <Mail />
                Matt@Golfdoctordc.com
              </a>
            </Button>
          </div>
        </div>
      </section>

      <div className="border-y border-border bg-forest">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-5 text-forest-fg sm:px-6">
          <p className="flex items-center gap-2 text-sm">
            <Star className="size-4 fill-clay text-clay" />
            5.0 on Booksy · 343 reviews
          </p>
          <p className="text-sm text-forest-fg/70">Golf Digest 100 Best Clubfitter</p>
          <p className="text-sm text-forest-fg/70">
            2018 International Clubmaker of the Year
          </p>
          <p className="text-sm text-forest-fg/70">
            TaylorMade National Fitters Council
          </p>
        </div>
      </div>

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="inline-flex rounded-r-md bg-clay px-4 py-2 text-sm font-semibold text-clay-fg">
              Why we do what we do
            </span>
            <h2 className="mt-6 font-display text-4xl font-semibold sm:text-5xl">
              A swing is as unique as a fingerprint.
            </h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-muted lg:col-span-8">
            <p>
              No matter what anyone else might say, you just cannot get equipment
              that properly fits your swing long distance. Some things can only
              be determined by actually having you hit test clubs.
            </p>
            <p>
              So why would you let someone tell you they can choose the right set
              of clubs when they have never even seen you hit a ball? Come in to
              The Golf Doctor-DC and let us help you the way that you deserve.
            </p>
            <Button asChild variant="outline">
              <Link to="/fitting">
                Explore fittings
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <section className="border-y border-border bg-surface">
        <Section>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>Club Fitting</Eyebrow>
              <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
                Fittings that outperform the clubs you play now.
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/fitting">All fittings</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FITTINGS.map((fit) => (
              <Link
                key={fit.id}
                to="/fitting"
                hash={fit.id}
                className="group rounded-xl border border-border bg-paper p-6 transition-colors duration-200 hover:border-clay/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl font-semibold">
                    {fit.name}
                  </h3>
                  <span className="font-medium tabular-nums text-clay">
                    {fit.price}
                  </span>
                </div>
                {fit.featured ? (
                  <Badge className="mt-2">Best value</Badge>
                ) : null}
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {fit.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink group-hover:text-clay">
                  Details
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </Section>
      </section>

      <section className="bg-forest text-forest-fg">
        <div className="mx-auto grid max-w-6xl gap-0 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
          <div className="min-h-64 overflow-hidden rounded-xl lg:min-h-[22rem]">
            <img
              src="/images/fitting-bay.jpg"
              alt="TaylorMade golf balls on the studio turf with the club wall and TrackMan bay behind"
              className="size-full object-cover object-bay"
            />
          </div>
          <div className="flex flex-col justify-center py-10 lg:px-12">
            <Eyebrow>TrackMan Simulator</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Play and practice downtown.
            </h2>
            <p className="mt-4 text-forest-fg/75">
              Book time to play or practice at The Golf Doctor DC. Use the
              state-of-the-art TrackMan simulator and keep your game sharp in
              the off-season. Real distances. Real play.
            </p>
            <Button asChild className="mt-6 w-fit">
              <a href={SITE.booksy} target="_blank" rel="noreferrer">
                <Calendar />
                Reserve simulator time
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 md:grid-cols-3">
          <Pillar
            icon={<Cpu className="size-5" />}
            title="Technology"
            image="/images/trackman-4.jpg"
          >
            Combining the most advanced technology and a comprehensive inventory
            of club options. Test the latest heads and shafts so we can find the
            optimal golf club for you and your swing.
          </Pillar>
          <Pillar
            icon={<Award className="size-5" />}
            title="Knowledge"
            image="/images/fitting-knowledge.jpg"
            imageAlt="Iron clamped in a loft-and-lie machine with a degree gauge"
            imageClassName="object-knowledge"
            specs={["Loft", "Lie", "Length", "Flex", "Swing wt"]}
          >
            With more than 22 years fitting and building golf clubs, Matt Grabowy
            has been recognized by Golf Digest as a Top 100 Clubfitter since 2011
            and was named 2018 Worldwide Clubmaker of the Year. Clubs are
            customized to the most exacting standards in the industry.
          </Pillar>
          <Pillar
            icon={<Recycle className="size-5" />}
            title="Trade in & trade up"
            image="/images/irons.jpg"
          >
            Already have clubs but want the latest technology? Trade in your
            current set and apply the credit toward new purchases. Trade-in
            prices meet or exceed online prices available elsewhere.
          </Pillar>
        </div>
        <div className="mt-10 flex justify-end">
          <Button asChild variant="outline">
            <Link to="/trade-in">
              Get your trade-in value
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </Section>

      <Section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <Eyebrow>The Studio</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              K Street, third floor.
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/studio">Full gallery</Link>
          </Button>
        </div>
        <div className="-mx-4 mt-8 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0">
          {GALLERY.slice(0, 6).map((shot) => (
            <figure
              key={shot.src}
              className="w-72 shrink-0 snap-start sm:w-80"
            >
              <img
                src={shot.src}
                alt={shot.alt}
                className={`aspect-[3/2] w-full rounded-xl ${
                  shot.src.includes("fitting-lounge")
                    ? "bg-black object-contain"
                    : "object-cover object-center"
                }`}
                loading="lazy"
              />
              <figcaption className="mt-2 px-2 text-center text-sm text-balance text-muted">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <section className="bg-forest text-forest-fg">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <Eyebrow>From the fitting bay</Eyebrow>
          <h2 className="mt-3 font-display text-4xl font-semibold">
            Golfers keep coming back.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {REVIEWS.slice(0, 3).map((review) => (
              <blockquote
                key={review.name}
                className="rounded-xl border border-forest-fg/10 bg-forest-deep/40 p-6"
              >
                <div className="flex gap-0.5 text-clay">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-clay" />
                  ))}
                </div>
                <p className="mt-4 font-display text-xl leading-snug italic">
                  “{review.quote}”
                </p>
                <footer className="mt-4 text-sm text-forest-fg/60">
                  {review.name} · {review.service}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <Section>
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <figure className="mx-auto w-44 sm:w-52 lg:col-span-3 lg:mx-0 lg:w-full">
            <img
              src="/images/matt-portrait.jpg"
              alt="Matt Grabowy, co-founder of The Golf Doctor DC"
              className="w-full rounded-xl object-cover object-top"
              loading="lazy"
            />
            <figcaption className="mt-3 text-sm text-muted">
              Matt Grabowy, co-founder
            </figcaption>
          </figure>
          <div className="lg:col-span-9">
            <Eyebrow>About</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Matt Grabowy, co-founder.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Beginning in 2016, The Golf Doctor-DC brought two decades of
              fitting and building — from beginners to PGA Tour winners — to
              Washington. The original Golf Doctor was founded in 1996 to give
              every golfer a level of service previously reserved for
              professionals.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink">
              {CREDENTIALS.slice(0, 4).map((c) => (
                <li key={c.title} className="flex gap-2">
                  <Award className="mt-0.5 size-4 shrink-0 text-clay" />
                  <span>
                    <strong>{c.title}.</strong> {c.detail}
                  </span>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-8">
              <Link to="/about">
                Read the full story
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-display text-3xl font-semibold">
              Ready to get fitted?
            </h2>
            <p className="mt-2 text-muted">
              All fittings by appointment. The studio is on the third floor at
              1108 K Street NW.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/book">Book Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/gift-cards">Gift cards</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Pillar({
  icon,
  title,
  image,
  imageAlt = "",
  imageClassName,
  specs,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  image: string;
  imageAlt?: string;
  imageClassName?: string;
  specs?: string[];
  children: ReactNode;
}) {
  return (
    <article>
      <figure className="relative overflow-hidden rounded-xl">
        <img
          src={image}
          alt={imageAlt}
          className={`h-52 w-full object-cover ${imageClassName ?? ""}`}
          loading="lazy"
        />
        {specs ? (
          <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap gap-x-3 gap-y-1 bg-gradient-to-t from-forest via-forest/70 to-transparent px-3 pb-2.5 pt-10 text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-fg">
            {specs.map((spec) => (
              <span key={spec}>{spec}</span>
            ))}
          </figcaption>
        ) : null}
      </figure>
      <div className="mt-5 flex items-center gap-2 text-clay">
        {icon}
        <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ink">
          {title}
        </h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{children}</p>
    </article>
  );
}
