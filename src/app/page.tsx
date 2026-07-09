import { Section, SectionHeading } from "@/components/Section";
import { VibeGrid } from "@/components/VibeGrid";
import { FlagshipBlock } from "@/components/FlagshipBlock";
import { Catalog } from "@/components/Catalog";
import { WhatWeDo } from "@/components/WhatWeDo";
import { HeroVideo } from "@/components/HeroVideo";
import { BrandMarquee } from "@/components/BrandMarquee";
import { SocialIcon } from "@/components/SocialIcon";
import {
  SITE,
  GROWTH,
  VIBE,
  CATALOG,
} from "@/lib/content";

export default function HomePage() {
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
        <div className="container-page flex min-h-[86vh] flex-col justify-end pb-16 pt-8 md:justify-center md:py-28">
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
              We are a video-first studio documenting the people, places and
              tensions that shape modern India — and teaching creators to do
              the same.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {SITE.platforms.map((p) => (
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
        <div className="mt-10">
          <WhatWeDo />
        </div>
      </Section>

      {/* Growth band — featured stat + list */}
      <section className="bg-ink py-20 text-paper md:py-28">
        <div className="container-page grid gap-14 md:grid-cols-2 md:items-center md:gap-20">
          {/* Featured stat */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-saffron">
              {GROWTH.kicker}
            </p>
            <div className="mt-4 font-display text-7xl font-extrabold leading-[0.9] tracking-tight text-paper md:text-[8.5rem]">
              {GROWTH.feature.value}
              <span className="text-saffron">{GROWTH.feature.plus}</span>
            </div>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/55">
              {GROWTH.feature.caption.prefix}
              <span className="font-serif italic text-paper/75">
                {GROWTH.feature.caption.emphasis}
              </span>
              {GROWTH.feature.caption.suffix}
            </p>
          </div>

          {/* Stat list */}
          <div className="md:pl-6">
            {GROWTH.stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-baseline justify-between gap-6 py-6 ${
                  i > 0 ? "border-t border-paper/10" : ""
                }`}
              >
                <span className="text-sm font-medium uppercase tracking-wide text-paper/45">
                  {s.label}
                </span>
                <span className="font-display text-3xl font-bold text-paper md:text-4xl">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands we've worked with */}
      <section className="py-16 md:py-24">
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
          <Catalog items={CATALOG} limit={4} columns={4} viewAllHref="/catalog" />
        </div>
      </Section>

      {/* Vibe */}
      <Section>
        <SectionHeading
          kicker="Vibe at KK Create"
          title="The people behind the camera"
          intro="Founders, editors, researchers and a lot of chai. This is what a week with us looks like."
        />
        <div className="mt-10">
          <VibeGrid photos={VIBE} />
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact">
        <SectionHeading
          kicker="Contact Us"
          title="Let's make something"
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <ContactCard
            title="For Brands"
            text="Sponsorships, branded films and integrated campaigns."
            cta="Pitch a collaboration"
            email={SITE.contacts.brands}
          />
          <ContactCard
            title="For Creators"
            text="Want to collaborate, guest on the podcast or join a shoot?"
            cta="Reach the team"
            email={SITE.contacts.creators}
          />
          <ContactCard
            title="Careers"
            text="Editors, researchers, producers — we're always hiring curious people."
            cta="See how to apply"
            email={SITE.contacts.careers}
          />
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
    </div>
  );
}
