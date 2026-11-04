import { createFileRoute, Link } from "@tanstack/react-router";
import { Microscope, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { vetImg } from "@/lib/catalog";
import { technicalServices } from "@/lib/company";

export const Route = createFileRoute("/technical-services")({
  head: () => ({
    meta: [
      { title: "Technical Services — Shumba Coopers" },
      { name: "description", content: technicalServices[0] },
      { property: "og:title", content: "Technical Services — Shumba Coopers" },
      { property: "og:description", content: technicalServices[0] },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tech,
});

const icons = [Users, Stethoscope, Microscope, ShieldCheck];

function Tech() {
  const [lead, ...rest] = technicalServices;
  return (
    <>
      <PageHero title="Technical Services" image={vetImg} crumbs={[{ label: "Products", to: "/products" }, { label: "Animal Health", to: "/category/$slug", params: { slug: "animal-health" } }, { label: "Technical Services" }]}>
        <p>{lead}</p>
      </PageHero>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-20 sm:px-6 md:grid-cols-3">
        {rest.map((p, i) => {
          const Icon = icons[i + 1] ?? Users;
          return (
            <div key={p} className="rounded-3xl border bg-card p-7 shadow-soft">
              <span className="grid size-12 place-items-center rounded-2xl bg-sun-gradient text-sun-foreground">
                <Icon className="size-6" />
              </span>
              <p className="mt-5 text-muted-foreground">{p}</p>
            </div>
          );
        })}
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Link to="/contact" className="inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Contact Us</Link>
      </div>
    </>
  );
}
