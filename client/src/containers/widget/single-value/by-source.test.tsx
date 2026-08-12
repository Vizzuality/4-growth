import { WidgetSourceSplit } from "@shared/dto/widgets/base-widget-data.interface";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SingleValueBySource from "@/containers/widget/single-value/by-source";

// The API hands every panel the same denominator — the whole two-source dataset
const split = (survey: number, automated: number): WidgetSourceSplit => {
  const total = survey + automated;

  return [
    { source: "survey", data: { counter: { value: survey, total } } },
    { source: "automated", data: { counter: { value: automated, total } } },
  ];
};

describe("SingleValueBySource", () => {
  it("names the source each figure belongs to, which the bars convey by fill alone", () => {
    render(
      <SingleValueBySource
        title="Total number of surveys"
        data={split(1266, 2055)}
      />,
    );

    expect(screen.getByText("Survey responses")).toBeInTheDocument();
    expect(screen.getByText("Automated web data")).toBeInTheDocument();
    expect(screen.getByText("1266")).toBeInTheDocument();
    expect(screen.getByText("2055")).toBeInTheDocument();
  });

  it("keeps an empty source visible instead of dropping its bar", () => {
    render(
      <SingleValueBySource
        title="Total number of countries"
        data={split(22, 0)}
      />,
    );

    expect(screen.getByText("Automated web data")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
