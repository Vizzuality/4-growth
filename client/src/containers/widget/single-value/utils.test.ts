import { describe, expect, it } from "vitest";

import { barWidthPercentage } from "@/containers/widget/single-value/utils";

describe("barWidthPercentage", () => {
  it("fills the bar when the figure covers the whole dataset", () => {
    expect(barWidthPercentage(1266, 1266)).toBe(100);
  });

  it("measures the figure against the dataset it is a part of", () => {
    expect(barWidthPercentage(353, 1266)).toBeCloseTo((353 / 1266) * 100);
  });

  it("returns 0 rather than NaN when there is no data to measure against", () => {
    expect(barWidthPercentage(0, 0)).toBe(0);
  });
});
