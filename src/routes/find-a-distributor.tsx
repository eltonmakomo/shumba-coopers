import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, MapPin, Navigation, Phone, Search, Store, User, X } from "lucide-react";
import { heroCattle } from "@/lib/catalog";
import { offices } from "@/lib/company";
import { branches, directionsUrl, phoneLinks, provinces, searchBranches, titleCase, type Branch } from "@/lib/distributors";
import { cn } from "@/lib/utils";

type Search = { province?: string; q?: string };

export const Route = createFileRoute("/find-a-distributor")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    province: typeof s.province === "string" && provinces.includes(s.province) ? s.province : undefined,
    q: typeof s.q === "string" && s.q ? s.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Find Your Distributor — Shumba Coopers" },
      { name: "description", content: "Find a Farm & City Centre branch stocking Shumba Coopers products in your province, with phone, email and directions." },
      { property: "og:title", content: "Find Your Shumba Coopers Distributor" },
      { property: "og:description", content: "Every branch stocking Shumba Coopers products, by province." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Finder,
});

function Finder() {
  const { province = null, q: initialQ = "" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(initialQ);

  const setProvince = (p: string | null) =>
    navigate({ search: (prev) => ({ ...prev, province: p ?? undefined }), replace: true, resetScroll: false });

  const results = useMemo(() => searchBranches(branches, q, province), [q, province]);
  const inProvince = province ? branches.filter((b) => b.province === province) : branches;
  const managers = new Set(inProvince.map((b) => b.manager)).size;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-forest text-forest-foreground">
        <img src={heroCattle} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="bg-hero-overlay absolute inset-0 -z-10" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 md:pt-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-sun">Distributor Finder</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.02] md:text-6xl">Find your distributor</h1>
          <p className="mt-5 max-w-xl text-lg text-forest-foreground/85">
            {branches.length} Farm &amp; City Centre branches stock Shumba Coopers products. Pick your province or search by town.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-20 max-w-7xl px-4 pb-24 sm:px-6">
        {/* Controls */}
        <div className="glass rounded-3xl p-4 shadow-lift md:p-5">
          <label className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3">
            <Search className="size-5 text-primary" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by town, branch, address or manager…"
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              aria-label="Search distributors"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear search" className="rounded-full p-1 hover:bg-muted">
                <X className="size-4" />
              </button>
            )}
          </label>
          <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Province">
            <ProvinceChip active={!province} onClick={() => setProvince(null)} label="All provinces" count={branches.length} />
            {provinces.map((p) => (
              <ProvinceChip key={p} active={province === p} onClick={() => setProvince(p)} label={p} count={branches.filter((b) => b.province === p).length} />
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Side panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-forest-gradient relative overflow-hidden rounded-3xl p-7 text-forest-foreground shadow-lift">
              <div className="grain-dots absolute inset-0 opacity-30" aria-hidden />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-widest text-sun">{province ? "Province" : "Zimbabwe"}</p>
                <h2 className="mt-2 text-3xl font-extrabold">{province ?? "All provinces"}</h2>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="glass-dark rounded-2xl p-4">
                    <p className="font-display text-3xl font-extrabold text-sun">{inProvince.length}</p>
                    <p className="text-xs text-forest-foreground/75">Branches</p>
                  </div>
                  <div className="glass-dark rounded-2xl p-4">
                    <p className="font-display text-3xl font-extrabold text-sun">{managers}</p>
                    <p className="text-xs text-forest-foreground/75">Branch managers</p>
                  </div>
                </div>

                <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-sun">Sales enquiries</p>
                <div className="mt-3 space-y-3">
                  {offices.map((o) => (
                    <div key={o.city} className="glass-dark rounded-2xl p-4 text-sm">
                      <p className="font-display text-base font-bold">Shumba Coopers {o.city}</p>
                      <p className="mt-1 text-forest-foreground/75">{o.address.join(" ")}</p>
                      <div className="mt-2 flex flex-col gap-1">
                        {o.phones.map((p) => (
                          <a key={p.label} href={p.href} className="inline-flex items-center gap-2 hover:text-sun">
                            <Phone className="size-3.5" /> {p.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="mt-5 inline-flex text-sm font-semibold text-sun hover:underline">
                  All contact details →
                </Link>
              </div>
            </div>
          </aside>

          {/* Results */}
          <section aria-live="polite">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{results.length}</span> {results.length === 1 ? "store" : "stores"}
                {province && <> in {province}</>}
                {q && <> matching “{q}”</>}
              </p>
            </div>
            {results.length === 0 ? (
              <div className="rounded-3xl border border-dashed bg-card p-12 text-center">
                <Store className="mx-auto size-10 text-muted-foreground" />
                <p className="mt-4 font-display text-xl font-bold">No stores found</p>
                <p className="mt-1 text-muted-foreground">Try another town or clear the province filter.</p>
                <button onClick={() => { setQ(""); setProvince(null); }} className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {results.map((b) => (
                  <BranchCard key={b.id} b={b} showProvince={!province} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function ProvinceChip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
        active ? "border-primary bg-primary text-primary-foreground shadow-glow" : "bg-card hover:border-primary hover:text-primary",
      )}
    >
      {label}
      <span className={cn("rounded-full px-2 py-0.5 text-xs", active ? "bg-primary-foreground/20" : "bg-muted")}>{count}</span>
    </button>
  );
}

function BranchCard({ b, showProvince }: { b: Branch; showProvince: boolean }) {
  const mobiles = phoneLinks(b.mobile);
  const lands = phoneLinks(b.landline);
  const firstDial = [...mobiles, ...lands].find((p) => p.href);

  return (
    <article className="group flex flex-col rounded-3xl border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Farm &amp; City Centre</p>
          <h3 className="mt-1 font-display text-xl font-bold leading-tight">{titleCase(b.branch)}</h3>
        </div>
        {showProvince && <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{b.province}</span>}
      </div>

      <dl className="mt-5 flex-1 space-y-2.5 text-sm">
        {b.address && (
          <div className="flex gap-3">
            <dt className="sr-only">Address</dt>
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <dd>{b.address}</dd>
          </div>
        )}
        {b.manager && (
          <div className="flex gap-3">
            <dt className="sr-only">Manager</dt>
            <User className="mt-0.5 size-4 shrink-0 text-primary" />
            <dd>
              {b.manager} <span className="text-muted-foreground">· Manager</span>
            </dd>
          </div>
        )}
        {(mobiles.length > 0 || lands.length > 0) && (
          <div className="flex gap-3">
            <dt className="sr-only">Phone</dt>
            <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
            <dd className="flex flex-wrap gap-x-3 gap-y-1">
              {mobiles.map((p) => <PhoneItem key={"m" + p.label} p={p} tag="Mobile" />)}
              {lands.map((p) => <PhoneItem key={"l" + p.label} p={p} tag="Landline" />)}
            </dd>
          </div>
        )}
        {b.email && (
          <div className="flex gap-3">
            <dt className="sr-only">Email</dt>
            <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
            <dd className="min-w-0">
              <a href={`mailto:${b.email}`} className="break-all hover:text-primary hover:underline">{b.email}</a>
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-6 flex gap-2">
        {firstDial?.href && (
          <a href={firstDial.href} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
            <Phone className="size-4" /> Call
          </a>
        )}
        <a href={directionsUrl(b)} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary">
          <Navigation className="size-4" /> Directions
        </a>
      </div>
    </article>
  );
}

function PhoneItem({ p, tag }: { p: { label: string; href: string | null }; tag: string }) {
  return p.href ? (
    <a href={p.href} className="hover:text-primary hover:underline" title={tag}>
      {p.label} <span className="text-xs text-muted-foreground">({tag})</span>
    </a>
  ) : (
    <span title={tag}>
      {p.label} <span className="text-xs text-muted-foreground">({tag})</span>
    </span>
  );
}
