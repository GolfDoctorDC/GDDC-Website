import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ExternalLink, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow, Section } from "@/components/site/section";
import { InquiryForm } from "@/components/site/inquiry-form";
import { HOURS, SITE } from "@/lib/site";

export const Route = createFileRoute("/location")({
  component: LocationPage,
  head: () => ({
    meta: [{ title: "Location | The Golf Doctor DC" }],
  }),
});

function LocationPage() {
  return (
    <main id="main">
      <PageHero
        image="/images/dc-street.jpg"
        imageClassName="object-[center_42%]"
        alt="Watercolor sketch of The Golf Doctor DC on K Street"
        eyebrow="Location"
        title="1108 K Street NW, third floor."
        subtitle="Between 11th and 12th Streets NW, downtown Washington. Garage and street parking. Elevator to the studio."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Contact us</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              All fittings by appointment only.
            </h2>
            <p className="mt-4 text-muted">
              Walk-ins are strongly encouraged to call or email first. Other
              hours are available at a client’s request.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 text-clay" />
                <span>
                  {SITE.address.name}
                  <br />
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}
                  <br />
                  <span className="text-muted">{SITE.address.cross}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 text-clay" />
                <a href={SITE.phoneHref} className="hover:text-clay">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 text-clay" />
                <a href={SITE.emailHref} className="hover:text-clay">
                  {SITE.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 text-clay" />
                <span>Evening fittings on Tuesday and Thursday</span>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href={SITE.maps} target="_blank" rel="noreferrer">
                  Get directions
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={SITE.booksy} target="_blank" rel="noreferrer">
                  Book Now
                </a>
              </Button>
            </div>
            <div className="mt-10 overflow-hidden rounded-xl border border-border">
              <iframe
                title="Map of The Golf Doctor DC"
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=1108%20K%20St%20NW%20Washington%20DC%2020005&z=16&output=embed"
              />
            </div>
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold">Hours</h3>
            <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface">
              {HOURS.map((row) => (
                <li
                  key={row.day}
                  className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm"
                >
                  <span className="font-medium">{row.day}</span>
                  <span className="text-right text-muted">
                    {row.time}
                    <span className="block text-xs">{row.note}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl border border-border bg-surface p-6">
              <InquiryForm kind="contact" />
            </div>
          </div>
        </div>
      </Section>

      <section className="border-t border-border bg-surface">
        <Section>
          <Eyebrow>Trade in</Eyebrow>
          <h2 className="mt-3 font-display text-4xl font-semibold">
            Trade in and trade up.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Already have clubs but want the latest technology? Look up an
            instant value and apply the credit toward a fitting or new clubs
            here. Trade-in prices meet or exceed typical online offers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/trade-in">Get your trade-in value</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={SITE.tradeIn} target="_blank" rel="noreferrer">
                Open value guide
                <ExternalLink />
              </a>
            </Button>
          </div>
        </Section>
      </section>
    </main>
  );
}
