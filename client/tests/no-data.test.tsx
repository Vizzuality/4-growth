import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NoData from "@/containers/no-data";

describe("NoData", () => {
  it("renders the correct content", () => {
    render(<NoData />);

    expect(screen.getByText("No data")).toBeInTheDocument();
    expect(
      screen.getByText("There was no data found for this visualization"),
    ).toBeInTheDocument();
  });
});
