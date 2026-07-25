"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { LearnVideo } from "@/lib/learnFormats";

type Variant = "portrait" | "landscape";

// Per-variant geometry. Horizontal spread is split into mobile (`*M`) and
// desktop (`*D`) values so the fan never overflows a narrow phone column;
// `open` values apply when the stack is expanded (hover / touch), `rest`
// values when it's collapsed to a faint peek.
const CFG: Record<
  Variant,
  {
    width: string;
    aspect: string;
    openM: number;
    restM: number;
    openD: number;
    restD: number;
    rotStep: number;
    sideScale: number;
    title: string;
    views: string;
    pad: string;
    sizes: string;
  }
> = {
  portrait: {
    width: "w-36 md:w-48",
    aspect: "aspect-[9/16]",
    openM: 2.4,
    restM: 1.1,
    openD: 5.2,
    restD: 2.2,
    rotStep: 7,
    sideScale: 0.14,
    title: "text-sm",
    views: "text-[11px]",
    pad: "p-4 pt-10",
    sizes: "200px",
  },
  landscape: {
    width: "w-[82%] md:w-[86%]",
    aspect: "aspect-video",
    openM: 0.7,
    restM: 0.35,
    openD: 2,
    restD: 1,
    rotStep: 3,
    sideScale: 0.08,
    title: "text-base md:text-lg",
    views: "text-xs",
    pad: "p-5 pt-16",
    sizes: "600px",
  },
};

export function StackCarousel({
  videos,
  variant,
}: {
  videos: LearnVideo[];
  variant: Variant;
}) {
  const n = videos.length;
  const cfg = CFG[variant];
  const [active, setActive] = useState(0);
  const [containerHover, setContainerHover] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Touch devices have no hover, so keep the fan open and the arrows visible.
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      setIsTouch(window.matchMedia("(hover: none)").matches);
    }
  }, []);

  const open = containerHover || isTouch;
  // Only VISIBLE cards per side ever show (symmetric fan); any extra reels stay
  // hidden behind the center card and rotate into the window via the arrows.
  const VISIBLE = 2;
  const go = (dir: number) => setActive((a) => (a + dir + n) % n);

  return (
    <div
      className="group relative mt-5 flex flex-1 items-center justify-center"
      onMouseEnter={() => setContainerHover(true)}
      onMouseLeave={() => setContainerHover(false)}
    >
      <div
        className={`relative w-full ${
          variant === "portrait" ? "h-72 md:h-[23rem]" : "aspect-video"
        }`}
      >
        {videos.map((v, i) => {
          // Signed circular distance from the active (front) card.
          let d = i - active;
          if (d > n / 2) d -= n;
          if (d < -n / 2) d += n;
          const ad = Math.abs(d);
          const dir = Math.sign(d);
          const isCenter = d === 0;
          // Cards past the window hide behind the center, ready to rotate in.
          const inWindow = ad <= VISIBLE;
          const eff = Math.min(ad, VISIBLE);
          const t = eff / VISIBLE;

          const xM = inWindow ? dir * (open ? cfg.openM : cfg.restM) * eff : 0;
          const xD = inWindow ? dir * (open ? cfg.openD : cfg.restD) * eff : 0;
          const rot = inWindow ? dir * cfg.rotStep * eff * (open ? 1 : 0.6) : 0;
          // Hovering the stack enlarges every card uniformly — no single card
          // is singled out; use the arrows to bring a card to the front.
          const openBump = open ? 1.06 : 1;
          const scale =
            (isCenter ? 1 : inWindow ? 1 - cfg.sideScale * t : 0.85) * openBump;
          const z = inWindow ? 100 - ad : 0;
          const opacity = isCenter
            ? 1
            : !inWindow
              ? 0
              : open
                ? 1 - 0.2 * t
                : Math.max(0.2, 0.42 - 0.16 * t);
          const showInfo = isCenter;

          return (
            <a
              key={i}
              href={v.url}
              target="_blank"
              rel="noreferrer"
              aria-label={v.title}
              className={`absolute left-1/2 top-1/2 ${cfg.width} [transform:translate(-50%,-50%)_translateX(var(--x))] transition-[transform] duration-300 ease-out md:[transform:translate(-50%,-50%)_translateX(var(--x-md))] ${
                inWindow ? "" : "pointer-events-none"
              }`}
              style={
                {
                  "--x": `${xM}rem`,
                  "--x-md": `${xD}rem`,
                  zIndex: z,
                } as React.CSSProperties
              }
            >
              <span
                className={`relative block ${cfg.aspect} w-full overflow-hidden rounded-2xl border border-content/15 shadow-xl shadow-ink/40 transition-[transform,opacity] duration-300 ease-out will-change-transform`}
                style={{
                  transform: `rotate(${rot}deg) scale(${scale})`,
                  opacity,
                }}
              >
                {v.thumbnail ? (
                  <Image
                    src={v.thumbnail}
                    alt=""
                    fill
                    sizes={cfg.sizes}
                    className="object-cover"
                  />
                ) : (
                  <span className="filmstrip-frame absolute inset-0" />
                )}
                <span
                  className={`absolute inset-x-0 bottom-0 ${cfg.pad} bg-gradient-to-t from-ink/90 via-ink/40 to-transparent transition-opacity duration-300 ${
                    showInfo ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {v.views && (
                    <span
                      className={`block font-mono ${cfg.views} font-semibold uppercase tracking-widest text-marigold`}
                    >
                      {v.views}
                    </span>
                  )}
                  <span
                    className={`mt-1 block ${cfg.title} font-semibold leading-snug text-paper`}
                  >
                    {v.title}
                  </span>
                </span>
              </span>
            </a>
          );
        })}
      </div>

      {n > 1 && (
        <>
          <Arrow dir="prev" onClick={() => go(-1)} visible={open} />
          <Arrow dir="next" onClick={() => go(1)} visible={open} />
        </>
      )}
    </div>
  );
}

function Arrow({
  dir,
  onClick,
  visible,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  visible: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className={`absolute top-1/2 z-[300] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-hairline bg-card/85 text-content shadow-lg shadow-ink/20 backdrop-blur transition-all duration-200 hover:bg-card ${
        dir === "prev" ? "left-0 md:-left-3" : "right-0 md:-right-3"
      } ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {dir === "prev" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}
