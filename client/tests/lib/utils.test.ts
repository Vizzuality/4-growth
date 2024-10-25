import { normalizeWidgetData } from "@/lib/utils";
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

  it("should not modify counter data", () => {
    const input: WidgetData = {
      counter: { value: 10, total: 20 },
    };

    const result = normalizeWidgetData(input);

    expect(result.counter).toEqual({ value: 10, total: 20 });
  });
});
