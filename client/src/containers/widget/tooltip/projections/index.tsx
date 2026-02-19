import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { TW_CHART_COLORS } from "@/lib/constants";
import { cn, formatNumber } from "@/lib/utils";

const ProjectionsTooltip = ({
  payload,
  unit,
}: {
  payload: Payload<ValueType, NameType>[];
  unit: string;
}) => {
  return (
    <div className="space-y-2">
      <p className="grid grid-cols-2 gap-2">
        <span className="flex flex-1 justify-end">Year</span>
        <span className="flex flex-1 justify-start font-bold">
          {payload[0].payload.year}
        </span>
      </p>
      {payload.map((p, i) => (
        <p
          key={`tooltip-item-${p.name}-${p.value}`}
          className="grid grid-cols-2 gap-2"
        >
          <span className="flex flex-1 items-center justify-end gap-x-1">
            <span
              className={cn("block h-3 w-3 rounded-full", TW_CHART_COLORS[i])}
            ></span>
            <span>{p.name}</span>
          </span>
          <span className="flex flex-1 justify-start gap-1 font-bold">
            {formatNumber(Number(p.value), {
              maximumFractionDigits: 0,
            })}
            <span className="text-muted-foreground">{unit}</span>
          </span>
        </p>
      ))}
    </div>
  );
};

export default ProjectionsTooltip;
