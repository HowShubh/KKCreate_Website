import Image from "next/image";
import { getFlagship } from "@/lib/catalog";
import { withUtm } from "@/lib/utm";

export async function FlagshipBlock() {
  const FLAGSHIP = await getFlagship();
  return (
    <div className="container-page">
      <div className="overflow-hidden rounded-3xl bg-feature text-paper">
        <div className="grid items-stretch md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-marigold">
              {FLAGSHIP.kicker}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
              {FLAGSHIP.title}
            </h2>

            <ul className="mt-6 space-y-3">
              {FLAGSHIP.pointers.map((p) => (
                <li key={p} className="flex gap-3 text-paper/85">
                  <span
                    aria-hidden
                    className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-saffron"
                  />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="font-display text-2xl font-semibold">
                {FLAGSHIP.price}
              </span>
              <div className="flex gap-3">
                <a
                  href={withUtm(FLAGSHIP.enrollUrl, { campaign: "flagship" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-saffron px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-saffron-dark"
                >
                  Enroll Now
                </a>
                <a
                  href={withUtm(FLAGSHIP.knowMoreUrl, { campaign: "flagship" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-paper/30 px-6 py-3 text-sm font-semibold text-paper transition-colors hover:border-paper"
                >
                  Know More
                </a>
              </div>
            </div>
          </div>

          <div className="relative min-h-64 md:min-h-full">
            <Image
              src={FLAGSHIP.thumbnail}
              alt={FLAGSHIP.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent md:bg-gradient-to-r" />
          </div>
        </div>
      </div>
    </div>
  );
}
