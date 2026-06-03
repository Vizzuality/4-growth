import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("lowercases words and joins them with hyphens", () => {
    expect(slugify("Adoption & Impact")).toBe("adoption-impact");
  });

  it("strips diacritics to ASCII", () => {
    expect(slugify("Pingüino Señor")).toBe("pinguino-senor");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  Hello!  ")).toBe("hello");
  });

  it("returns an empty string when there are no alphanumeric characters", () => {
    expect(slugify("!!!")).toBe("");
  });
});
