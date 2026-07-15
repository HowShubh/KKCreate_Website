import Link from "next/link";
import { type CatalogItem } from "@/lib/content";
import { CatalogCard } from "@/components/CatalogCard";
import { Reveal } from "@/components/Reveal";

// Lightweight preview grid used on the Home and Learn pages. The full
// filter + pagination experience lives on the dedicated /catalog page.
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
  const visible = limit ? items.slice(0, limit) : items;

  return (
    <div>
      <div
        className={`grid ${
          columns === 5
            ? "grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
            : columns === 4
              ? "grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4"
              : "gap-6 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {visible.map((item, i) => (
          <Reveal key={item.id} delay={(i % columns) * 90}>
            <CatalogCard item={item} />
          </Reveal>
        ))}
      </div>

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
