import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/Section";
import { PHOTO_ESSAYS, IMPACT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Photo-essays",
  description:
    "Long-form visual stories from across India — the realities behind the headlines.",
};

export default function PhotoEssaysPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-hairline">
        <div className="container-page py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-saffron">
            Photo-essays
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-content text-balance md:text-6xl">
            Stories told in pictures and patience
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-content-soft">
            We spend weeks where most spend minutes. These are long-form visual
            stories about the people and places that rarely make the feed.
          </p>
        </div>
      </section>

      {/* Grid */}
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          {PHOTO_ESSAYS.map((essay, i) => (
            <Link
              key={essay.slug}
              href={`/photo-essays/${essay.slug}`}
              className={`group block overflow-hidden rounded-3xl border border-hairline bg-card shadow-sm transition-shadow hover:shadow-md ${
                i === 0 ? "md:col-span-2" : ""
              }`}
            >
              <div
                className={`relative overflow-hidden bg-canvas-2 ${
                  i === 0 ? "aspect-[21/9]" : "aspect-[16/10]"
                }`}
              >
                <Image
                  src={essay.cover}
                  alt={essay.title}
                  fill
                  sizes={i === 0 ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-paper/80">
                    <span>{essay.location}</span>
                    <span aria-hidden>·</span>
                    <span>{essay.readMinutes} min read</span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-paper md:text-3xl">
                    {essay.title}
                  </h2>
                  <p className="mt-1 max-w-xl text-paper/85">{essay.logline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Impact */}
      <section className="bg-indigo-deep py-16 text-paper md:py-24">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-marigold">
              Impact
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-balance md:text-4xl">
              {IMPACT.intro}
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT.stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl font-semibold text-marigold md:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-paper/70">{s.label}</div>
              </div>
            ))}
          </div>

          <ol className="mt-16 space-y-8 border-l border-paper/20 pl-6">
            {IMPACT.timeline.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-saffron ring-4 ring-indigo-deep" />
                <div className="font-display text-sm font-semibold text-marigold">
                  {t.year}
                </div>
                <h3 className="mt-1 font-display text-xl font-semibold text-paper">
                  {t.title}
                </h3>
                <p className="mt-1 max-w-2xl text-paper/75">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
