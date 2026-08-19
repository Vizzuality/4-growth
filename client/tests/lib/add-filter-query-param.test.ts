import { describe, it, expect } from "vitest";
import { addFilterQueryParam } from "@/lib/utils";
import { ADD_FILTER_MODE } from "@/lib/constants";
import type { FilterQueryParam } from "@/hooks/use-filters";

const existing: FilterQueryParam[] = [
  { name: "category", operator: "=", values: ["Agriculture"] },
  { name: "technology-type", operator: "=", values: ["Hardware"] },
];

describe("addFilterQueryParam", () => {
  it("removes an existing filter when the new one has empty values", () => {
    const result = addFilterQueryParam(existing, {
      name: "technology-type",
      operator: "=",
      values: [],
    });

    expect(result.find((f) => f.name === "technology-type")).toBeUndefined();
    expect(result.find((f) => f.name === "category")).toBeDefined();
  });

  it("returns unchanged list when removing a filter that was never set", () => {
    const result = addFilterQueryParam(existing, {
      name: "country",
      operator: "=",
      values: [],
    });

    expect(result).toEqual(existing);
  });

  it("adds a new filter in MERGE mode", () => {
    const result = addFilterQueryParam(
      [{ name: "category", operator: "=", values: ["Agriculture"] }],
      { name: "technology", operator: "=", values: ["Robotics"] },
      ADD_FILTER_MODE.MERGE,
    );

    expect(result).toHaveLength(2);
    expect(result.find((f) => f.name === "technology")?.values).toEqual([
      "Robotics",
    ]);
  });

  it("replaces an existing filter in REPLACE mode", () => {
    const result = addFilterQueryParam(
      existing,
      { name: "technology-type", operator: "=", values: ["Software"] },
      ADD_FILTER_MODE.REPLACE,
    );

    expect(result.find((f) => f.name === "technology-type")?.values).toEqual([
      "Software",
    ]);
  });
});
