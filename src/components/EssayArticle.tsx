import Image from "next/image";
import Link from "next/link";
import { EssayActions } from "@/components/EssayActions";
import { EssayPhoto } from "@/components/EssayPhoto";
import { SocialEmbed } from "@/components/SocialEmbed";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { ESSAY_STYLES } from "@/lib/essayStyles";
import {
  formatEssayDate,
  type EssayAuthor,
  type EssayBodyBlock,
  type EssayImage,
  type EssaySpan,
  type PhotoEssay,
} from "@/lib/photoEssays";

// The essay article, extracted from the /photo-essays/[slug] page so the
// shareable draft preview renders through the exact same pipeline.
export function EssayArticle({
  essay,
  readNext = [],
}: {
  essay: PhotoEssay;
  readNext?: PhotoEssay[];
}) {
  return (
    <article className="pb-4 md:pb-8">
      {/* Header */}
      <header className="mx-auto max-w-[760px] px-5 pt-10 md:px-8 md:pt-16">
        <div className="flex flex-wrap items-center gap-3.5 text-sm">
          <Link
            href="/photo-essays"
            className="font-semibold text-saffron transition-colors hover:text-saffron-dark"
          >
            ← All essays
          </Link>
          <span aria-hidden className="text-content-soft/40">
            /
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-saffron">
            {essay.location}
          </span>
        </div>

        <h1 className={`mt-6 ${ESSAY_STYLES.title}`}>{essay.title}</h1>
        <p className={`mt-6 ${ESSAY_STYLES.dek}`}>{essay.dek}</p>

        {/* Compact byline: date + share on the left, writer on the right.
            The cover photograph is a listing thumbnail — never shown here. */}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-hairline py-3">
          <span className="text-[13.5px] text-content-soft/80">
            {formatEssayDate(essay.publishedAt)} · {essay.readMinutes} min read
            · {essay.photoCount} photographs
          </span>
          <EssayActions title={essay.title} />
          <span className="ml-auto flex items-center gap-2.5">
            <Avatar author={essay.author} size={28} />
            <span className="text-[13.5px] font-semibold text-content">
              {essay.author.name}
            </span>
          </span>
        </div>
      </header>

      {/* Body */}
      <EssayBody blocks={essay.body} />

      {/* End matter */}
      <footer className="mx-auto mt-14 max-w-[680px] px-5 md:px-8">
        <div
          aria-hidden
          className="flex justify-center gap-2 text-xl text-saffron"
        >
          <span>◆</span>
          <span>◆</span>
          <span>◆</span>
        </div>

        {essay.tags.length > 0 && (
          <ul className="mt-7 flex flex-wrap justify-center gap-2.5">
            {essay.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-saffron/25 px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-saffron"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-4 rounded-[10px] bg-canvas-2 p-6">
          <Avatar author={essay.author} size={56} />
          <div className="min-w-0 flex-1 basis-52">
            <div className="font-semibold text-content">{essay.author.name}</div>
            {essay.author.bio && (
              <div className="mt-0.5 text-sm leading-snug text-content-soft">
                {essay.author.bio}
              </div>
            )}
          </div>
          {essay.videoUrl && (
            <a
              href={essay.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-saffron px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-saffron-dark"
            >
              Watch the video
            </a>
          )}
        </div>
      </footer>

      {/* Read next */}
      {readNext.length > 0 && (
        <section className="container-page mt-16 md:mt-20">
          <div className="flex items-baseline justify-between border-t border-hairline pt-8 md:pt-10">
            <h2 className="font-essay text-2xl font-semibold text-content md:text-3xl">
              Read next
            </h2>
            <Link
              href="/photo-essays"
              className="text-sm font-semibold text-saffron transition-colors hover:text-saffron-dark"
            >
              All essays →
            </Link>
          </div>
          <div className="mt-8 grid gap-9 sm:grid-cols-2">
            {readNext.map((next) => (
              <ReadNextCard key={next.slug} essay={next} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function Avatar({ author, size }: { author: EssayAuthor; size: number }) {
  const initials = author.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-canvas-2 font-essay font-semibold text-clay"
      style={{ width: size, height: size, fontSize: size * 0.375 }}
    >
      {author.avatarUrl ? (
        <Image
          src={author.avatarUrl}
          alt={author.name}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}

/* --- body blocks ----------------------------------------------------------- */

function EssayBody({ blocks }: { blocks: EssayBodyBlock[] }) {
  let sawParagraph = false;
  return (
    <div className="mt-12 md:mt-14">
      {blocks.map((block) => {
        const isParagraph =
          block._type === "block" && block.style !== "pullQuote";
        const dropCap = isParagraph && !sawParagraph;
        if (isParagraph) sawParagraph = true;
        return (
          <Block key={block._key} block={block} dropCap={dropCap} />
        );
      })}
    </div>
  );
}

function Block({
  block,
  dropCap,
}: {
  block: EssayBodyBlock;
  dropCap: boolean;
}) {
  switch (block._type) {
    case "block":
      // Pull quotes written in the /write editor are a block *style*; the
      // pullQuote object below is the Studio/seed shape. Both render the same.
      if (block.style === "pullQuote") {
        return (
          <PullQuote
            quote={block.children.map((c) => c.text).join("")}
          />
        );
      }
      return (
        <p className={ESSAY_STYLES.paragraph}>
          <Spans
            spans={block.children}
            markDefs={block.markDefs}
            dropCap={dropCap}
          />
        </p>
      );

    case "pullQuote":
      return <PullQuote quote={block.quote} />;

    case "imagePair":
      return (
        <div className="mx-auto my-12 grid max-w-[1000px] gap-5 px-5 md:my-14 md:grid-cols-[1fr_1.4fr] md:px-8">
          <PairFigure image={block.left} />
          <PairFigure image={block.right} />
        </div>
      );

    case "essayImage":
      if (block.fullBleed) {
        return (
          <figure className="my-14 md:my-16">
            <EssayPhoto
              image={block.image}
              sizes="100vw"
              className="h-[360px] w-full md:h-[560px]"
            />
            {block.image.caption && (
              <Caption center>{block.image.caption}</Caption>
            )}
          </figure>
        );
      }
      return (
        <figure className="mx-auto my-12 max-w-[1000px] px-5 md:my-14 md:px-8">
          <EssayPhoto
            image={block.image}
            sizes="(max-width: 1000px) 100vw, 1000px"
            className="aspect-[3/2] rounded-lg"
          />
          {block.image.caption && <Caption center>{block.image.caption}</Caption>}
        </figure>
      );

    case "youtube":
      return (
        <figure className="mx-auto my-12 max-w-[760px] px-5 md:my-14 md:px-8">
          <YouTubeEmbed youtubeId={block.youtubeId} />
          {block.caption && <Caption center>{block.caption}</Caption>}
        </figure>
      );

    case "socialEmbed":
      return (
        <div className="mx-auto my-12 max-w-[600px] px-5 md:my-14 md:px-8">
          <SocialEmbed url={block.url} />
        </div>
      );
  }
}

function PullQuote({ quote }: { quote: string }) {
  return (
    <blockquote className={ESSAY_STYLES.pullQuoteWrap}>
      <p className={ESSAY_STYLES.pullQuoteText}>&ldquo;{quote}&rdquo;</p>
    </blockquote>
  );
}

function PairFigure({ image }: { image: EssayImage }) {
  return (
    <figure className="flex flex-col gap-2.5">
      <EssayPhoto
        image={image}
        sizes="(max-width: 768px) 100vw, 40vw"
        className="h-[300px] rounded-lg md:h-[460px]"
      />
      {image.caption && <Caption>{image.caption}</Caption>}
    </figure>
  );
}

function Caption({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <figcaption
      className={`mt-2.5 ${ESSAY_STYLES.caption} ${center ? "px-5 text-center" : ""}`}
    >
      {children}
    </figcaption>
  );
}

/* Renders portable-text spans with em/strong/link marks; the essay's first
   paragraph opens with the design's saffron drop cap. */
function Spans({
  spans,
  markDefs,
  dropCap,
}: {
  spans: EssaySpan[];
  markDefs: { _key: string; _type: "link"; href: string }[];
  dropCap: boolean;
}) {
  return (
    <>
      {spans.map((span, i) => {
        let text: React.ReactNode = span.text;

        if (dropCap && i === 0 && span.text.length > 0) {
          text = (
            <>
              <span aria-hidden className={ESSAY_STYLES.dropCap}>
                {span.text[0]}
              </span>
              <span className="sr-only">{span.text[0]}</span>
              {span.text.slice(1)}
            </>
          );
        }

        for (const mark of span.marks) {
          if (mark === "em") text = <em>{text}</em>;
          else if (mark === "strong") text = <strong>{text}</strong>;
          else {
            const def = markDefs.find((d) => d._key === mark);
            if (def?._type === "link") {
              text = (
                <a
                  href={def.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ESSAY_STYLES.link}
                >
                  {text}
                </a>
              );
            }
          }
        }
        return <span key={span._key}>{text}</span>;
      })}
    </>
  );
}

function ReadNextCard({ essay }: { essay: PhotoEssay }) {
  return (
    <Link href={`/photo-essays/${essay.slug}`} className="group block">
      <EssayPhoto
        image={essay.cover}
        sizes="(max-width: 640px) 100vw, 50vw"
        className="h-[220px] rounded-lg md:h-[260px]"
      />
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-saffron">
        {essay.location}
      </p>
      <h3 className="mt-2 font-essay text-2xl font-semibold leading-tight text-content text-balance transition-colors group-hover:text-saffron md:text-[26px]">
        {essay.title}
      </h3>
      <div className="mt-2.5 flex items-center gap-3 text-[13px] text-content-soft/80">
        <span className="font-medium text-content">{essay.author.name}</span>
        <span aria-hidden>·</span>
        <span>{essay.readMinutes} min read</span>
      </div>
    </Link>
  );
}
