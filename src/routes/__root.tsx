import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import appCss from "../styles.css?url";

const APP_NAME = "The Golf Doctor DC";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Washington, D.C.'s most advanced golf fitting center. TrackMan 4 club fitting and on-site club making with Matt Grabowy — Golf Digest 100 Best Clubfitter.",
      },
      { name: "theme-color", content: "#163028" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Outfit:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-paper font-sans text-ink">
        <PreviewHostBridge />
        <AuthProvider>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <Outlet />
            <SiteFooter />
          </div>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <main id="main" className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-clay">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl">Page not on the card</h1>
      <p className="mt-3 max-w-md text-muted">
        That page doesn’t exist. Head back to the studio or book a fitting.
      </p>
      <a
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-md bg-clay px-5 text-sm font-medium text-clay-fg"
      >
        Return home
      </a>
    </main>
  );
}
