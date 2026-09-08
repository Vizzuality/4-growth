"use client";
import { FC } from "react";

import { DATA_SOURCE_FILTER_NAME } from "@/lib/constants";

import useFilters from "@/hooks/use-filters";

import Legend from "@/containers/bottom-bar/data-source-legend/legend";

const DataSourceLegend: FC = () => {
  const { filters } = useFilters();
  const values =
    filters.find((f) => f.name === DATA_SOURCE_FILTER_NAME)?.values ?? [];

  return <Legend values={values} />;
};

export default DataSourceLegend;
