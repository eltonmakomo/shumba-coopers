import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { CategoryCard, ProductCard } from "@/components/site/Cards";
import { PageHero, type Crumb } from "@/components/site/PageHero";
import { bannerFor, getCategory, getChildren, getProductsFor, getTrail } from "@/lib/catalog";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const node = getCategory(params.slug);
    if (!node) throw notFound();
    return { slug: node.slug, title: node.title };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Category not found — Shumba Coopers" }, { name: "robots", content: "noindex" }] };
    const node = getCategory(loaderData.slug)!;
    const trail = getTrail(node).map((n) => n.title).join(" · ");
    const desc = node.intro?.[0] ?? `Shumba Coopers ${trail} products.`;
    return {
      meta: [
        { title: `${trail} — Shumba Coopers` },
        { name: "description", content: desc.slice(0, 160) },
        { property: "og:title", content: `${trail} — Shumba Coopers` },
        { property: "og:description", content: desc.slice(0, 160) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useLoaderData();
  const node = getCategory(slug)!;
  const trail = getTrail(node);
  const children = getChildren(node);
  const items = getProductsFor(node);
  const parent = node.parent ? getCategory(node.parent) : undefined;
  const siblings = parent ? getChildren(parent) : [];

  const crumbs: Crumb[] = [
    { label: "Products", to: "/products" },
    ...trail.map((t, i) =>
      i === trail.length - 1 ? { label: t.title } : { label: t.title, to: "/category/$slug" as const, params: { slug: t.slug } },
    ),
  ];

  return (
    <>
      <PageHero title={parent && parent.parent ? `${parent.title} · ${node.title}` : node.title} image={bannerFor(node)} crumbs={crumbs}>
        {node.intro?.map((p) => (
          <p key={p} className="mb-3">{p}</p>
        ))}
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {siblings.length > 1 && (
          <div className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-2">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                to="/category/$slug"
                params={{ slug: s.slug }}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${s.slug === node.slug ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary hover:text-primary"}`}
              >
                {s.title}
              </Link>
            ))}
          </div>
        )}

        {children.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((c) => (
              <CategoryCard key={c.slug} node={c} />
            ))}
            {node.slug === "animal-health" && (
              <Link to="/technical-services" className="flex min-h-56 flex-col justify-end rounded-3xl bg-sun-gradient p-6 text-sun-foreground shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <h3 className="font-display text-lg font-bold">Technical Services</h3>
              </Link>
            )}
          </div>
        )}

        {items.length > 0 && (
          <>
            <p className="mb-5 text-sm text-muted-foreground">{items.length} products</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </>
        )}

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-forest-gradient p-8 text-forest-foreground">
          <p className="font-display text-2xl font-bold">Where can I buy these products?</p>
          <Link to="/find-a-distributor" className="inline-flex items-center gap-2 rounded-full bg-sun px-6 py-3 font-semibold text-sun-foreground">
            <MapPin className="size-4" /> Find a Distributor
          </Link>
        </div>
      </div>
    </>
  );
}
