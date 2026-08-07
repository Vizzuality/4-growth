import { FC } from "react";

import { compareDataSources, DATA_SOURCE_SHORT_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Tile size the comparison chart draws its bar hatching at */
const HATCH_STYLE = {
  backgroundImage: "url('/images/bar-pattern.png')",
  backgroundSize: "48px 48px",
  backgroundPosition: "top left",
};

interface DataSourceFilterLabelProps {
  values: string[];
}

/**
 * Doubles as the comparison chart's legend, so the underlines follow the chart:
 * the leading source is solid and the rest are hatched.
 */
const DataSourceFilterLabel: FC<DataSourceFilterLabelProps> = ({ values }) => {
  const ordered = [...values].sort(compareDataSources);

  return (
    <span className="inline-flex flex-wrap items-center font-bold">
      {ordered.map((value, index) => (
        <span key={`data-source-${value}`} className="inline-flex items-center">
          {index > 0 && <span className="px-1">and</span>}
          <span className="relative px-1 py-0.5">
            {DATA_SOURCE_SHORT_LABELS[value] ?? value}
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-1 bottom-0 h-1 rounded-lg bg-accent",
                index > 0 && "[background-blend-mode:multiply]",
              )}
              style={index > 0 ? HATCH_STYLE : undefined}
            />
          </span>
        </span>
      ))}
    </span>
  );
};

export default DataSourceFilterLabel;
