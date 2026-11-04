import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin } from "lucide-react";
import { ProductCard } from "@/components/site/Cards";
import { excerpt, getCategoriesForProduct, getProduct, getProductsFor, getTrail } from "@/lib/catalog";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return { slug: p.slug };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product not found — Shumba Coopers" }, { name: "robots", content: "noindex" }] };
    const p = getProduct(loaderData.slug)!;
    const d = excerpt(p, 155);
    const meta = [
      { title: `${p.title} — Shumba Coopers` },
      { name: "description", content: d },
      { property: "og:title", content: `${p.title} — Shumba Coopers` },
      { property: "og:description", content: d },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (p.image) meta.push({ property: "og:image", content: p.image }, { name: "twitter:image", content: p.image });
    return { meta };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const p = getProduct(slug)!;
  const cats = getCategoriesForProduct(slug);
  const primary = cats[0];
  const related = primary ? getProductsFor(primary).filter((x) => x.slug !== slug).slice(0, 4) : [];

  return (
    <>
      <section className="bg-forest-gradient relative overflow-hidden">
        <div className="grain-dots absolute inset-0 opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6">
          {primary ? (
            <Link to="/category/$slug" params={{ slug: primary.slug }} className="inline-flex items-center gap-2 text-sm text-forest-foreground/80 hover:text-sun">
              <ArrowLeft className="size-4" /> {getTrail(primary).map((t) => t.title).join(" · ")}
            </Link>
          ) : (
            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-forest-foreground/80 hover:text-sun">
              <ArrowLeft className="size-4" /> Products
            </Link>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <aside className="-mt-6 lg:sticky lg:top-24 lg:self-start">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border bg-card p-10 shadow-lift">
            <div className="absolute inset-x-12 bottom-10 h-10 rounded-full bg-forest/15 blur-2xl" aria-hidden />
            {p.image && <img src={p.image} alt={p.title} className="relative max-h-full max-w-full object-contain" />}
          </div>
          {cats.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {cats.map((c) => (
                <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary">
                  {getTrail(c).slice(-2).map((t) => t.title).join(" · ")}
                </Link>
              ))}
            </div>
          )}
          <Link to="/find-a-distributor" className="mt-5 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-glow">
            <MapPin className="size-4" /> Find a Distributor
          </Link>
        </aside>

        <article className="pt-8">
          <h1 className="text-4xl font-extrabold md:text-5xl">{p.title}</h1>
          <div className="prose-product mt-8 rounded-3xl border bg-card p-6 shadow-soft md:p-9" dangerouslySetInnerHTML={{ __html: p.html }} />
        </article>
      </div>

      {related.length > 0 && (
        <section className="bg-muted/60">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-extrabold">More in {primary.title}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
