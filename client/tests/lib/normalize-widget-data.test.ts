import {
  getResponseRate,
  normalizeWidgetData,
} from "@/lib/normalize-widget-data";
import { WidgetData } from "@shared/dto/widgets/base-widget-data.interface";

describe("normalizeWidgetData", () => {
  it("should transform map values to percentages", () => {
    const input: WidgetData = {
      map: [
        { country: "Spain", value: 207 },
        { country: "France", value: 169 },
        { country: "Netherlands", value: 88 },
        { country: "Belgium", value: 11 },
      ],
    };

    const result = normalizeWidgetData(input);

    expect(result.map).toEqual([
      { country: "Spain", value: 44 },
      { country: "France", value: 36 },
      { country: "Netherlands", value: 19 },
      { country: "Belgium", value: 2 },
    ]);
  });

  it("should transform chart values to percentages", () => {
    const input: WidgetData = {
      chart: [
        { label: "A", value: 40, total: 120 },
        { label: "B", value: 30, total: 120 },
        { label: "C", value: 50, total: 120 },
      ],
    };

    const result = normalizeWidgetData(input);

    expect(result.chart).toEqual([
      { label: "A", value: 33, total: 120 },
      { label: "B", value: 25, total: 120 },
      { label: "C", value: 42, total: 120 },
    ]);
  });

  it("should filter out N/A entries", () => {
    const input: WidgetData = {
      chart: [
        { label: "A", value: 40, total: 100 },
        { label: "N/A", value: 20, total: 100 },
        { label: "B", value: 40, total: 100 },
      ],
    };

    const result = normalizeWidgetData(input);

    expect(result.chart).toHaveLength(2);
    expect(result.chart?.find((item) => item.label === "N/A")).toBeUndefined();
  });

  it("should not modify counter data", () => {
    const input: WidgetData = {
      counter: { value: 10, total: 20 },
    };

    const result = normalizeWidgetData(input);

    expect(result.counter).toEqual({ value: 10, total: 20 });
  });

  it("should round a share below 1% to 2 decimals", () => {
    const input: WidgetData = {
      chart: [
        { label: "Yes", value: 1, total: 240 },
        { label: "No", value: 239, total: 240 },
      ],
    };

    const result = normalizeWidgetData(input);

    expect(result.chart?.[0].value).toBe(0.42);
  });

  it("should normalize each source against its own total", () => {
    const input: WidgetData = {
      bySource: [
        {
          source: "survey",
          data: { chart: [{ label: "Yes", value: 1, total: 240 }] },
        },
        {
          source: "automated",
          data: { chart: [{ label: "Yes", value: 3, total: 8 }] },
        },
      ],
    };

    const result = normalizeWidgetData(input);

    expect(result.bySource?.[0].data.chart?.[0].value).toBe(100);
    expect(result.bySource?.[1].data.chart?.[0].value).toBe(100);
  });
});

describe("getResponseRate", () => {
  it("should calculate response rate correctly", () => {
    const data: WidgetData = {
      chart: [
        { label: "A", value: 40, total: 100 },
        { label: "B", value: 30, total: 100 },
        { label: "N/A", value: 30, total: 100 },
      ],
    };

    const result = getResponseRate(data);

    expect(result).toBe(70);
  });

  it("should return 0 when chart data is empty", () => {
    const data: WidgetData = {
      chart: [],
    };

    const result = getResponseRate(data);

    expect(result).toBe(0);
  });

  it("should handle case when N/A is not present", () => {
    const data: WidgetData = {
      chart: [
        { label: "A", value: 60, total: 100 },
        { label: "B", value: 40, total: 100 },
      ],
    };

    const result = getResponseRate(data);

    expect(result).toBe(100);
  });

  it("should handle case when only N/A is present", () => {
    const data: WidgetData = {
      chart: [{ label: "N/A", value: 50, total: 50 }],
    };

    const result = getResponseRate(data);

    expect(result).toBe(0);
  });
});
