import branchesData from "@/data/branches.json";

export type Branch = {
  id: number;
  branch: string;
  landline: string;
  mobile: string;
  address: string;
  email: string;
  manager: string;
  province: string;
};

export const branches = branchesData as Branch[];

export const provinces = Array.from(new Set(branches.map((b) => b.province))).sort();

/** Turn "BULAWAYO FIFE STREET" into "Bulawayo Fife Street", keeping H/W etc. readable. */
export function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/(^|[\s\-/(.'])([a-z])/g, (_, a, b) => a + b.toUpperCase())
    .replace(/\bH\/W\b/gi, "H/W");
}

export type PhoneLink = { label: string; href: string | null };

/**
 * Split a phone field ("0771166684/0779476442") into separately dialable numbers.
 * Extensions and short internal numbers are shown but not dialable.
 */
export function phoneLinks(raw: string): PhoneLink[] {
  if (!raw) return [];
  if (/ext/i.test(raw)) return [{ label: raw, href: null }];
  const parts = raw.split("/").map((p) => p.trim()).filter(Boolean);
  const first = parts[0]?.replace(/\D/g, "") ?? "";
  return parts.map((part) => {
    let digits = part.replace(/\D/g, "");
    // "0242752735/3235" — trailing short part shares the first number's prefix
    if (digits.length < 7 && first.length >= 9 && part !== parts[0]) {
      digits = first.slice(0, first.length - digits.length) + digits;
    }
    if (digits.length < 7) return { label: part, href: null };
    if (!digits.startsWith("0")) digits = "0" + digits;
    return { label: part, href: `tel:+263${digits.slice(1)}` };
  });
}

export function directionsUrl(b: Branch): string {
  const q = `${b.address}, ${titleCase(b.branch)}, Zimbabwe`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function searchBranches(list: Branch[], query: string, province: string | null): Branch[] {
  const q = query.trim().toLowerCase();
  return list.filter((b) => {
    if (province && b.province !== province) return false;
    if (!q) return true;
    return [b.branch, b.address, b.manager, b.province, b.email].some((f) => f.toLowerCase().includes(q));
  });
}
