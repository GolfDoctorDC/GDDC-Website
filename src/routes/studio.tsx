import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow, Section } from "@/components/site/section";
import { GALLERY } from "@/lib/site";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
  head: () => ({
    meta: [{ title: "Studio Images | The Golf Doctor DC" }],
  }),
});

function StudioPage() {
  return (
    <main id="main">
      <section className="bg-forest text-forest-fg">
        <img
          src="/images/fitting-bay.jpg"
          alt="The hitting bay at The Golf Doctor DC — turf, TrackMan, and a wall of test clubs"
          className="h-[58vh] w-full object-cover object-bay sm:h-[70vh]"
        />
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-clay">
            Studio Images
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold sm:text-6xl">
            The fitting bay, the putting green, the build shop.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-forest-fg/80 sm:text-lg">
            A 1,600-square-foot studio on the third floor of 1108 K Street NW.
            The elevator opens into the room.
          </p>
        </div>
      </section>
      <Section>
        <Eyebrow>Gallery</Eyebrow>
        <h2 className="mt-3 font-display text-4xl font-semibold">
          Inside The Golf Doctor DC
        </h2>
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {GALLERY.slice(1).map((shot) => (
            <figure key={shot.src} className="mb-4 break-inside-avoid">
              <img
                src={shot.src}
                alt={shot.alt}
                className="w-full rounded-xl object-cover"
                loading="lazy"
              />
              <figcaption className="mt-2 px-2 text-center text-sm text-balance text-muted">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </main>
  );
}
