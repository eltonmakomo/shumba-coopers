import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { countProducts, excerpt, imageFor, type CategoryNode, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-3xl border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-muted p-6">
        <div className="absolute inset-x-8 bottom-6 h-6 rounded-full bg-forest/10 blur-xl" aria-hidden />
        {product.image && (
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="relative max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-bold leading-tight">{product.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{excerpt(product, 110)}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Read More <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function CategoryCard({ node, large = false }: { node: CategoryNode; large?: boolean }) {
  const count = countProducts(node);
  return (
    <Link
      to="/category/$slug"
      params={{ slug: node.slug }}
      className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-3xl bg-forest shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${large ? "min-h-80" : "min-h-56"}`}
    >
      <img src={imageFor(node)} alt="" loading="lazy" className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="bg-fade-overlay absolute inset-0 -z-10" aria-hidden />
      <div className="glass-dark m-3 flex items-end justify-between gap-3 rounded-2xl p-4 text-forest-foreground">
        <div>
          <h3 className={`font-display font-bold leading-tight ${large ? "text-2xl" : "text-lg"}`}>{node.title}</h3>
          {count > 0 && <p className="mt-1 text-xs text-forest-foreground/70">{count} products</p>}
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sun text-sun-foreground transition-transform group-hover:rotate-45">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
