import { describe, expect, it } from "vitest";

import { getPercentLabelInset } from "@/containers/widget/utils";

describe("getPercentLabelInset", () => {
  const spacing = { inset: 24, gap: 8 };

  it("reserves more room for a two-decimal value than for a whole one", () => {
    expect(getPercentLabelInset(["0.28"], spacing)).toBeGreaterThan(
      getPercentLabelInset(["100"], spacing),
    );
  });

  it("sizes the column to the widest value, not the first", () => {
    expect(getPercentLabelInset(["99.99", "1"], spacing)).toBe(
      getPercentLabelInset(["99.99"], spacing),
    );
  });
});
