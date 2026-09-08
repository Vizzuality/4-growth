import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Legend from "@/containers/bottom-bar/data-source-legend/legend";

describe("DataSourceLegend", () => {
  it("explains the hatching only while two sources are compared", () => {
    render(<Legend values={["survey", "automated"]} />);

    expect(screen.getByText("Data is", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Survey")).toBeInTheDocument();
    expect(screen.getByText("Automated")).toBeInTheDocument();
  });

  it("stays out of the way when a single source leaves nothing to distinguish", () => {
    const { container } = render(<Legend values={["survey"]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
