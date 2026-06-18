"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CATALOG_TOPICS,
  CATALOG_TYPES,
  type CatalogItem,
  type CatalogType,
} from "@/lib/content";
import { CatalogCard } from "@/components/CatalogCard";

export function Catalog({
  items,
  limit,
  viewAllHref,
  columns = 4,
}: {
  items: CatalogItem[];
  limit?: number;
  viewAllHref?: string;
  columns?: 3 | 4 | 5;
}) {
  const [topic, setTopic] = useState<(typeof CATALOG_TOPICS)[number]>("All");
  const [types, setTypes] = useState<CatalogType[]>([]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const topicOk = topic === "All" || item.topic === topic;
      const typeOk = types.length === 0 || types.includes(item.type);
      return topicOk && typeOk;
    });
  }, [items, topic, types]);

  const visible = limit ? filtered.slice(0, limit) : filtered;

  function toggleType(t: CatalogType) {
    setTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-hairline pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-widest text-content-soft/70">
            Topic
          </span>
          {CATALOG_TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                topic === t
                  ? "bg-saffron text-paper"
                  : "bg-canvas-2 text-content-soft hover:bg-content/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-widest text-content-soft/70">
            Type
          </span>
          {CATALOG_TYPES.map((t) => {
            const on = types.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => toggleType(t)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  on
                    ? "border-content bg-content text-canvas"
                    : "border-content/25 text-content-soft hover:border-content/50"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {visible.length > 0 ? (
        <div
          className={`mt-8 grid ${
            columns === 5
              ? "grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
              : columns === 4
                ? "grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
                : "gap-6 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {visible.map((item) => (
            <CatalogCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-content-soft">
          No products match these filters yet. Try clearing a filter.
        </p>
      )}

      {viewAllHref && (
        <div className="mt-10 text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 font-semibold text-saffron-dark transition-colors hover:text-saffron"
          >
            View all <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
