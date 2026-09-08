import { FC } from "react";

import { DATA_SOURCE_FILTER_NAME } from "@/lib/constants";

import DataSourceInfoButton from "@/containers/filter/data-source-info";
import DataSourceFilterLabel from "@/containers/filter/data-source-label";
import { DEFAULT_FILTERS_LABEL_MAP } from "@/containers/sidebar/filter-settings/constants";

interface DataSourceLegendProps {
  values: string[];
}

/**
 * Mobile has no sidebar to carry the comparison legend, so it rides above the
 * bottom bar. Informational only — the help button is the one control here, so
 * the row deliberately skips the filter rows' hover state.
 */
const DataSourceLegend: FC<DataSourceLegendProps> = ({ values }) => {
  if (values.length < 2) return null;

  return (
    <div className="relative bg-navy-900 px-4 py-3.5 pr-10 text-left">
      {DEFAULT_FILTERS_LABEL_MAP[DATA_SOURCE_FILTER_NAME].selected}{" "}
      <DataSourceFilterLabel values={values} />
      <DataSourceInfoButton className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />
    </div>
  );
};

export default DataSourceLegend;
