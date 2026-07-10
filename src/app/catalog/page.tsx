import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { getCatalogItems } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse every KK Create course, workshop, ebook and tool. Filter by topic and type to find what fits where you are right now.",
};

export default async function CatalogPage() {
  const items = await getCatalogItems();
  return (
    <section className="py-14 md:py-20">
      <div className="container-page">
        <CatalogBrowser items={items} />
      </div>
    </section>
  );
}
