import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { CATALOG } from "@/lib/content";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse every KK Create course, workshop, ebook and tool. Filter by topic and type to find what fits where you are right now.",
};

export default function CatalogPage() {
  return (
    <section className="py-14 md:py-20">
      <div className="container-page">
        <CatalogBrowser items={CATALOG} />
      </div>
    </section>
  );
}
