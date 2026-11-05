import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import cattleHerd from "@/assets/slide-cattle-herd.jpg";
import cowGrass from "@/assets/slide-cow-grass.jpg";
import farmerMaize from "@/assets/slide-farmer-maize.jpg";
import maizeField from "@/assets/slide-maize-field.jpg";

type Slide = { img: string; alt: string; tone: "red" | "sun"; lead?: string; strong: string; tail?: string; sub: string };

// Wording taken from the live shumbacoopers.co.zw slider.
const slides: Slide[] = [
  { img: cowGrass, alt: "Cow standing in green pasture", tone: "red", lead: "Promoting", strong: "Healthy Livestock", sub: "for Zimbabwean farmers since 1913" },
  { img: cattleHerd, alt: "Herd of tagged beef cattle in a pen", tone: "red", strong: "Trusted Animal Health Products", sub: "for everything from cattle and pigs to horses and fish" },
  { img: farmerMaize, alt: "Farmer smiling in a maize field", tone: "sun", lead: "Improving", strong: "Food Security", tail: "in Zimbabwe", sub: "with safe and effective products and solutions for better grain protection, crop and animal production" },
  { img: maizeField, alt: "Green maize field at sunset", tone: "sun", lead: "Herbicides, pesticides, insecticides and fungicides", strong: "Tried and Tested", sub: "in Zimbabwean conditions" },
];

export function HeroSlider({ aside }: { aside: ReactNode }) {
  const [i, setI] = useState(0);
  // Auto-advance every 5s; restarts the timer after a manual pick.
  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), 5000);
    return () => clearTimeout(t);
  }, [i]);
  const go = (d: number) => setI((n) => (n + d + slides.length) % slides.length);

  return (
    <section
      className="relative isolate overflow-hidden bg-forest text-forest-foreground"
      aria-roledescription="carousel"
    >
      {slides.map((s, n) => (
        <img
          key={s.img}
          src={s.img}
          alt={n === i ? s.alt : ""}
          aria-hidden={n !== i}
          width={1792}
          height={768}
          className={`absolute inset-0 -z-20 size-full object-cover object-[35%_center] transition-opacity duration-1000 ${n === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="bg-hero-overlay absolute inset-0 -z-10" aria-hidden />

      <div className="mx-auto grid min-h-[640px] max-w-7xl items-end gap-8 px-4 pb-20 pt-16 sm:px-6 lg:h-[min(82vh,720px)] lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="relative min-h-80 self-stretch">
          {slides.map((s, n) => (
            <div
              key={s.strong}
              aria-hidden={n !== i}
              className={`absolute inset-x-0 top-1/2 -translate-y-1/2 transition-all duration-700 ${n === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              {s.lead && <p className="font-display text-2xl font-bold md:text-4xl">{s.lead}</p>}
              <h2 className="text-5xl font-extrabold leading-[0.98] text-sun md:text-7xl">{s.strong}</h2>
              {s.tail && <p className="font-display text-2xl font-bold md:text-4xl">{s.tail}</p>}
              <p className="mt-6 max-w-xl text-lg text-forest-foreground/85">{s.sub}</p>
            </div>
          ))}
        </div>
        {aside}
      </div>

      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
        <button onClick={() => go(-1)} aria-label="Previous slide" className="glass-dark rounded-full p-2 hover:text-sun"><ChevronLeft className="size-5" /></button>
        {slides.map((s, n) => (
          <button
            key={s.strong}
            onClick={() => setI(n)}
            aria-label={`Show slide ${n + 1}`}
            aria-current={n === i}
            className={`h-2.5 rounded-full transition-all ${n === i ? "w-8 bg-sun" : "w-2.5 bg-forest-foreground/60 hover:bg-forest-foreground"}`}
          />
        ))}
        <button onClick={() => go(1)} aria-label="Next slide" className="glass-dark rounded-full p-2 hover:text-sun"><ChevronRight className="size-5" /></button>
      </div>
    </section>
  );
}
