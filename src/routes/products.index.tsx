import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CategoryCard, ProductCard } from "@/components/site/Cards";
import { PageHero } from "@/components/site/PageHero";
import { cropsImg, products, topSections } from "@/lib/catalog";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products — Shumba Coopers" },
      { name: "description", content: "Browse Shumba Coopers animal health, pest control, crop chemicals, disinfectants and grain protection products." },
      { property: "og:title", content: "Shumba Coopers Products" },
      { property: "og:description", content: "The full Shumba Coopers product range." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return products.filter((p) => p.title.toLowerCase().includes(s) || p.cats.some((c) => c.toLowerCase().includes(s)));
  }, [q]);

  return (
    <>
      <PageHero title="Products" image={cropsImg} crumbs={[{ label: "Products" }]} />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <label className="glass -mt-24 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-lift">
          <Search className="size-5 text-primary" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${products.length} products by name or category…`}
            className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground"
            aria-label="Search products"
          />
        </label>

        {q ? (
          <div className="mt-10">
            <p className="text-sm text-muted-foreground">{list.length} results</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topSections.map((s) => (
              <CategoryCard key={s.slug} node={s} large />
            ))}
            <Link to="/technical-services" className="flex min-h-80 flex-col justify-end rounded-3xl bg-sun-gradient p-7 text-sun-foreground shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
              <h3 className="font-display text-2xl font-bold">Technical Services</h3>
              <p className="mt-2 text-sm">Expert advice from our vets, microbiologists and hygiene specialists.</p>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
