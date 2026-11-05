import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, Mail, MapPin, Navigation, Phone, Search, Store, User, X } from "lucide-react";
import { heroCattle } from "@/lib/catalog";
import { branches, contactProvince, directionsUrl, phoneLinks, provinces, regionalManagersForProvince, searchBranches, titleCase, type Branch } from "@/lib/distributors";

type Search = { province?: string; q?: string };

export const Route = createFileRoute("/find-a-distributor")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const out: Search = {};
    const p = s["province"];
    const q = s["q"];
    if (typeof p === "string" && provinces.includes(p)) out.province = p;
    if (typeof q === "string" && q) out.q = q;
    return out;
  },
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
    navigate({
      search: (prev) => {
        const next: Search = {};
        if (prev.q) next.q = prev.q;
        if (p) next.province = p;
        return next;
      },
      replace: true,
      resetScroll: false,
    });

  const results = useMemo(() => searchBranches(branches, q, province), [q, province]);
  const inProvince = province ? branches.filter((b) => b.province === province) : branches;
  const managers = new Set(inProvince.map((b) => b.manager)).size;
  const salesProvince = contactProvince(province, q, results);
  const salesContacts = salesProvince ? regionalManagersForProvince(salesProvince) : [];

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
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Side panel */}
          <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
            <div className="bg-forest-gradient relative overflow-hidden rounded-3xl p-7 text-forest-foreground shadow-lift">
              <div className="grain-dots absolute inset-0 opacity-30" aria-hidden />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-widest text-sun">Select your province</p>
                <div className="relative mt-3">
                  <select
                    value={province ?? ""}
                    onChange={(e) => setProvince(e.target.value || null)}
                    aria-label="Select province"
                    className="w-full appearance-none rounded-2xl border border-forest-foreground/25 bg-forest-foreground/10 px-4 py-3 pr-11 font-display text-base font-bold text-forest-foreground outline-none transition-colors hover:border-sun focus:border-sun [&>option]:bg-card [&>option]:text-card-foreground"
                  >
                    <option value="">All provinces ({branches.length} branches)</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p} ({branches.filter((b) => b.province === p).length} branches)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-sun" aria-hidden />
                </div>

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

                {salesProvince ? (
                  <>
                    <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-sun">Regional sales rep</p>
                    <p className="mt-2 text-sm text-forest-foreground/75">Covering {salesProvince}</p>
                    <div className="mt-3 space-y-3">
                      {salesContacts.map((manager) => (
                        <div key={manager.region} className="border-t border-forest-foreground/20 pt-4 text-sm">
                          <p className="mt-1 font-display text-lg font-bold">{manager.name}</p>
                          <a href={phoneLinks(manager.phone)[0]?.href ?? undefined} className="mt-3 flex items-center gap-2 hover:text-sun">
                            <Phone className="size-4 shrink-0" /> {manager.phone}
                          </a>
                          <a href={`mailto:${manager.email}`} className="mt-2 flex items-start gap-2 hover:text-sun">
                            <Mail className="mt-0.5 size-4 shrink-0" /> <span className="min-w-0 break-all">{manager.email}</span>
                          </a>
                        </div>
                      ))}
                      {salesContacts.length === 0 && (
                        <p className="text-sm text-forest-foreground/75">Regional manager assignment not yet confirmed for {salesProvince}.</p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="mt-7 text-sm text-forest-foreground/75">
                    Choose a province above to see the sales rep for that region.
                  </p>
                )}
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
