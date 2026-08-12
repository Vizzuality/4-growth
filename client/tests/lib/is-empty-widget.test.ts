import { describe, expect, it } from "vitest";

import { isEmptyWidget } from "@/lib/utils";

describe("isEmptyWidget", () => {
  it("treats a chart whose only answers are N/A as empty", () => {
    expect(
      isEmptyWidget({ chart: [{ label: "N/A", value: 13, total: 13 }] }),
    ).toBe(true);
  });

  it("treats a chart with one real answer among N/A as not empty", () => {
    expect(
      isEmptyWidget({
        chart: [
          { label: "N/A", value: 121, total: 122 },
          { label: "Other namely", value: 1, total: 122 },
        ],
      }),
    ).toBe(false);
  });
});
