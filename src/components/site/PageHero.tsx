import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export type Crumb = { label: string; to?: string; params?: Record<string, string> };

export function PageHero({ title, image, crumbs, children }: { title: string; image: string; crumbs: Crumb[]; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-forest text-forest-foreground">
      <img src={image} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="bg-hero-overlay absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 md:pb-20 md:pt-20">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-forest-foreground/70">
          <Link to="/" className="hover:text-sun">Home</Link>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight className="size-3.5" />
              {c.to ? (
                <Link to={c.to} params={c.params} className="hover:text-sun">{c.label}</Link>
              ) : (
                <span className="text-forest-foreground">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] animate-rise md:text-6xl">{title}</h1>
        {children && <div className="mt-6 max-w-2xl text-lg text-forest-foreground/85 animate-rise">{children}</div>}
      </div>
    </section>
  );
}
