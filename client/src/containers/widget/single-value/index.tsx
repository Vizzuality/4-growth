import { FC } from "react";

import { cn } from "@/lib/utils";

import { WidgetData } from "@/types";

interface SingleValueProps {
  indicator: string;
  data: WidgetData;
  fill?: "bg-secondary" | "bg-accent";
}

const SingleValue: FC<SingleValueProps> = ({
  indicator,
  data,
  fill = "bg-secondary",
}) => {
  const { value, total } = data[0];
  const fillPercentage = Math.round((100 / total) * value);

  return (
    <div className="relative h-full">
      <div
        style={{ width: `${fillPercentage}%` }}
        className={cn("absolute left-0 top-0 h-full", fill)}
      ></div>
      <div className="relative z-10 space-y-6 p-6">
        <h3 className="text-base font-semibold">{indicator}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default SingleValue;
