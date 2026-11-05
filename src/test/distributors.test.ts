import { describe, expect, it } from "vitest";
import { branches, contactProvince, phoneLinks, provinces, regionalManagers, regionalManagersForProvince, searchBranches } from "@/lib/distributors";

describe("distributor data", () => {
  it("includes all 96 branches from the October 2026 list", () => {
    expect(branches).toHaveLength(96);
  });

  it("filters by province", () => {
    const byo = searchBranches(branches, "", "Bulawayo");
    expect(byo.map((b) => b.branch).sort()).toEqual(["BULAWAYO 10TH", "BULAWAYO FIFE STREET", "BULAWAYO LOBENGULA"]);
    expect(provinces).toContain("Manicaland");
  });

  it("finds Harare stores nationwide without including them in Mashonaland Central", () => {
    expect(searchBranches(branches, "harare", "Mashonaland Central")).toEqual([]);
    const results = searchBranches(branches, "harare", null);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((branch) => branch.province === "Harare")).toBe(true);
    expect(searchBranches(branches, "  HARARE  ", null)).toEqual(results);
  });

  it("splits combined mobile numbers into dialable links", () => {
    expect(phoneLinks("0771166684/0779476442").map((p) => p.href)).toEqual(["tel:+263771166684", "tel:+263779476442"]);
  });

  it("does not make extensions dialable", () => {
    expect(phoneLinks("EXT 218/219")[0]?.href).toBeNull();
  });
});

describe("regional sales contacts", () => {
  it.each([
    ["Key Accounts Northern Region", "Beauty Mafuta", "077 225 3905", "beautym@ecomed.co.zw"],
    ["Key Accounts Southern Region", "Appolonia Magwala", "077 841 6226", "amagwala@ecogrp.co.zw"],
    ["Manicaland", "Dr. Tatenda Mageja", "077 857 4945", "mageja@ecomed.co.zw"],
    ["Mashonaland West", "Tatenda Masarurwa", "077 461 3773", "tatendam@ecomed.co.zw"],
    ["Mashonaland East", "Harry Shumba", "071 573 9840", "harrys@ecomed.co.zw"],
    ["Mashonaland Central", "Vanessa Mandere", "077 654 7631", "vanessam@ecomed.co.zw"],
    ["Masvingo", "Nichol Munyukwi", "078 666 3875", "nicholm@ecomed.co.zw"],
    ["Matabeleland", "Nathaniel Mukova", "077 268 1602", "nathanielm@ecogrp.co.zw"],
    ["Midlands", "Joseph Magwangwa", "077 275 7072", "josephm@ecomed.co.zw"],
  ])("preserves the supplied contact for %s", (region, name, phone, email) => {
    expect(regionalManagers.find((manager) => manager.region === region)).toMatchObject({ name, phone, email });
    expect(phoneLinks(phone)[0]?.href).toBe(`tel:+263${phone.replace(/\s/g, "").slice(1)}`);
  });

  it.each([
    ["Manicaland", "Dr. Tatenda Mageja"],
    ["Mashonaland West", "Tatenda Masarurwa"],
    ["Mashonaland East", "Harry Shumba"],
    ["Mashonaland Central", "Vanessa Mandere"],
    ["Masvingo", "Nichol Munyukwi"],
    ["Matabeleland North", "Nathaniel Mukova"],
    ["Matabeleland South", "Nathaniel Mukova"],
    ["Midlands", "Joseph Magwangwa"],
  ])("shows only the assigned manager for %s", (province, name) => {
    expect(regionalManagersForProvince(province).map((manager) => manager.name)).toEqual([name]);
  });

  it.each(["Harare", "Bulawayo"])("does not invent coverage for %s", (province) => {
    expect(regionalManagersForProvince(province)).toEqual([]);
  });

  it("uses the province of a uniquely matched town", () => {
    const results = searchBranches(branches, "Mutare", null);
    expect(results.length).toBeGreaterThan(0);
    expect(contactProvince(null, "Mutare", results)).toBe("Manicaland");
  });

  it("does not infer an area from empty or nationwide results", () => {
    expect(contactProvince(null, "", branches)).toBeNull();
    expect(contactProvince(null, "Farm", branches)).toBeNull();
    expect(contactProvince(null, "unknown", [])).toBeNull();
  });
});
