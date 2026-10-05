import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  inverse = false,
}: {
  className?: string;
  inverse?: boolean;
}) {
  return (
    <Link
      to="/"
      className={cn(
        "group flex items-center gap-3 no-underline",
        inverse ? "text-forest-fg" : "text-ink",
        className,
      )}
      aria-label="The Golf Doctor DC home"
    >
      <svg
        viewBox="0 0 40 40"
        className="size-10 shrink-0"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="8" fill="currentColor" className={inverse ? "text-forest-fg" : "text-forest"} />
        <path
          fill={inverse ? "#0E1A14" : "#F4F0E6"}
          d="M20 6.2 L31.4 11.2 V21.2 C31.4 28.2 20 34.5 20 34.5 C20 34.5 8.6 28.2 8.6 21.2 V11.2 Z"
        />
        <rect x="18.4" y="13.2" width="3.2" height="14.4" rx="0.7" fill={inverse ? "#F4F0E6" : "#0E1A14"} />
        <path fill="#C45C12" d="M21.6 13.2 L30.4 17.4 L21.6 21.6 Z" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-semibold tracking-tight">
          The Golf Doctor
        </span>
        <span
          className={cn(
            "text-xs font-medium uppercase tracking-widest",
            inverse ? "text-forest-fg/70" : "text-muted",
          )}
        >
          Washington, D.C.
        </span>
      </span>
    </Link>
  );
}
