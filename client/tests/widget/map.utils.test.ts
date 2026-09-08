import {
  getScaleFromPercentage,
  transformMapData,
} from "@/containers/widget/map/map.utils";
import { describe, it, expect } from "vitest";

describe("getScaleFromPercentage", () => {
  it("should return 1 for percentages <= 20", () => {
    expect(getScaleFromPercentage(0)).toBe(1);
    expect(getScaleFromPercentage(10)).toBe(1);
    expect(getScaleFromPercentage(20)).toBe(1);
  });

  it("should return 2 for percentages between 21 and 40", () => {
    expect(getScaleFromPercentage(21)).toBe(2);
    expect(getScaleFromPercentage(30)).toBe(2);
    expect(getScaleFromPercentage(40)).toBe(2);
  });

  it("should return 3 for percentages between 41 and 60", () => {
    expect(getScaleFromPercentage(41)).toBe(3);
    expect(getScaleFromPercentage(50)).toBe(3);
    expect(getScaleFromPercentage(60)).toBe(3);
  });

  it("should return 4 for percentages between 61 and 80", () => {
    expect(getScaleFromPercentage(61)).toBe(4);
    expect(getScaleFromPercentage(70)).toBe(4);
    expect(getScaleFromPercentage(80)).toBe(4);
  });

  it("should return 5 for percentages > 80", () => {
    expect(getScaleFromPercentage(81)).toBe(5);
    expect(getScaleFromPercentage(90)).toBe(5);
    expect(getScaleFromPercentage(100)).toBe(5);
  });
});

describe("transformMapData", () => {
  it("should transform empty array to empty object", () => {
    expect(transformMapData([])).toEqual({});
  });

  it("should key the scale and both counts by ISO3", () => {
    const input = [{ country: "USA", value: 75, count: 30, total: 40 }];

    expect(transformMapData(input)).toEqual({
      USA: { scale: 4, value: 75, count: 30, total: 40 },
    });
  });

  it("should keep each country's counts with its own scale", () => {
    const input = [
      { country: "BEL", value: 85, count: 17, total: 20 },
      { country: "NED", value: 45, count: 9, total: 20 },
      { country: "ESP", value: 15, count: 3, total: 20 },
    ];

    expect(transformMapData(input)).toEqual({
      BEL: { scale: 5, value: 85, count: 17, total: 20 },
      NED: { scale: 3, value: 45, count: 9, total: 20 },
      ESP: { scale: 1, value: 15, count: 3, total: 20 },
    });
  });

  it("should keep null counts null for a country with no answers", () => {
    const input = [{ country: "SRB", value: null, count: null, total: null }];

    expect(transformMapData(input as never)).toEqual({
      SRB: { scale: 0, value: null, count: null, total: null },
    });
  });

  it("should coerce the numeric percentage Postgres returns as a string", () => {
    const input = [{ country: "FIN", value: "31.7", count: 55, total: 173 }];

    expect(transformMapData(input as never)).toEqual({
      FIN: { scale: 2, value: 31.7, count: 55, total: 173 },
    });
  });
});
