import { ProjectionScenarios } from "@shared/dto/projections/projection-types";
import { describe, expect, it } from "vitest";

import {
  ProjectionCategory,
  SCENARIO_DESCRIPTIONS,
} from "@/containers/scenarios/descriptions/constants";

const OTHER_CATEGORY: Record<ProjectionCategory, ProjectionCategory> = {
  Forestry: "Agriculture",
  Agriculture: "Forestry",
};

describe("SCENARIO_DESCRIPTIONS", () => {
  const combinations = (
    Object.keys(OTHER_CATEGORY) as ProjectionCategory[]
  ).flatMap((category) =>
    Object.values(ProjectionScenarios).map(
      (scenario) => [category, scenario] as const,
    ),
  );

  it.each(combinations)(
    "describes %s / %s in terms of its own operation area",
    (category, scenario) => {
      const description = SCENARIO_DESCRIPTIONS[category][scenario];

      expect(description).toContain(category);
      expect(description).not.toContain(OTHER_CATEGORY[category]);
    },
  );
});
