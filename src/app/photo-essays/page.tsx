import type { Metadata } from "next";
import Link from "next/link";
import { EssayPhoto } from "@/components/EssayPhoto";
import { PhotoEssaysComingSoon } from "@/components/PhotoEssaysComingSoon";
import { PHOTO_ESSAYS_LIVE } from "@/lib/featureFlags";
import {
  formatEssayDate,
  getPhotoEssays,
  type PhotoEssay,
} from "@/lib/photoEssays";

export const metadata: Metadata = PHOTO_ESSAYS_LIVE
  ? {
      title: "Photo-essays",
      description:
        "Long-form visual stories from the places we film — the frames, faces and footnotes that never make the final cut.",
    }
  : {
      title: "Photo-essays — coming soon",
      description:
        "Long-form visual stories from the places we film. Coming soon.",
      // Nothing to index yet, and no half-built section in search results.
      robots: { index: false, follow: true },
    };

const PAGE_SIZE = 6;

export default async function PhotoEssaysPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  if (!PHOTO_ESSAYS_LIVE) return <PhotoEssaysComingSoon />;

  const [{ page: pageParam }, essays] = await Promise.all([
    searchParams,
    getPhotoEssays(),
  ]);

  const totalPages = Math.max(1, Math.ceil(essays.length / PAGE_SIZE));
  const page = Math.min(
    Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1),
    totalPages,
  );
  const pageEssays = essays.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const latest = essays[0];

  return (
    <>
      {/* Hero */}
      <section>
        <div className="container-page grid items-center gap-12 py-10 md:grid-cols-2 md:py-16">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-saffron">
              Photo-essays
            </p>
            <h1 className="mt-5 font-essay text-5xl font-semibold leading-[1.02] tracking-[-0.01em] text-content text-balance md:text-[64px]">
              Stories that don&rsquo;t fit in a reel.
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-content-soft">
              Long-form visual stories from the places we film — the frames,
              faces and footnotes that never make the final cut.
            </p>
            <div className="mt-8 flex items-center gap-6">
              {latest && (
                <Link
                  href={`/photo-essays/${latest.slug}`}
                  className="rounded-full bg-saffron px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-saffron-dark"
                >
                  Start reading
                </Link>
              )}
              <a
                href="#essays"
                className="text-sm font-semibold text-content underline underline-offset-4 transition-colors hover:text-saffron"
              >
                About this series
              </a>
            </div>
          </div>

          <HeroStack essays={essays.slice(0, 3)} />
        </div>
      </section>

      {/* Latest essays */}
      <section id="essays" className="border-t border-hairline">
        <div className="container-page py-10 md:py-14">
          <div className="flex items-baseline justify-between">
            <h2 className="font-essay text-3xl font-semibold text-content md:text-4xl">
              Latest essays
            </h2>
            <Link
              href="/photo-essays"
              className="text-sm font-semibold text-saffron transition-colors hover:text-saffron-dark"
            >
              View all →
            </Link>
          </div>

          <div className="mt-4">
            {pageEssays.map((essay) => (
              <EssayRow key={essay.slug} essay={essay} />
            ))}
          </div>

          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
        </div>
      </section>
    </>
  );
}

/* Three latest covers as a loose stack of photo cards (hero, right column). */
function HeroStack({ essays }: { essays: PhotoEssay[] }) {
  if (!essays.length) return null;
  const [a, b, c] = essays;
  return (
    <div
      className="relative mx-auto hidden h-[420px] w-full max-w-[560px] md:block"
      aria-hidden
    >
      {b && (
        <div className="absolute left-0 top-[130px] w-[46%] -rotate-6 shadow-lg">
          <EssayPhoto
            image={b.cover}
            sizes="20vw"
            className="aspect-[4/3] rounded-md"
          />
        </div>
      )}
      {a && (
        <div className="absolute right-[6%] top-0 w-[62%] rotate-2 shadow-xl">
          <EssayPhoto
            image={a.cover}
            sizes="30vw"
            className="aspect-[4/3] rounded-md"
          />
        </div>
      )}
      {c && (
        <div className="absolute bottom-0 right-0 w-[52%] rotate-3 shadow-lg">
          <EssayPhoto
            image={c.cover}
            sizes="25vw"
            className="aspect-[4/3] rounded-md"
          />
        </div>
      )}
    </div>
  );
}

/* One Medium-style list row: text left, thumbnail right. */
function EssayRow({ essay }: { essay: PhotoEssay }) {
  return (
    <Link
      href={`/photo-essays/${essay.slug}`}
      className="group grid grid-cols-1 gap-6 border-t border-hairline py-8 first:border-t-0 sm:grid-cols-[1fr_auto] sm:items-center"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-saffron">
          {essay.location}
        </p>
        <h3 className="mt-2 font-essay text-2xl font-semibold leading-snug text-content transition-colors group-hover:text-saffron md:text-[28px]">
          {essay.title}
        </h3>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-content-soft">
          {essay.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-3 text-[13px] text-content-soft/80">
          <span className="font-medium text-content">{essay.author.name}</span>
          <span aria-hidden>·</span>
          <span>{formatEssayDate(essay.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span>{essay.readMinutes} min read</span>
        </div>
      </div>
      <EssayPhoto
        image={essay.cover}
        sizes="(max-width: 640px) 100vw, 220px"
        className="aspect-[16/10] w-full rounded-md sm:w-[220px]"
      />
    </Link>
  );
}

/* Numbered pagination with the design's 1 2 3 … N shape. */
function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const nums: (number | "gap")[] = [];
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) {
      nums.push(n);
    } else if (nums[nums.length - 1] !== "gap") {
      nums.push("gap");
    }
  }

  const pageHref = (n: number) =>
    n === 1 ? "/photo-essays#essays" : `/photo-essays?page=${n}#essays`;

  return (
    <nav
      aria-label="Essay pages"
      className="mt-10 flex items-center justify-center gap-2 border-t border-hairline pt-8 text-sm"
    >
      {page > 1 ? (
        <Link
          href={pageHref(page - 1)}
          className="mr-3 font-medium text-content-soft transition-colors hover:text-saffron"
        >
          ← Previous
        </Link>
      ) : (
        <span className="mr-3 text-content-soft/40">← Previous</span>
      )}

      {nums.map((n, i) =>
        n === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-content-soft/60">
            …
          </span>
        ) : (
          <Link
            key={n}
            href={pageHref(n)}
            aria-current={n === page ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              n === page
                ? "bg-content font-semibold text-canvas"
                : "text-content-soft hover:text-saffron"
            }`}
          >
            {n}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={pageHref(page + 1)}
          className="ml-3 font-semibold text-saffron transition-colors hover:text-saffron-dark"
        >
          Next →
        </Link>
      ) : (
        <span className="ml-3 text-content-soft/40">Next →</span>
      )}
    </nav>
  );
}
