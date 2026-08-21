import { describe, expect, it } from "vitest";

import {
  compareAnswerLabels,
  getSemanticAnswerCssColor,
  getSemanticAnswerTwColor,
} from "@/lib/constants";

const sorted = (labels: string[]) => [...labels].sort(compareAnswerLabels);

describe("compareAnswerLabels", () => {
  it("moves a pinned label to the end regardless of alphabet", () => {
    expect(sorted(["Agriculture", "Both", "Forestry"])).toEqual([
      "Agriculture",
      "Forestry",
      "Both",
    ]);
  });

  it("leaves unpinned labels in the order they arrived", () => {
    expect(sorted(["Zebra", "Apple", "Mango"])).toEqual([
      "Zebra",
      "Apple",
      "Mango",
    ]);
  });

  it("orders multiple pinned labels by their position in the pinned list", () => {
    expect(sorted(["Others", "Other", "Apple", "Both"])).toEqual([
      "Apple",
      "Both",
      "Other",
      "Others",
    ]);
  });
});

describe("getSemanticAnswerCssColor", () => {
  const MAP_INDICATOR = "adoption-of-technology-by-country";

  it("gives Yes and Don't know different colours on an allowlisted indicator", () => {
    const yes = getSemanticAnswerCssColor(MAP_INDICATOR, "Yes");
    const dontKnow = getSemanticAnswerCssColor(MAP_INDICATOR, "Don't know");

    expect(yes).toBe("hsl(var(--accent))");
    expect(dontKnow).toBe("hsl(var(--muted-foreground))");
  });

  it("treats 'Not at all' as the negative answer", () => {
    expect(getSemanticAnswerCssColor(MAP_INDICATOR, "Not at all")).toBe(
      "hsl(var(--secondary))",
    );
  });

  it("returns undefined off the allowlist so callers keep their own colours", () => {
    expect(
      getSemanticAnswerCssColor("energy-efficiency", "Yes"),
    ).toBeUndefined();
    expect(getSemanticAnswerCssColor(undefined, "Yes")).toBeUndefined();
  });

  it("returns undefined for a label outside the yes/no scale", () => {
    expect(
      getSemanticAnswerCssColor(MAP_INDICATOR, "Forestry"),
    ).toBeUndefined();
  });

  it("keeps the Tailwind palette in step with the CSS one", () => {
    expect(getSemanticAnswerTwColor(MAP_INDICATOR, "Yes")).toBe("bg-accent");
    expect(getSemanticAnswerTwColor(MAP_INDICATOR, "Don't know")).toBe(
      "bg-muted-foreground",
    );
  });
});
