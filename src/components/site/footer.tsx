import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { Logo } from "@/components/site/logo";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-forest text-forest-fg">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo inverse />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-forest-fg/70">
            Custom club fitting and on-site club making in downtown Washington,
            D.C. TrackMan 4. Thousands of test combinations. Built here, not
            shipped to a factory floor.
          </p>
          <p className="mt-4 font-display text-xl italic text-forest-fg/80">
            {SITE.tagline}
          </p>
        </div>
        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-forest-fg/50">
            Visit
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-forest-fg/80">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <a
                href={SITE.maps}
                target="_blank"
                rel="noreferrer"
                className="hover:text-forest-fg"
              >
                {SITE.address.line1}
                <br />
                {SITE.address.line2}
              </a>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <a href={SITE.phoneHref} className="hover:text-forest-fg">
                {SITE.phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" />
              <a href={SITE.emailHref} className="hover:text-forest-fg">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-forest-fg/50">
            Explore
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-forest-fg/80 hover:text-forest-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/book" className="text-forest-fg/80 hover:text-forest-fg">
                Book a Fitting
              </Link>
            </li>
            <li>
              <a
                href={SITE.yelp}
                target="_blank"
                rel="noreferrer"
                className="text-forest-fg/80 hover:text-forest-fg"
              >
                Reviews on Yelp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <Separator className="bg-forest-fg/10" />
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-forest-fg/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} The Golf Doctor-DC, LLC</p>
        <p>All fittings by appointment. Walk-ins, please call first.</p>
      </div>
    </footer>
  );
}
