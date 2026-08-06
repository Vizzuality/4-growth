"use client";
import { FC, PropsWithChildren } from "react";

import useProjectionsCategoryFilter from "@/hooks/use-category-filter";

import FiltersSheet from "@/containers/bottom-bar/filters-sheet";

const ProjectionsFiltersSheet: FC<PropsWithChildren> = ({ children }) => {
  const { isCategorySelected } = useProjectionsCategoryFilter();

  return <FiltersSheet disabled={!isCategorySelected}>{children}</FiltersSheet>;
};

export default ProjectionsFiltersSheet;
