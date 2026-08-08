"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATALOG_TOPICS,
  CATALOG_TOPIC_EMOJI,
  CATALOG_TYPES,
  type CatalogItem,
  type CatalogType,
} from "@/lib/content";
import { CatalogCard } from "@/components/CatalogCard";

type Topic = (typeof CATALOG_TOPICS)[number];
type TypeFilter = "All" | CatalogType;
type Sort = "featured" | "rating";

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "All", label: "All types" },
  ...CATALOG_TYPES.map((t) => ({ value: t, label: t })),
];

// No price sorts: cards don't show a price, so sorting by one would reshuffle
// the grid with nothing on screen to explain why.
const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Top rated" },
];

const PAGE_SIZE = 8;

export function CatalogBrowser({ items }: { items: CatalogItem[] }) {
  const [topic, setTopic] = useState<Topic>("All");
  const [type, setType] = useState<TypeFilter>("All");
  const [sort, setSort] = useState<Sort>("featured");
  const [page, setPage] = useState(1);

  const isDefault = topic === "All" && type === "All" && sort === "featured";

  const filtered = useMemo(() => {
    const list = items.filter((item) => {
      const topicOk = topic === "All" || item.topic === topic;
      const typeOk = type === "All" || item.type === type;
      return topicOk && typeOk;
    });

    switch (sort) {
      case "rating":
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [items, topic, type, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Keep the page in range whenever the filtered set shrinks.
  useEffect(() => {
    setPage((p) => Math.min(p, pageCount));
  }, [pageCount]);

  const start = (page - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  function reset() {
    setTopic("All");
    setType("All");
    setSort("featured");
    setPage(1);
  }

  return (
    <div>
      {/* Heading */}
      <h1 className="text-center font-display text-4xl font-bold leading-[1.1] tracking-tight text-content text-balance md:text-5xl">
        What do you want to <span className="text-saffron">learn</span> today?
      </h1>

      {/* Topic pills */}
      <div className="no-scrollbar mt-8 flex items-center gap-2 overflow-x-auto pb-1 md:flex-wrap md:justify-center md:overflow-visible">
        {CATALOG_TOPICS.map((t) => {
          const on = topic === t;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setTopic(t);
                setPage(1);
              }}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                on
                  ? "border-saffron bg-saffron text-paper shadow-sm"
                  : "border-content/15 bg-card text-content-soft hover:border-content/40"
              }`}
            >
              <span aria-hidden>{CATALOG_TOPIC_EMOJI[t]}</span>
              {t}
            </button>
          );
        })}
      </div>

      {/* Type + sort controls */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Dropdown
          label="Type"
          value={type}
          options={TYPE_OPTIONS}
          onChange={(v) => {
            setType(v);
            setPage(1);
          }}
        />
        <Dropdown
          label="Sort"
          value={sort}
          options={SORT_OPTIONS}
          onChange={(v) => {
            setSort(v);
            setPage(1);
          }}
        />
        {!isDefault && (
          <button
            type="button"
            onClick={reset}
            className="px-2 text-sm font-medium text-content-soft/70 underline-offset-4 transition-colors hover:text-saffron hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {visible.map((item) => (
            <CatalogCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-content-soft">
          No products match these filters yet. Try clearing a filter.
        </p>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          {pageCount > 1 && (
            <div className="flex items-center gap-2">
              <PageArrow
                dir="prev"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-current={page === n ? "page" : undefined}
                  onClick={() => setPage(n)}
                  className={`h-10 w-10 rounded-full text-sm font-semibold transition-colors ${
                    page === n
                      ? "bg-saffron text-paper"
                      : "border border-content/15 text-content-soft hover:border-content/40"
                  }`}
                >
                  {n}
                </button>
              ))}
              <PageArrow
                dir="next"
                disabled={page === pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              />
            </div>
          )}
          <p className="text-sm text-content-soft">
            Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </p>
        </div>
      )}
    </div>
  );
}

function Dropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-content/15 bg-card px-4 py-2 text-sm font-medium text-content-soft transition-colors hover:border-content/40"
      >
        <span className="text-content-soft/70">{label}</span>
        <span className="text-content">·</span>
        <span className="font-semibold text-content">{current?.label}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-1/2 z-30 mt-2 min-w-[12rem] -translate-x-1/2 rounded-xl border border-hairline bg-card p-1 shadow-lg"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? "bg-saffron/10 font-semibold text-saffron-dark"
                    : "text-content-soft hover:bg-content/5"
                }`}
              >
                {opt.label}
                {active && <CheckIcon />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-saffron-dark"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function PageArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous page" : "Next page"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-content/15 text-content-soft transition-colors hover:border-content/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-content/15"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 ${dir === "prev" ? "" : "rotate-180"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
