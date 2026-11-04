import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Navigation, Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { heroCattle } from "@/lib/catalog";
import { offices } from "@/lib/company";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Shumba Coopers" },
      { name: "description", content: "Shumba Coopers offices in Harare (29 Anthony Avenue Msasa) and Bulawayo (10 Falcon Street Belmont)." },
      { property: "og:title", content: "Contact Shumba Coopers" },
      { property: "og:description", content: "Call or visit our Harare and Bulawayo offices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHero title="Contact Us" image={heroCattle} crumbs={[{ label: "Contact Us" }]} />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 md:grid-cols-2">
        {offices.map((o) => (
          <div key={o.city} className="rounded-3xl border bg-card p-8 shadow-soft">
            <h2 className="text-3xl font-extrabold">{o.city}</h2>
            <p className="mt-5 flex gap-3 text-lg">
              <MapPin className="mt-1 size-5 shrink-0 text-primary" />
              <span>{o.address.join(" ")}</span>
            </p>
            <div className="mt-4 space-y-2">
              {o.phones.map((p) => (
                <a key={p.label} href={p.href} className="flex items-center gap-3 text-lg hover:text-primary">
                  <Phone className="size-5 text-primary" /> {p.label}
                </a>
              ))}
            </div>
            <a href={o.maps} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
              <Navigation className="size-4" /> Directions
            </a>
          </div>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-forest-gradient p-8 text-forest-foreground md:col-span-2">
          <p className="font-display text-2xl font-bold">Looking for a store near you?</p>
          <Link to="/find-a-distributor" className="inline-flex items-center gap-2 rounded-full bg-sun px-6 py-3 font-semibold text-sun-foreground">
            <MapPin className="size-4" /> Find a Distributor
          </Link>
        </div>
      </div>
    </>
  );
}
