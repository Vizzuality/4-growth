import { render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it, vi } from "vitest";

import FiltersSheet from "@/containers/bottom-bar/filters-sheet";

vi.mock("next/navigation", () => ({
  usePathname: () => "/survey-analysis",
}));

function renderSheet(props: { disabled?: boolean } = {}) {
  return render(
    <NuqsTestingAdapter>
      <Provider store={createStore()}>
        <FiltersSheet {...props}>
          <div />
        </FiltersSheet>
      </Provider>
    </NuqsTestingAdapter>,
  );
}

describe("FiltersSheet", () => {
  it("leaves the trigger enabled when no gate is passed", () => {
    renderSheet();

    expect(screen.getByRole("button", { name: "Filters" })).toBeEnabled();
  });

  it("disables the trigger when the caller gates it", () => {
    renderSheet({ disabled: true });

    expect(screen.getByRole("button", { name: "Filters" })).toBeDisabled();
  });
});
