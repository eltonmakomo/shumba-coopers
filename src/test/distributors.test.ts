import { describe, expect, it } from "vitest";
import { branches, phoneLinks, provinces, searchBranches } from "@/lib/distributors";

describe("distributor data", () => {
  it("includes all 96 branches from the October 2026 list", () => {
    expect(branches).toHaveLength(96);
  });

  it("filters by province", () => {
    const byo = searchBranches(branches, "", "Bulawayo");
    expect(byo.map((b) => b.branch).sort()).toEqual(["BULAWAYO 10TH", "BULAWAYO FIFE STREET", "BULAWAYO LOBENGULA"]);
    expect(provinces).toContain("Manicaland");
  });

  it("splits combined mobile numbers into dialable links", () => {
    expect(phoneLinks("0771166684/0779476442").map((p) => p.href)).toEqual(["tel:+263771166684", "tel:+263779476442"]);
  });

  it("does not make extensions dialable", () => {
    expect(phoneLinks("EXT 218/219")[0]?.href).toBeNull();
  });
});
