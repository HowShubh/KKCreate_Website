import type { Metadata } from "next";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/Section";
import { FlagshipBlock } from "@/components/FlagshipBlock";
import { Catalog } from "@/components/Catalog";
import { FaqAccordion } from "@/components/FaqAccordion";
import { TestimonialsShowcase } from "@/components/TestimonialsShowcase";
import { SOCIAL_PROOF } from "@/lib/content";
import { getCatalogItems } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Workshops, courses, ebooks and tools to grow as a creator — from the KK Create team.",
};

// Learn-hero presentation data (placeholder imagery — swap for owned assets).
const LEARN_HERO = {
  image:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80",
  avatars: [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&q=80",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&q=80",
  ],
  nuggets: [
    { icon: "gem" as const, label: "High-quality courses" },
    { icon: "users" as const, label: "Community access" },
    { icon: "target" as const, label: "Personalised learning paths" },
  ],
};

export default async function LearnPage() {
  const catalogItems = await getCatalogItems();
  return (
    <>
      {/* Hero — full-bleed image, copy anchored left */}
      <section className="relative isolate overflow-hidden border-b border-hairline bg-ink">
        <Image
          src={LEARN_HERO.image}
          alt="Creators learning with KK Create"
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: "75% 30%" }}
          className="object-cover"
        />
        {/* Light wash + left-anchored fade + edge feather */}
        <div className="pointer-events-none absolute inset-0 bg-ink/20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink from-5% via-ink/80 via-40% to-transparent to-85%" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />

        <div className="container-page relative flex min-h-[68vh] flex-col justify-center py-10 md:py-14">
          <div className="max-w-xl">
            {/* Social proof — avatars + member count */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {LEARN_HERO.avatars.map((src, i) => (
                  <span
                    key={i}
                    className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-ink"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>
              <span className="h-5 w-px bg-paper/25" />
              <p className="text-sm font-medium text-paper/90">
                <span className="font-semibold text-paper">
                  {SOCIAL_PROOF.students.value}
                </span>{" "}
                creators already learning with us
              </p>
            </div>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-paper text-balance md:text-6xl">
              Making Creators in{" "}
              <span className="font-serif font-normal italic">Every District</span>{" "}
              of India
            </h1>

            <p className="mt-5 max-w-md text-lg leading-relaxed text-paper/85">
              Workshops, courses, ebooks and tools — built from years of
              shooting, scripting and scaling content across India.
            </p>

            <a
              href="/catalog"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-3 text-base font-semibold text-paper transition-colors hover:bg-saffron-dark"
            >
              Explore courses <span aria-hidden>→</span>
            </a>

            {/* Feature nuggets */}
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-medium text-paper/85">
              {LEARN_HERO.nuggets.map((n) => (
                <span key={n.label} className="inline-flex items-center gap-2">
                  <NuggetIcon name={n.icon} />
                  {n.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <Section>
        <SectionHeading
          kicker="Why creators trust us"
          title="Proof, not promises"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ProofStat {...SOCIAL_PROOF.students} />
          <ProofStat {...SOCIAL_PROOF.performance} />
        </div>

        <div className="mt-12">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-content-soft/60">
            Featured in
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {SOCIAL_PROOF.featuredIn.map((name) => (
              <span
                key={name}
                className="font-display text-xl font-semibold text-content/40"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Section>

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

function NuggetIcon({ name }: { name: "gem" | "users" | "target" }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-4 w-4 text-marigold",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "gem") {
    return (
      <svg {...common}>
        <path d="M6 3h12l3 6-9 12L3 9l3-6z" />
        <path d="M3 9h18M9 3l3 6 3-6M12 21l-3-12M12 21l3-12" />
      </svg>
    );
  }
  if (name === "users") {
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19a5.5 5.5 0 0111 0M16 5.5a3 3 0 010 5.8M20.5 19a5.5 5.5 0 00-4-5.3" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ProofStat({
  label,
  value,
  sub,
  image,
}: {
  label: string;
  value: string;
  sub: string;
  image: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-hairline bg-feature text-paper">
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover opacity-30"
      />
      <div className="relative p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-marigold">
          {label}
        </p>
        <div className="mt-3 font-display text-5xl font-semibold">{value}</div>
        <p className="mt-1 text-paper/80">{sub}</p>
      </div>
    </div>
  );
}
