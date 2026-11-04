import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { heroCattle, poultryImg, vetImg } from "@/lib/catalog";
import { aboutCoopers, aboutShumba } from "@/lib/company";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Shumba Coopers" },
      { name: "description", content: "Coopers has served Zimbabwean livestock farmers since 1913; the Shumba Group has supported farmers since 1992." },
      { property: "og:title", content: "About Shumba Coopers" },
      { property: "og:description", content: "The story of Coopers animal health and the Shumba Group in Zimbabwe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  const blocks = [
    { title: "About Coopers", year: "1843", body: aboutCoopers, img: vetImg },
    { title: "About Shumba Group", year: "1992", body: aboutShumba, img: poultryImg },
  ];
  return (
    <>
      <PageHero title="About Us" image={heroCattle} crumbs={[{ label: "About Us" }]} />
      <div className="mx-auto max-w-7xl space-y-20 px-4 py-20 sm:px-6">
        {blocks.map((b, i) => (
          <section key={b.title} className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="relative">
              <img src={b.img} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
              <span className="glass absolute -bottom-6 left-6 rounded-2xl px-6 py-4 font-display text-4xl font-extrabold text-primary shadow-soft">{b.year}</span>
            </div>
            <div>
              <h2 className="text-4xl font-extrabold">{b.title}</h2>
              <div className="mt-6 space-y-4 text-lg text-muted-foreground">
                {b.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </section>
        ))}
        <div className="flex flex-wrap gap-3">
          <Link to="/products" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
            Explore Products <ArrowRight className="size-4" />
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-semibold">Contact Us</Link>
        </div>
      </div>
    </>
  );
}
