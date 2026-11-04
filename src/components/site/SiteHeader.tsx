import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, MapPin, Menu, X } from "lucide-react";
import logo from "@/assets/logo-coopers-shumba.png";
import { getCategory, getChildren, topSections } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const navLink =
  "rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const animal = getCategory("animal-health")!;
  const others = topSections.filter((s) => s.slug !== "animal-health");

  return (
    <header className={cn("sticky top-0 z-50 transition-all", scrolled ? "glass shadow-soft" : "bg-background/80")}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0" aria-label="Shumba Coopers home">
          <img src={logo} alt="Coopers Animal Health and Shumba Group" className="h-11 w-auto" width={412} height={154} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          <Link to="/" className={navLink} activeOptions={{ exact: true }} activeProps={{ className: "bg-muted text-foreground" }}>
            Home
          </Link>
          <Link to="/about" className={navLink} activeProps={{ className: "bg-muted text-foreground" }}>
            About Us
          </Link>
          <div className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <button
              className={cn(navLink, "inline-flex items-center gap-1")}
              aria-expanded={mega}
              onClick={() => setMega((v) => !v)}
            >
              Products <ChevronDown className={cn("size-4 transition-transform", mega && "rotate-180")} />
            </button>
            {mega && (
              <div className="absolute left-1/2 top-full w-[860px] -translate-x-1/2 pt-3">
                <div className="glass grid grid-cols-[1.4fr_1fr] gap-6 rounded-3xl p-6 shadow-lift animate-rise">
                  <div>
                    <Link to="/category/$slug" params={{ slug: "animal-health" }} onClick={() => setMega(false)} className="font-display text-lg font-bold text-forest hover:text-primary">
                      Animal Health
                    </Link>
                    <div className="mt-3 grid grid-cols-2 gap-1">
                      {getChildren(animal).map((c) => (
                        <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} onClick={() => setMega(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-muted">
                          {c.title}
                        </Link>
                      ))}
                      <Link to="/technical-services" onClick={() => setMega(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-muted">
                        Technical Services
                      </Link>
                    </div>
                  </div>
                  <div className="space-y-1 border-l pl-6">
                    {others.map((s) => (
                      <Link key={s.slug} to="/category/$slug" params={{ slug: s.slug }} onClick={() => setMega(false)} className="block rounded-xl px-3 py-2 hover:bg-muted">
                        <span className="font-display font-semibold">{s.title}</span>
                        {s.children && (
                          <span className="block text-xs text-muted-foreground">{getChildren(s).map((c) => c.title).join(" · ")}</span>
                        )}
                      </Link>
                    ))}
                    <Link to="/products" onClick={() => setMega(false)} className="mt-2 block rounded-xl bg-muted px-3 py-2 text-sm font-semibold text-primary">
                      View all products →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link to="/technical-services" className={navLink} activeProps={{ className: "bg-muted text-foreground" }}>
            Technical Services
          </Link>
          <Link to="/contact" className={navLink} activeProps={{ className: "bg-muted text-foreground" }}>
            Contact Us
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/find-a-distributor"
            className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <MapPin className="size-4" /> Find a Distributor
          </Link>
          <button className="rounded-full p-2 hover:bg-muted lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[80vh] overflow-y-auto border-t bg-card px-4 pb-6 lg:hidden">
          <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile">
            {[
              ["/", "Home"],
              ["/about", "About Us"],
              ["/products", "All Products"],
              ["/technical-services", "Technical Services"],
              ["/contact", "Contact Us"],
            ].map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 font-medium hover:bg-muted">
                {label}
              </Link>
            ))}
            <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ranges</p>
            {topSections.map((s) => (
              <Link key={s.slug} to="/category/$slug" params={{ slug: s.slug }} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 hover:bg-muted">
                {s.title}
              </Link>
            ))}
            <Link to="/find-a-distributor" onClick={() => setOpen(false)} className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground">
              <MapPin className="size-4" /> Find a Distributor
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
