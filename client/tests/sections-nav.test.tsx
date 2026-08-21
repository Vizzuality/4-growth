import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import SectionsNav from "@/containers/sidebar/sections-nav";
import type { FilterQueryParam } from "@/hooks/use-filters";

const state = vi.hoisted(() => ({ filters: [] as FilterQueryParam[] }));

const RAW_SECTIONS = [
  {
    order: 1,
    slug: "overview",
    name: "Overview",
    baseWidgets: [
      {
        indicator: "total-surveys",
        data: { counter: { value: 0, total: 10 } },
      },
    ],
  },
  {
    order: 2,
    slug: "general-information",
    name: "General information",
    baseWidgets: [
      {
        indicator: "data-storage",
        data: { chart: [{ label: "Cloud", value: 20, total: 20 }] },
      },
    ],
  },
  {
    order: 3,
    slug: "technology-providers",
    name: "Technology providers",
    baseWidgets: [
      {
        indicator: "tech-provider-agri-forestry-percentage",
        data: { chart: [] },
      },
    ],
  },
];

vi.mock("@/hooks/use-filters", async (importOriginal) => ({
  ...((await importOriginal()) as object),
  default: () => ({ filters: state.filters }),
}));

vi.mock("@/lib/queryClient", () => ({
  client: {
    sections: {
      getSections: {
        useQuery: (
          _key: unknown,
          _args: unknown,
          options: { select: (res: unknown) => unknown },
        ) => ({ data: options.select({ body: { data: RAW_SECTIONS } }) }),
      },
    },
  },
}));

const dataSource = (...values: string[]): FilterQueryParam[] => [
  { name: "data-source", operator: "=", values },
];

describe("SectionsNav", () => {
  it("disables the entry of a section with no automated data", () => {
    state.filters = dataSource("automated");
    render(<SectionsNav />);

    const disabled = screen.getByText("Technology providers");

    expect(disabled).toHaveAttribute("aria-disabled", "true");
    expect(disabled).toHaveAccessibleDescription(
      /No automated web data for this section/i,
    );
    expect(
      screen.queryByRole("link", { name: "Technology providers" }),
    ).toBeNull();
    expect(
      screen.getByRole("link", { name: "General information" }),
    ).toHaveAttribute("href", "#general-information");
  });

  it("keeps every entry navigable for survey data", () => {
    state.filters = dataSource("survey");
    render(<SectionsNav />);

    expect(screen.getAllByRole("link")).toHaveLength(RAW_SECTIONS.length);
  });
});
