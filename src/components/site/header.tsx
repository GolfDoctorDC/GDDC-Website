import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { SITE, NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Logo } from "@/components/site/logo";

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-forest-fg/10 bg-forest text-forest-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-clay focus:px-3 focus:py-2 focus:text-clay-fg"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-18 sm:px-6">
        <Logo inverse />
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          {NAV.filter((item) => item.to !== "/").map((item) => {
            const active =
              pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-150 xl:px-3",
                  active
                    ? "text-clay"
                    : "text-forest-fg/80 hover:text-forest-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={SITE.phoneHref}
            className="hidden items-center gap-2 text-sm text-forest-fg/80 transition-colors hover:text-forest-fg xl:inline-flex"
          >
            <Phone className="size-4" />
            {SITE.phone}
          </a>
          <Button asChild size="sm">
            <a href={SITE.booksy} target="_blank" rel="noreferrer">
              Book Now
            </a>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="inverse"
                size="icon"
                className="xl:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="left-auto right-0 top-0 flex h-dvh w-80 max-w-none translate-x-0 translate-y-0 flex-col rounded-none border-y-0 border-r-0 bg-forest p-0 text-forest-fg data-[state=open]:slide-in-from-right [&>button.absolute]:hidden">
              <div className="flex items-center justify-between border-b border-forest-fg/10 px-5 py-4">
                <DialogTitle className="font-display text-lg text-forest-fg">
                  Menu
                </DialogTitle>
                <DialogClose asChild>
                  <Button variant="inverse" size="icon" aria-label="Close menu">
                    <X className="size-5" />
                  </Button>
                </DialogClose>
              </div>
              <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
                {NAV.map((item) => (
                  <DialogClose asChild key={item.to}>
                    <Link
                      to={item.to}
                      className="rounded-md px-3 py-3 text-base font-medium text-forest-fg/90 hover:bg-forest-fg/10"
                    >
                      {item.label}
                    </Link>
                  </DialogClose>
                ))}
                <DialogClose asChild>
                  <Link
                    to="/book"
                    className="rounded-md px-3 py-3 text-base font-medium text-forest-fg/90 hover:bg-forest-fg/10"
                  >
                    Book a Fitting
                  </Link>
                </DialogClose>
              </nav>
              <div className="mt-auto space-y-3 border-t border-forest-fg/10 p-5">
                <Button asChild className="w-full">
                  <a href={SITE.booksy} target="_blank" rel="noreferrer">
                    Book Now
                  </a>
                </Button>
                <a
                  href={SITE.phoneHref}
                  className="flex items-center justify-center gap-2 text-sm text-forest-fg/80"
                >
                  <Phone className="size-4" />
                  {SITE.phone}
                </a>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
