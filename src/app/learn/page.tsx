import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { FlagshipBlock } from "@/components/FlagshipBlock";
import { Catalog } from "@/components/Catalog";
import { FaqAccordion } from "@/components/FaqAccordion";
import { TestimonialsShowcase } from "@/components/TestimonialsShowcase";
import { getCatalogItems } from "@/lib/catalog";
import { getLearnFormats, type LearnFormat } from "@/lib/learnFormats";
import { StackCarousel } from "@/components/StackCarousel";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Workshops, courses, ebooks and tools to grow as a creator — from the KK Create team.",
};

// Filmstrip placeholders — swap each label for a real photo when assets land.
const FILMSTRIP = [
  "[ shoot: Varanasi ]",
  "[ workshop: Mumbai ]",
  "[ edit desk ]",
  "[ shoot: Jaipur ]",
  "[ podcast studio ]",
  "[ workshop: Delhi ]",
];

export default async function LearnPage() {
  const [catalogItems, formats] = await Promise.all([
    getCatalogItems(),
    getLearnFormats(),
  ]);
  return (
    <>
      {/* Hero — centered manifesto copy over a scrolling filmstrip */}
      <section className="relative isolate overflow-hidden border-b border-hairline bg-canvas text-content">
        <div className="container-page flex flex-col items-center pt-14 pb-10 text-center md:pt-24 md:pb-16">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.35em] text-saffron md:text-xs">
            Create · Learn · Scale · Repeat
          </p>

          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.04] tracking-tight text-balance md:text-7xl">
            The classroom{" "}
            <span className="font-serif font-normal italic text-saffron">
              for Creators.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-content/70">
            Podcasts, videos, workshops, courses, ebooks and tools — built from
            years of experience in scaling multiple channels.
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-saffron px-7 py-3.5 text-base font-semibold text-paper transition-colors hover:bg-saffron-dark"
            >
              Explore courses <span aria-hidden>→</span>
            </a>
            <a
              href={formats.podcast.linkUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-content/25 px-7 py-3.5 text-base font-semibold text-content transition-colors hover:border-content/50 hover:bg-content/5"
            >
              Creators Podcast
            </a>
          </div>
        </div>

        {/* Filmstrip — slow marquee of placeholder frames */}
        <div
          className="marquee-root relative overflow-hidden pb-10 md:pb-14"
          style={{ "--marquee-duration": "80s" } as React.CSSProperties}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-canvas to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-canvas to-transparent md:w-24" />
          {/* Two identical copies so the CSS translateX(-50%) loops seamlessly. */}
          <ul className="marquee-track flex w-max gap-4">
            {[...FILMSTRIP, ...FILMSTRIP].map((label, i) => (
              <li
                key={i}
                aria-hidden={i >= FILMSTRIP.length}
                className="filmstrip-frame flex h-40 w-[260px] shrink-0 items-center justify-center rounded-xl border border-content/10 md:h-44 md:w-[320px]"
              >
                <span className="font-mono text-xs text-content/45">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* However you learn — free formats (podcasts + reels) */}
      <section className="border-b border-hairline bg-canvas text-content">
        <div className="container-page py-14 md:py-20">
          <h2 className="max-w-2xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-balance md:text-5xl">
            {formats.sectionHeading}{" "}
            <span className="font-serif font-normal italic text-saffron">
              {formats.sectionHeadingAccent}
            </span>
          </h2>

          <div className="mt-12 grid gap-16 md:mt-16 md:grid-cols-2 md:gap-x-12 md:gap-y-0">
            {/* Got an hour? — podcast episode stack */}
            <div className="flex flex-col">
              <p className="font-serif text-xl italic text-saffron md:text-2xl">
                {formats.podcast.kicker}
              </p>
              <StackCarousel videos={formats.podcast.videos} variant="landscape" />
              <FormatFooter format={formats.podcast} />
            </div>

            {/* Got 90 seconds? — fanned reel deck */}
            <div className="flex flex-col">
              <p className="text-right font-serif text-xl italic text-saffron md:text-2xl">
                {formats.reels.kicker}
              </p>
              <StackCarousel videos={formats.reels.videos} variant="portrait" />
              <FormatFooter format={formats.reels} />
            </div>
          </div>
        </div>
      </section>

      {/* Flagship */}
      <Section className="bg-canvas-2/50">
        <FlagshipBlock />
      </Section>

      {/* Catalog preview */}
      <Section id="catalog">
        <SectionHeading
          kicker="The full catalog"
          title="Everything we offer"
          intro="A taste of what we teach. Browse the full catalog to filter by topic and type."
        />
        <div className="mt-8">
          <Catalog items={catalogItems} limit={4} columns={4} viewAllHref="/catalog" />
        </div>
      </Section>

      {/* Testimonials — videos + text + featured highlight */}
      <Section className="bg-canvas-2/50">
        <TestimonialsShowcase />
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeading
          kicker="FAQ"
          title="Questions, answered"
          align="center"
        />
        <div className="mt-10">
          <FaqAccordion />
        </div>
      </Section>
    </>
  );
}

function FormatFooter({ format }: { format: LearnFormat }) {
  return (
    <div className="mt-6 flex items-end justify-between gap-6">
      <div>
        <h3 className="font-display text-xl font-semibold text-content">
          {format.heading}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-content/60">
          {format.description}
        </p>
      </div>
      <a
        href={format.linkUrl}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 whitespace-nowrap text-sm font-semibold text-saffron transition-colors hover:text-saffron-dark"
      >
        {format.linkLabel} <span aria-hidden>→</span>
      </a>
    </div>
  );
}

