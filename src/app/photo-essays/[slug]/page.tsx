import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { PHOTO_ESSAYS, type EssayBlock } from "@/lib/content";

export function generateStaticParams() {
  return PHOTO_ESSAYS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const essay = PHOTO_ESSAYS.find((e) => e.slug === slug);
  if (!essay) return {};
  return {
    title: essay.title,
    description: essay.logline,
  };
}

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essay = PHOTO_ESSAYS.find((e) => e.slug === slug);
  if (!essay) notFound();

  const formattedDate = new Date(essay.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article>
      {/* Cover */}
      <header className="relative">
        <div className="relative aspect-[16/10] w-full bg-canvas-2 md:aspect-[21/9]">
          <Image
            src={essay.cover}
            alt={essay.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        </div>
        <div className="container-page relative -mt-28 pb-2 md:-mt-40">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-paper/80">
              <span>{essay.location}</span>
              <span aria-hidden>·</span>
              <span>{formattedDate}</span>
              <span aria-hidden>·</span>
              <span>{essay.readMinutes} min read</span>
            </div>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-paper text-balance md:text-6xl">
              {essay.title}
            </h1>
            <p className="mt-4 text-lg text-paper/85">{essay.logline}</p>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container-page py-6 md:py-8">
        <div className="space-y-10">
          {essay.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <div className="mt-16 border-t border-hairline pt-8">
          <Link
            href="/photo-essays"
            className="inline-flex items-center gap-1.5 font-semibold text-saffron transition-colors hover:text-saffron-dark"
          >
            <span aria-hidden>←</span> All photo-essays
          </Link>
        </div>
      </div>
    </article>
  );
}

function Block({ block }: { block: EssayBlock }) {
  if (block.kind === "text") {
    return (
      <div className="mx-auto max-w-2xl">
        <p
          className={
            block.size === "lead"
              ? "font-display text-2xl leading-snug text-content md:text-3xl"
              : "text-lg leading-relaxed text-content-soft"
          }
        >
          {block.content}
        </p>
      </div>
    );
  }

  if (block.kind === "youtube") {
    return (
      <figure className="mx-auto max-w-3xl">
        <YouTubeEmbed youtubeId={block.youtubeId} />
        {block.caption && <Caption>{block.caption}</Caption>}
      </figure>
    );
  }

  // image
  const widthClass =
    block.size === "full"
      ? "max-w-5xl"
      : block.size === "wide"
        ? "max-w-3xl"
        : "max-w-xl";
  const aspect = block.size === "inset" ? "aspect-[4/3]" : "aspect-[16/9]";

  return (
    <figure className={`mx-auto ${widthClass}`}>
      <div className={`relative ${aspect} w-full overflow-hidden rounded-2xl bg-canvas-2`}>
        <Image
          src={block.src}
          alt={block.alt}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover"
        />
      </div>
      {block.caption && <Caption>{block.caption}</Caption>}
    </figure>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="mt-3 text-center text-sm italic text-content-soft/70">
      {children}
    </figcaption>
  );
}
