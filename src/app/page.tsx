import { Section, SectionHeading } from "@/components/Section";
import { VibeGrid } from "@/components/VibeGrid";
import { FlagshipBlock } from "@/components/FlagshipBlock";
import { Catalog } from "@/components/Catalog";
import { WhatWeDo } from "@/components/WhatWeDo";
import { HeroVideo } from "@/components/HeroVideo";
import { BrandMarquee } from "@/components/BrandMarquee";
import { SocialIcon } from "@/components/SocialIcon";
import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";
import { CopyEmail } from "@/components/CopyEmail";
import { GROWTH, VIBE } from "@/lib/content";
import { IndiaMap } from "@/components/IndiaMap";
import { getCatalogItems } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/settings";
import { getFilmedPlaces } from "@/lib/filmedPlaces";

export default async function HomePage() {
  const catalogItems = await getCatalogItems();
  const settings = await getSiteSettings();
  const filmedPlaces = await getFilmedPlaces();
  return (
    <>
      {/* Hero — video anchored to the right, solid panel on the left */}
      <section className="relative isolate overflow-hidden border-b border-hairline bg-ink">
        <HeroVideo
          poster="/hero-poster.jpg"
          srcMp4="/hero.mp4"
          alt="On location with the KK Create team"
          grayscale
          objectPosition="center 22%"
          /* Mobile: pinned to the top ~52%. Desktop: confined to the right ~60%, full height. */
          className="absolute left-0 right-0 top-0 -z-10 h-[52%] md:bottom-0 md:left-auto md:h-auto md:w-[60%]"
          overlays={
            <>
              {/* Light wash so the footage never blows out */}
              <div className="pointer-events-none absolute inset-0 bg-ink/20" />
              {/* Desktop: feather the video's left edge into the solid panel */}
              <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-ink from-0% via-ink/55 via-30% to-transparent to-65% md:block" />
              {/* Mobile: blend the video's bottom edge into the dark panel the text sits on */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent md:hidden" />
              {/* Desktop: gentle floor + ceiling fade to seat the section edges */}
              <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-ink/60 via-transparent to-ink/25 md:block" />
            </>
          }
        />
        <div className="container-page flex min-h-[86vh] flex-col justify-end pb-8 pt-8 md:justify-center md:py-14">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl font-bold leading-[1.03] tracking-tight text-paper md:text-7xl">
              Making a video
              <br />
              on{" "}
              <span className="font-serif font-normal italic">
                every district
              </span>
              <br />
              of India
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/85">
              Capturing the beauty, the breakdowns, and the unfiltered
              reality of modern India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {settings.platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.name}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 text-paper/90 backdrop-blur-sm transition-colors hover:border-saffron hover:text-saffron"
                >
                  <SocialIcon name={p.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <Section>
        <SectionHeading
          kicker="What We Do"
          title="How we tell India's stories"
        />
        <Reveal className="mt-10">
          <WhatWeDo />
        </Reveal>
      </Section>

      {/* Growth band — featured stat + list */}
      <section className="bg-canvas-2 py-10 text-content md:py-14">
        <div className="container-page grid gap-14 md:grid-cols-2 md:items-center md:gap-20">
          {/* Featured stat */}
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-saffron">
              {GROWTH.kicker}
            </p>
            <div className="mt-4 font-display text-7xl font-extrabold leading-[0.9] tracking-tight text-content md:text-[8.5rem]">
              <CountUp value={GROWTH.feature.value} />
              <span className="text-saffron">{GROWTH.feature.plus}</span>
            </div>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-content/60">
              {GROWTH.feature.caption.prefix}
              <span className="font-serif italic text-content/75">
                {GROWTH.feature.caption.emphasis}
              </span>
              {GROWTH.feature.caption.suffix}
            </p>
          </Reveal>

          {/* Stat list */}
          <div className="md:pl-6">
            {GROWTH.stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 110}
                className={`flex items-baseline justify-between gap-6 py-6 ${
                  i > 0 ? "border-t border-content/10" : ""
                }`}
              >
                <span className="text-sm font-medium uppercase tracking-wide text-content/55">
                  {s.label}
                </span>
                <span className="font-display text-3xl font-bold text-content md:text-4xl">
                  <CountUp value={s.value} />
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Where we've filmed — dotted India map with video pins */}
      <Section>
        <SectionHeading
          kicker="Where we've filmed"
          title={
            <>
              One country.{" "}
              <span className="font-serif font-normal italic">
                Thousands of stories.
              </span>
            </>
          }
          intro="Tap a dot to see what we shot there."
        />
        {/* Desktop: pull the map up beside the left-aligned heading and park
            it in the empty right half. Mobile keeps the stacked layout. */}
        <Reveal className="mt-10 lg:-mt-40 lg:ml-auto lg:w-full lg:max-w-xl lg:pr-4">
          <IndiaMap places={filmedPlaces} />
        </Reveal>
      </Section>

      {/* Brands we've worked with */}
      <section className="py-8 md:py-12">
        <div className="container-page">
          <SectionHeading
            kicker="Trusted by"
            title="Brands we've worked with"
          />
        </div>
        <div className="mt-10">
          <BrandMarquee />
        </div>
      </section>

      {/* Flagship */}
      <Section>
        <FlagshipBlock />
      </Section>

      {/* Catalog preview */}
      <Section className="bg-canvas-2/50">
        <SectionHeading
          kicker="Learn with us"
          title="Courses, workshops & tools"
          intro="A preview of what we teach. See the full catalog to filter by topic and type."
        />
        <div className="mt-8">
          <Catalog items={catalogItems} limit={4} columns={4} viewAllHref="/catalog" />
        </div>
      </Section>

      {/* Vibe */}
      <Section>
        <SectionHeading
          kicker="Vibe at KK Create"
          title="The people behind the camera"
          intro="Founders, editors, researchers and a lot of chai. This is what a week with us looks like."
        />
        <Reveal className="mt-10">
          <VibeGrid photos={VIBE} />
        </Reveal>
      </Section>

      {/* Contact */}
      <Section id="contact">
        <SectionHeading
          kicker="Contact Us"
          title="Let's make something"
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Reveal delay={0}>
            <ContactCard
              title="For Brands"
              text="Sponsorships, branded films and integrated campaigns."
              cta="Pitch a collaboration"
              email={settings.contacts.brands}
            />
          </Reveal>
          <Reveal delay={90}>
            <ContactCard
              title="For Creators"
              text="Want to collaborate, guest on the podcast or join a shoot?"
              cta="Reach the team"
              email={settings.contacts.creators}
            />
          </Reveal>
          <Reveal delay={180}>
            <ContactCard
              title="Careers"
              text="Editors, researchers, producers — we're always hiring curious people."
              cta="See how to apply"
              email={settings.contacts.careers}
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}

function ContactCard({
  title,
  text,
  cta,
  email,
}: {
  title: string;
  text: string;
  cta: string;
  email: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-hairline bg-card p-7 shadow-sm">
      <h3 className="font-display text-xl font-semibold text-content">{title}</h3>
      <p className="mt-2 flex-1 text-content-soft">{text}</p>
      <a
        href={`mailto:${email}`}
        className="mt-5 inline-flex items-center gap-1.5 font-semibold text-saffron transition-colors hover:text-saffron-dark"
      >
        {cta} <span aria-hidden>→</span>
      </a>
      <div className="mt-3">
        <CopyEmail email={email} tone="onLight" compact />
      </div>
    </div>
  );
}
