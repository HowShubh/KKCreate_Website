"use client";

import { useState } from "react";
import { BRAND_WORK, type BrandWork } from "@/lib/content";

export function BrandMarquee() {
  // Two identical copies so the CSS translateX(-50%) loops seamlessly.
  const loop = [...BRAND_WORK, ...BRAND_WORK];

  return (
    <div className="marquee-root group relative overflow-hidden py-4">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-canvas to-transparent md:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-canvas to-transparent md:w-32" />

      <ul className="marquee-track flex w-max items-center gap-5">
        {loop.map((item, i) => (
          <li key={i} className="shrink-0" aria-hidden={i >= BRAND_WORK.length}>
            <BrandLogo item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function BrandLogo({ item }: { item: BrandWork }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="flex h-20 w-[220px] items-center justify-center gap-2.5 rounded-2xl border border-paper/10 bg-ink px-7">
      {item.logo && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.logo}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-7 w-auto max-w-[40px] shrink-0 object-contain opacity-95"
        />
      )}
      <span className="font-display text-xl font-semibold tracking-tight text-paper">
        {item.brand}
      </span>
    </span>
  );
}
