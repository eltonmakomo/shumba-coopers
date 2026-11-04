import { Link } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { topSections } from "@/lib/catalog";
import { offices } from "@/lib/company";

export function SiteFooter() {
  return (
    <footer className="bg-forest-gradient relative overflow-hidden text-forest-foreground">
      <div className="grain-dots absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-2xl font-bold">Shumba Coopers</p>
          <p className="mt-3 text-sm text-forest-foreground/70">Trusted Animal Health Products</p>
          <Link to="/find-a-distributor" className="mt-6 inline-flex items-center gap-2 rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-sun-foreground">
            <MapPin className="size-4" /> Find a Distributor
          </Link>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sun">Products</p>
          <ul className="mt-4 space-y-2 text-sm">
            {topSections.map((s) => (
              <li key={s.slug}>
                <Link to="/category/$slug" params={{ slug: s.slug }} className="text-forest-foreground/80 hover:text-sun">
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/technical-services" className="text-forest-foreground/80 hover:text-sun">Technical Services</Link>
            </li>
          </ul>
        </div>
        {offices.map((o) => (
          <div key={o.city}>
            <p className="text-xs font-semibold uppercase tracking-widest text-sun">{o.city}</p>
            <address className="mt-4 space-y-2 text-sm not-italic text-forest-foreground/80">
              {o.address.map((l) => (
                <p key={l}>{l}</p>
              ))}
              {o.phones.map((p) => (
                <a key={p.label} href={p.href} className="flex items-center gap-2 hover:text-sun">
                  <Phone className="size-3.5" /> {p.label}
                </a>
              ))}
            </address>
          </div>
        ))}
      </div>
      <div className="relative border-t border-forest-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-4 py-5 text-xs text-forest-foreground/60 sm:px-6">
          <p>© Coyright Shumba Group Zimbabwe - 2026</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-sun">About Us</Link>
            <Link to="/contact" className="hover:text-sun">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
