import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";
import heroCattle from "@/assets/hero-cattle.jpg";
import heroCattleTall from "@/assets/hero-cattle-tall.jpg";
import poultryImg from "@/assets/poultry.jpg";
import cropsImg from "@/assets/crops.jpg";
import grainImg from "@/assets/grain.jpg";
import hygieneImg from "@/assets/hygiene.jpg";
import vetImg from "@/assets/vet.jpg";
import dairyCattleImg from "@/assets/dairy-cattle.jpg";
import pigsImg from "@/assets/pigs.jpg";
import sheepGoatsImg from "@/assets/sheep-goats.jpg";
import companionAnimalsImg from "@/assets/companion-animals.jpg";
import fishImg from "@/assets/fish.jpg";
import poultryWideImg from "@/assets/poultry-wide.jpg";
import pigsWideImg from "@/assets/pigs-wide.jpg";
import sheepGoatsWideImg from "@/assets/sheep-goats-wide.jpg";
import companionAnimalsWideImg from "@/assets/companion-animals-wide.jpg";
import fishWideImg from "@/assets/fish-wide.jpg";

export type Product = {
  slug: string;
  title: string;
  cats: string[];
  image: string | null;
  html: string;
};

export type CategoryNode = {
  slug: string;
  title: string;
  parent: string | null;
  intro?: string[];
  children?: string[];
  products?: string[];
};

export const products = productsData as Product[];
export const categories = categoriesData as CategoryNode[];

const productMap = new Map(products.map((p) => [p.slug, p]));
const categoryMap = new Map(categories.map((c) => [c.slug, c]));

export const getProduct = (slug: string) => productMap.get(slug);
export const getCategory = (slug: string) => categoryMap.get(slug);

export const topSections = categories.filter((c) => c.parent === null);

export function getChildren(node: CategoryNode): CategoryNode[] {
  return (node.children ?? []).map((s) => categoryMap.get(s)).filter(Boolean) as CategoryNode[];
}

export function getProductsFor(node: CategoryNode): Product[] {
  return (node.products ?? []).map((s) => productMap.get(s)).filter(Boolean) as Product[];
}

export function getTrail(node: CategoryNode): CategoryNode[] {
  const trail: CategoryNode[] = [];
  let cur: CategoryNode | undefined = node;
  while (cur) {
    trail.unshift(cur);
    cur = cur.parent ? categoryMap.get(cur.parent) : undefined;
  }
  return trail;
}

/** All categories (leaf pages) that list this product. */
export function getCategoriesForProduct(slug: string): CategoryNode[] {
  return categories.filter((c) => c.products?.includes(slug));
}

/** Count of distinct products beneath a category. */
export function countProducts(node: CategoryNode): number {
  const set = new Set<string>();
  const walk = (n: CategoryNode) => {
    n.products?.forEach((p) => set.add(p));
    getChildren(n).forEach(walk);
  };
  walk(node);
  return set.size;
}

const sectionImages: Record<string, string> = {
  "animal-health": vetImg,
  "beef-cattle": heroCattleTall,
  "dairy-cattle": dairyCattleImg,
  poultry: poultryImg,
  pigs: pigsImg,
  "sheep-goats": sheepGoatsImg,
  "companion-animals": companionAnimalsImg,
  fish: fishImg,
  "pest-control": hygieneImg,
  "crop-chemicals": cropsImg,
  "disinfectants-detergents": hygieneImg,
  "grain-protection": grainImg,
};

export function imageFor(node: CategoryNode, allowProduct = true): string {
  const own = sectionImages[node.slug];
  if (own) return own;
  if (!allowProduct) return node.parent ? imageFor(getCategory(node.parent)!, false) : heroCattle;
  const first = getProductsFor(node).find((p) => p.image) ?? getChildren(node).flatMap(getProductsFor).find((p) => p.image);
  if (first?.image) return first.image;
  return node.parent ? imageFor(getCategory(node.parent)!, false) : heroCattle;
}

/**
 * Wide banner variant for the PageHero strip. Banners crop a 4:3 image to a
 * narrow horizontal band, so animal photos need a wide, vertically centered
 * composition; falls back to the card image otherwise.
 */
const bannerImages: Record<string, string> = {
  "beef-cattle": heroCattle,
  "dairy-cattle": dairyCattleImg,
  poultry: poultryWideImg,
  pigs: pigsWideImg,
  "sheep-goats": sheepGoatsWideImg,
  "companion-animals": companionAnimalsWideImg,
  fish: fishWideImg,
};

export function bannerFor(node: CategoryNode): string {
  const own = bannerImages[node.slug];
  if (own) return own;
  if (node.parent) {
    const parent = getCategory(node.parent);
    const parentBanner = parent ? bannerImages[parent.slug] : undefined;
    if (parentBanner) return parentBanner;
  }
  return imageFor(node, false);
}

/** Plain-text excerpt from the product's first description paragraph. */
export function excerpt(p: Product, max = 120): string {
  const m = p.html.match(/<p>(.*?)<\/p>/);
  const text = (m?.[1] ?? "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

export { heroCattle, heroCattleTall, poultryImg, cropsImg, grainImg, hygieneImg, vetImg };
