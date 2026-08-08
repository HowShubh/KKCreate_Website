import Link from "next/link";

// Placeholder for /photo-essays while the section is behind PHOTO_ESSAYS_LIVE.
// Deliberately borrows the section's own kicker + editorial type so it reads as
// a chapter that hasn't opened yet rather than a broken page.
export function PhotoEssaysComingSoon() {
  return (
    <section>
      <div className="container-page flex flex-col items-center py-24 text-center md:py-36">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-saffron">
          Photo-essays
        </p>

        <h1 className="mt-5 max-w-2xl font-essay text-5xl font-semibold leading-[1.02] tracking-[-0.01em] text-content text-balance md:text-[64px]">
          Coming soon.
        </h1>

        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-content-soft">
          Long-form visual stories from the places we film — the frames, faces
          and footnotes that never make the final cut. We&rsquo;re putting the
          first ones together now.
        </p>

        <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
          <Link
            href="/learn"
            className="rounded-full bg-saffron px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-saffron-dark"
          >
            Explore courses
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-content underline underline-offset-4 transition-colors hover:text-saffron"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
