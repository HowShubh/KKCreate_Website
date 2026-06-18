import type { CatalogItem } from "@/lib/content";

export function CatalogCard({ item }: { item: CatalogItem }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Solid-colour hero — overlaid title + duration pill */}
      <div className="relative aspect-square overflow-hidden bg-ink-soft">
        {item.badge && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-saffron px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-paper shadow-sm">
            <SparkIcon />
            {item.badge}
          </span>
        )}

        {/* Title + duration, centred in the solid block */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
          <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-paper">
            {item.title}
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-3 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur">
            <ClockIcon />
            {item.duration}
          </span>
        </div>
      </div>

      {/* Stats band — rating + enrolled */}
      <div className="flex items-center justify-center gap-3 bg-indigo-deep px-4 py-2 text-xs font-medium text-paper">
        <span className="inline-flex items-center gap-1.5">
          <StarIcon />
          {item.rating.toFixed(1)} rating
        </span>
        <span className="h-3 w-px bg-paper/30" />
        <span className="inline-flex items-center gap-1.5">
          <UsersIcon />
          {item.enrolled} enrolled
        </span>
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="font-display text-lg font-bold text-content">
          {item.price}
        </span>
        <a
          href={item.enrollUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-saffron px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-saffron-dark"
        >
          Enroll Now
        </a>
      </div>
    </article>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-marigold" aria-hidden>
      <path d="M12 2.5l2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.9l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.5z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3.5 19a5.5 5.5 0 0111 0M16 5.5a3 3 0 010 5.8M20.5 19a5.5 5.5 0 00-4-5.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden>
      <path d="M12 2l1.8 5.9L20 9.7l-5.2 2.1L12 18l-2.8-6.2L4 9.7l6.2-1.8L12 2z" />
    </svg>
  );
}
