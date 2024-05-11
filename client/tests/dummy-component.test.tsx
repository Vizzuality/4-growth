// DummyComponent.test.tsx
import React from "react";

import { render, screen } from "@testing-library/react";

import DummyComponent from "./dummy-component";

describe("DummyComponent", () => {
  it("renders the passed message", () => {
    const testMessage = "Hello, testing world!";
    render(<DummyComponent message={testMessage} />);
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it("renders the default message when no message is passed", () => {
    render(<DummyComponent />);
    expect(screen.getByText("No message provided")).toBeInTheDocument();
  });
});
