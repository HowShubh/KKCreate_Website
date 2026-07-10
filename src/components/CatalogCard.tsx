import { CATALOG_CTA, type CatalogItem, type CatalogType } from "@/lib/content";

// Gradient wash per product type — gives each card a distinct, on-brand tint.
const HERO_GRADIENT: Record<CatalogType, string> = {
  Course: "from-indigo-deep via-[#26305c] to-[#3a4a7a]",
  Workshop: "from-[#4a4021] via-[#6b5a24] to-[#a9852b]",
  Ebook: "from-[#2e2a1c] via-[#4a4021] to-[#6b5d1f]",
  Tools: "from-saffron-dark via-[#a9502a] to-clay",
};

// Diagonal hatching drawn over the gradient for a subtle textured backdrop.
const STRIPES: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 13px)",
};

export function CatalogCard({ item }: { item: CatalogItem }) {
  const tagLabel = item.flagship ? "Flagship Course" : item.type;
  const gradient = item.flagship
    ? "from-indigo-deep via-[#232a4d] to-[#2c2540]"
    : HERO_GRADIENT[item.type];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Textured hero — tag, KK mark, play cue, overlaid title + duration */}
      <div
        className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${gradient}`}
      >
        <div className="absolute inset-0" style={STRIPES} aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10"
          aria-hidden
        />

        <span
          className={`absolute left-3 top-3 z-10 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
            item.flagship ? "bg-saffron text-paper" : "bg-ink/80 text-paper"
          }`}
        >
          {tagLabel}
        </span>

        {/* KK badge + play cue, biased to the upper area so it never
            collides with a two-line title on short cards */}
        <div className="absolute inset-x-0 top-0 flex flex-col items-center gap-2.5 pt-[14%] md:gap-3 md:pt-[18%]">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-sm md:h-20 md:w-20">
            <span className="font-display text-xl font-extrabold tracking-tight text-white/45 md:text-2xl">
              KK
            </span>
          </span>
          <PlayIcon />
        </div>

        {/* Title (with faint echo) + duration pill */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 p-4 text-center">
          <span className="relative inline-block">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-2 font-display text-sm font-extrabold uppercase leading-tight tracking-tight text-white/15 md:text-base"
            >
              {item.title}
            </span>
            <h3 className="relative font-display text-sm font-extrabold uppercase leading-tight tracking-tight text-white drop-shadow-sm md:text-base">
              {item.title}
            </h3>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
            <ClockIcon />
            {item.duration}
          </span>
        </div>
      </div>

      {/* Newly-launched ribbon, or the rating + learners band */}
      {item.newlyLaunched ? (
        <div className="flex items-center justify-center gap-1.5 bg-saffron px-4 py-2 text-xs font-bold uppercase tracking-wide text-paper">
          <SparkIcon />
          Newly Launched
        </div>
      ) : (
        <div className="flex items-center justify-center gap-3 bg-indigo-deep px-4 py-2 text-xs font-medium text-paper">
          <span className="inline-flex items-center gap-1.5">
            <StarIcon />
            {item.rating.toFixed(1)} rating
          </span>
          <span className="h-3 w-px bg-paper/30" />
          <span>{item.enrolled} learners</span>
        </div>
      )}

      {/* Price + CTA — stacks on narrow cards so the label stays on one line */}
      <div className="flex flex-col items-stretch gap-2.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <span className="font-display text-lg font-bold text-content">
          {item.price}
        </span>
        <a
          href={item.enrollUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap rounded-full bg-saffron px-4 py-2 text-center text-sm font-semibold text-paper transition-colors hover:bg-saffron-dark"
        >
          {CATALOG_CTA[item.type]}
        </a>
      </div>
    </article>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white/70" aria-hidden>
      <path d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
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

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden>
      <path d="M12 2l1.8 5.9L20 9.7l-5.2 2.1L12 18l-2.8-6.2L4 9.7l6.2-1.8L12 2z" />
    </svg>
  );
}
