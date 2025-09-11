import { FC } from "react";

import { TW_CHART_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const WidgetLegend: FC<{
  colors: (string | number)[];
  className?: HTMLHeadingElement["className"];
}> = ({ colors, className }) => {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      {colors.map((color, index) => (
        <p
          key={`bubble-chart-legend-${color}`}
          className="flex items-center gap-x-1 text-xs"
        >
          <span
            className={cn("block h-3 w-3 rounded-full", TW_CHART_COLORS[index])}
          ></span>
          <span>{color}</span>
        </p>
      ))}
    </div>
  );
};

export default WidgetLegend;
