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

  it("should transform single country data correctly", () => {
    const input = [{ country: "USA", value: 75 }];
    expect(transformMapData(input)).toEqual({ USA: 4 });
  });

  it("should transform multiple countries data correctly", () => {
    const input = [
      { country: "BEL", value: 85 },
      { country: "NED", value: 45 },
      { country: "ESP", value: 15 },
    ];
    expect(transformMapData(input)).toEqual({
      BEL: 5,
      NED: 3,
      ESP: 1,
    });
  });

  it("should handle boundary values correctly", () => {
    const input = [
      { country: "A", value: 0 },
      { country: "B", value: 20 },
      { country: "C", value: 40 },
      { country: "D", value: 60 },
      { country: "E", value: 80 },
      { country: "F", value: 100 },
    ];
    expect(transformMapData(input)).toEqual({
      A: 1,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
    });
  });
});
