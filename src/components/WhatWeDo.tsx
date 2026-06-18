"use client";

import { useState } from "react";
import Image from "next/image";
import { WHAT_WE_DO } from "@/lib/content";

export function WhatWeDo() {
  const featuredIndex = Math.max(
    0,
    WHAT_WE_DO.findIndex((i) => i.featured),
  );
  const [active, setActive] = useState(featuredIndex);

  return (
    <>
      {/* Desktop: expand-on-hover accordion */}
      <div className="hidden h-[360px] gap-2 md:flex lg:h-[440px]">
        {WHAT_WE_DO.map((item, i) => {
          const isActive = i === active;
          return (
            <div
              key={item.title}
              role="button"
              tabIndex={0}
              aria-label={item.title}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`group relative cursor-pointer overflow-hidden rounded-xl bg-canvas-2 outline-none transition-[flex-grow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-saffron ${
                isActive ? "flex-[3.5]" : "flex-[1]"
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 0px, 45vw"
                className={`object-cover transition-transform duration-700 ease-out ${
                  isActive ? "scale-100" : "scale-110"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col p-4 lg:p-5">
                <h3
                  className={`font-display font-semibold leading-tight text-paper transition-all duration-300 ${
                    isActive ? "text-2xl lg:text-3xl" : "text-base lg:text-lg"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`overflow-hidden text-sm text-paper/80 transition-all duration-300 ${
                    isActive ? "mt-2 max-h-24 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: static grid (no hover) */}
      <div className="grid grid-cols-2 gap-2 md:hidden">
        {WHAT_WE_DO.map((item, i) => (
          <div
            key={item.title}
            className={`relative aspect-[4/5] overflow-hidden rounded-lg bg-canvas-2 ${
              i === WHAT_WE_DO.length - 1 && WHAT_WE_DO.length % 2 === 1
                ? "col-span-2 aspect-[2/1]"
                : ""
            }`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 50vw, 0px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <h3 className="font-display text-base font-semibold leading-tight text-paper">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
