import { ProjectionFilter } from "@shared/dto/projections/projection-filter.entity";

export const filterProjectionsFilters = (
  filters?: ProjectionFilter[],
): ProjectionFilter[] => {
  return (
    filters?.filter((f) => f.name !== "scenario" && f.name !== "category") || []
  );
};
