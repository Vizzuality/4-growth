import { FC } from "react";

import { compareDataSources, DATA_SOURCE_SHORT_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * 8px period is the tile bar-pattern.png renders at once scaled to 48px, so the
 * pill and the chart bars stripe in step. The stripe is wider than the chart's —
 * at pill size the chart's 3px reads as noise.
 */
const HATCH_STYLE = {
  backgroundImage:
    "repeating-linear-gradient(135deg, hsl(var(--accent)) 0 5px, transparent 5px 8px)",
  WebkitTextStrokeWidth: "1px",
  WebkitTextStrokeColor: "hsl(var(--primary))",
  // Without this the stroke paints over the fill and eats the glyphs at 12px
  paintOrder: "stroke fill",
};

interface DataSourceFilterLabelProps {
  values: string[];
}

/**
 * Doubles as the comparison chart's legend, so the fills follow the chart: the
 * leading source is solid and the rest are hatched.
 */
const DataSourceFilterLabel: FC<DataSourceFilterLabelProps> = ({ values }) => {
  const ordered = [...values].sort(compareDataSources);

  return (
    <span className="inline-flex flex-wrap items-center font-bold">
      {ordered.map((value, index) => (
        <span key={`data-source-${value}`} className="inline-flex items-center">
          {index > 0 && <span className="px-1">and</span>}
          <span
            className={cn(
              // Sized to keep "Data is Survey and Automated" on one line in the
              // 280px sidebar, which the row's own 14px does not manage
              "rounded-full px-1.5 py-0.5 text-xs text-white",
              index === 0 && "bg-accent",
            )}
            style={index > 0 ? HATCH_STYLE : undefined}
          >
            {DATA_SOURCE_SHORT_LABELS[value] ?? value}
          </span>
        </span>
      ))}
    </span>
  );
};

export default DataSourceFilterLabel;
