import type { Metadata } from "next";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/Section";
import { FlagshipBlock } from "@/components/FlagshipBlock";
import { Catalog } from "@/components/Catalog";
import { FaqAccordion } from "@/components/FaqAccordion";
import { TestimonialsShowcase } from "@/components/TestimonialsShowcase";
import { getCatalogItems } from "@/lib/catalog";

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

const PODCAST_URL = "https://youtube.com/@kk.create";
const REELS_URL = "https://instagram.com/kk.create";

// "However you learn" formats — swap views/titles/thumbnail for real ones.
const LEARN_FORMATS = {
  podcast: {
    kicker: "Got an hour?",
    views: "1.4M views",
    title: "Dhruv Rathee, Part 2",
    thumbnail: "/what-we-do/podcast.jpg",
    heading: "Podcasts with creators",
    description: "conversations that help you learn content and distribution",
    linkLabel: "Podcasts",
    href: PODCAST_URL,
  },
  reels: {
    kicker: "Got 90 seconds?",
    views: "2.1M views",
    title: "The caption formula we use every day",
    heading: "Daily lessons for creators",
    description: "short-form videos that teach content creation and distribution",
    linkLabel: "Reels",
    href: REELS_URL,
  },
};

export default async function LearnPage() {
  const catalogItems = await getCatalogItems();
  return (
    <>
      {/* Hero — centered manifesto copy over a scrolling filmstrip */}
      <section className="relative isolate overflow-hidden border-b border-hairline bg-ink text-paper">
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

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75">
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
              href={PODCAST_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-paper/25 px-7 py-3.5 text-base font-semibold text-paper transition-colors hover:border-paper/50 hover:bg-paper/5"
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
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-ink to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-ink to-transparent md:w-24" />
          {/* Two identical copies so the CSS translateX(-50%) loops seamlessly. */}
          <ul className="marquee-track flex w-max gap-4">
            {[...FILMSTRIP, ...FILMSTRIP].map((label, i) => (
              <li
                key={i}
                aria-hidden={i >= FILMSTRIP.length}
                className="filmstrip-frame flex h-40 w-[260px] shrink-0 items-center justify-center rounded-xl border border-paper/10 md:h-44 md:w-[320px]"
              >
                <span className="font-mono text-xs text-paper/45">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* However you learn — free formats (podcasts + reels) */}
      <section className="border-b border-hairline bg-ink text-paper">
        <div className="container-page py-14 md:py-20">
          <h2 className="max-w-2xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-balance md:text-5xl">
            However you learn,{" "}
            <span className="font-serif font-normal italic text-saffron">
              we&rsquo;re already there
            </span>
          </h2>

          <div className="mt-12 grid gap-16 md:mt-16 md:grid-cols-2 md:gap-x-12 md:gap-y-0">
            {/* Got an hour? — podcast thumbnail */}
            <div className="flex flex-col">
              <p className="font-serif text-xl italic text-saffron md:text-2xl">
                {LEARN_FORMATS.podcast.kicker}
              </p>
              {/* Episode stack — rotated backing cards peek out behind the thumbnail */}
              <div className="relative mt-5 flex-1">
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-2 translate-y-1.5 -rotate-2 rounded-3xl border border-paper/5 bg-ink-soft/60"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 translate-x-2 -translate-y-1 rotate-1 rounded-3xl border border-paper/5 bg-ink-soft/40"
                />
                <a
                  href={LEARN_FORMATS.podcast.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block h-full overflow-hidden rounded-3xl border border-paper/10"
                >
                  <Image
                    src={LEARN_FORMATS.podcast.thumbnail}
                    alt={`Podcast episode: ${LEARN_FORMATS.podcast.title}`}
                    width={1280}
                    height={720}
                    className="aspect-video h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/55 to-transparent p-5 pt-20">
                    <p className="font-mono text-xs font-semibold uppercase tracking-widest text-marigold">
                      {LEARN_FORMATS.podcast.views}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-paper">
                      {LEARN_FORMATS.podcast.title}
                    </p>
                  </div>
                </a>
              </div>
              <FormatFooter {...LEARN_FORMATS.podcast} />
            </div>

            {/* Got 90 seconds? — fanned reel deck */}
            <div className="flex flex-col">
              <p className="text-right font-serif text-xl italic text-saffron md:text-2xl">
                {LEARN_FORMATS.reels.kicker}
              </p>
              <a
                href={LEARN_FORMATS.reels.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${LEARN_FORMATS.reels.heading} — ${LEARN_FORMATS.reels.linkLabel}`}
                className="group mt-5 flex flex-1 items-center justify-center py-4"
              >
                {/* Side frames fan out from the bottom; center frame carries the reel */}
                <span className="relative block h-72 w-full md:h-[23rem]">
                  <span className="absolute left-1/2 top-1/2 aspect-[9/16] w-24 -translate-y-1/2 translate-x-[calc(-50%-5.75rem)] -rotate-12 rounded-2xl border border-paper/10 bg-ink-soft/60 md:w-32 md:translate-x-[calc(-50%-8rem)]" />
                  <span className="absolute left-1/2 top-1/2 aspect-[9/16] w-24 -translate-y-1/2 translate-x-[calc(-50%+5.75rem)] rotate-12 rounded-2xl border border-paper/10 bg-ink-soft/60 md:w-32 md:translate-x-[calc(-50%+8rem)]" />
                  <span className="absolute left-1/2 top-1/2 z-10 aspect-[9/16] w-28 -translate-y-1/2 translate-x-[calc(-50%-3.25rem)] -rotate-6 rounded-2xl border border-paper/10 bg-ink-soft shadow-xl shadow-ink/60 md:w-40 md:translate-x-[calc(-50%-4.5rem)]" />
                  <span className="absolute left-1/2 top-1/2 z-10 aspect-[9/16] w-28 -translate-y-1/2 translate-x-[calc(-50%+3.25rem)] rotate-6 rounded-2xl border border-paper/10 bg-ink-soft shadow-xl shadow-ink/60 md:w-40 md:translate-x-[calc(-50%+4.5rem)]" />
                  <span className="filmstrip-frame absolute left-1/2 top-1/2 z-20 aspect-[9/16] w-36 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-paper/15 shadow-2xl shadow-ink transition-transform duration-500 group-hover:-translate-y-[calc(50%+0.375rem)] md:w-48">
                    <span className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-4 pt-10">
                      <span className="block font-mono text-[11px] font-semibold uppercase tracking-widest text-marigold">
                        {LEARN_FORMATS.reels.views}
                      </span>
                      <span className="mt-1 block text-sm font-semibold leading-snug text-paper">
                        {LEARN_FORMATS.reels.title}
                      </span>
                    </span>
                  </span>
                </span>
              </a>
              <FormatFooter {...LEARN_FORMATS.reels} />
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

function FormatFooter({
  heading,
  description,
  linkLabel,
  href,
}: {
  heading: string;
  description: string;
  linkLabel: string;
  href: string;
}) {
  return (
    <div className="mt-6 flex items-end justify-between gap-6">
      <div>
        <h3 className="font-display text-xl font-semibold text-paper">
          {heading}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-paper/60">
          {description}
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 whitespace-nowrap text-sm font-semibold text-saffron transition-colors hover:text-saffron-dark"
      >
        {linkLabel} <span aria-hidden>→</span>
      </a>
    </div>
  );
}

