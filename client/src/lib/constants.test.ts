import { describe, expect, it } from "vitest";

import { compareAnswerLabels } from "@/lib/constants";

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
