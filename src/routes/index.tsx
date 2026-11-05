import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Stethoscope } from "lucide-react";
import { CategoryCard } from "@/components/site/Cards";
import { HeroSlider } from "@/components/site/HeroSlider";
import { getCategory, getChildren, poultryImg, topSections, vetImg } from "@/lib/catalog";
import { aboutCoopers, aboutShumba } from "@/lib/company";
import { branches, provinces } from "@/lib/distributors";
import trustedLogo from "@/assets/logo-coopers-shumba.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shumba Coopers — Promoting Healthy Livestock Since 1913" },
      { name: "description", content: "Coopers animal health, pest control, crop chemicals, disinfectants and grain protection from Shumba Group Zimbabwe. Find your nearest distributor." },
      { property: "og:title", content: "Shumba Coopers — Promoting Healthy Livestock" },
      { property: "og:description", content: "Trusted animal health and farm products for Zimbabwean farmers. Find your nearest distributor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const animal = getCategory("animal-health")!;
  const species = getChildren(animal);
  const others = topSections.filter((s) => s.slug !== "animal-health");

  return (
    <>
      <h1 className="sr-only">Shumba Coopers — Promoting healthy livestock</h1>
      <HeroSlider
        aside={
          <div className="glass relative w-full rounded-3xl p-6 text-foreground shadow-lift animate-float-slow lg:ml-auto lg:w-2/3">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Find your distributor</p>
            <p className="mt-2 font-display text-2xl font-bold">{branches.length} stores across {provinces.length} provinces</p>
            <Link to="/find-a-distributor" className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5">
              <MapPin className="size-4" /> Find a Distributor
            </Link>
            <div className="mt-5 flex flex-wrap gap-2">
              {provinces.map((p) => (
                <Link key={p} to="/find-a-distributor" search={{ province: p }} className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary">
                  {p}
                </Link>
              ))}
            </div>
          </div>
        }
      />

      {/* Animal Health */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Animal Health</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-extrabold md:text-5xl">Solutions for every animal on your farm</h2>
          </div>
          <Link to="/category/$slug" params={{ slug: "animal-health" }} className="inline-flex items-center gap-2 font-semibold text-primary">
            All Animal Health <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {species.map((s, i) => (
            <div key={s.slug} className={i === 0 ? "h-full sm:col-span-2 lg:row-span-2" : "h-full"}>
              <CategoryCard node={s} large={i === 0} />
            </div>
          ))}
          <Link to="/technical-services" className="group relative isolate flex min-h-56 flex-col justify-end overflow-hidden rounded-3xl bg-sun-gradient p-6 text-sun-foreground shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
            <Stethoscope className="absolute right-5 top-5 size-10 opacity-70" />
            <h3 className="font-display text-lg font-bold">Technical Services</h3>
            <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold">Talk to our experts <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        </div>
      </section>

      {/* Distributor band */}
      <section className="bg-forest-gradient relative overflow-hidden text-forest-foreground">
        <div className="grain-dots absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-sun">Find Your Distributor</p>
            <h2 className="mt-3 text-4xl font-extrabold md:text-5xl">Shumba Coopers products, close to your farm</h2>
            <p className="mt-5 max-w-lg text-forest-foreground/80">
              Choose your province to see every Farm &amp; City Centre branch stocking our range — with direct phone, email and directions.
            </p>
            <Link to="/find-a-distributor" className="mt-8 inline-flex items-center gap-2 rounded-full bg-sun px-7 py-3.5 font-semibold text-sun-foreground transition-transform hover:-translate-y-0.5">
              <MapPin className="size-4" /> Open the Distributor Finder
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {provinces.map((p) => {
              const n = branches.filter((b) => b.province === p).length;
              return (
                <Link key={p} to="/find-a-distributor" search={{ province: p }} className="glass-dark group rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:bg-forest">
                  <p className="font-display text-3xl font-extrabold text-sun">{n}</p>
                  <p className="mt-1 text-sm text-forest-foreground/85 group-hover:text-forest-foreground">{p}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Other ranges */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Products</p>
        <h2 className="mt-3 text-4xl font-extrabold md:text-5xl">Trusted Shumba Quality</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((s) => (
            <CategoryCard key={s.slug} node={s} large />
          ))}
        </div>
      </section>

      {/* About */}
      <section className="bg-muted/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">About Us</p>
              <h2 className="mt-3 text-4xl font-extrabold md:text-5xl">Two trusted names, one purpose</h2>
            </div>
            <img src={trustedLogo} alt="Coopers and Shumba Group logos" className="h-16 w-auto" loading="lazy" />
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {[
              { title: "About Coopers", body: aboutCoopers, img: vetImg },
              { title: "About Shumba Group", body: aboutShumba, img: poultryImg },
            ].map((a) => (
              <article key={a.title} className="overflow-hidden rounded-3xl border bg-card shadow-soft">
                <img src={a.img} alt="" loading="lazy" className="h-56 w-full object-cover" />
                <div className="p-7">
                  <h3 className="text-2xl font-bold">{a.title}</h3>
                  <div className="mt-4 space-y-3 text-muted-foreground">
                    {a.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
