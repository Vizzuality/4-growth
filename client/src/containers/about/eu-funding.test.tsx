import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EUFunding from "@/containers/about/eu-funding";

describe("EUFunding", () => {
  it("states the grant agreement number and shows the EU emblem", () => {
    render(<EUFunding />);

    expect(
      screen.getByText(/grant agreement No\. 101134855\./),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Funded by the European Union" }),
    ).toBeInTheDocument();
  });
});
