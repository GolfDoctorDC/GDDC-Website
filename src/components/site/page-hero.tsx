import { cn } from "@/lib/utils";

export function PageHero({
  image,
  imageClassName,
  alt = "",
  eyebrow,
  title,
  subtitle,
  compact = false,
}: {
  image: string;
  imageClassName?: string;
  alt?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative isolate flex items-end overflow-hidden bg-forest",
        compact ? "min-h-[40vh]" : "min-h-[52vh]",
      )}
    >
      <img
        src={image}
        alt={alt}
        className={cn(
          "absolute inset-0 size-full object-cover",
          imageClassName,
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/55 to-forest/20" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-28 sm:px-6 sm:pb-16">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-clay">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold text-forest-fg sm:text-6xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-forest-fg/80 sm:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
