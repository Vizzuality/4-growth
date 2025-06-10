import { FC } from "react";

import { WidgetCounterData } from "@shared/dto/widgets/base-widget-data.interface";

import { cn } from "@/lib/utils";

import Title from "@/components/ui/title";

interface SingleValueProps {
  indicator: string;
  data?: WidgetCounterData;
  fill?: "bg-secondary" | "bg-accent";
}

const SingleValue: FC<SingleValueProps> = ({
  indicator,
  data,
  fill = "bg-secondary",
}) => {
  if (!data) {
    console.error(
      `SingleValue - ${indicator}: Expected at least 1 data point, but received 0.`,
    );
    return null;
  }

  const { value, total } = data;
  const fillPercentage =
    total && total > 0 ? Math.min(Math.round((value / total) * 100), 100) : 0;

  return (
    <div className="relative h-full">
      <div
        style={{ width: `${fillPercentage}%` }}
        className={cn("absolute left-0 top-0 h-full", fill)}
      ></div>
      <div className="relative z-10 space-y-6 p-6">
        <Title as="h3" className="text-base">
          {indicator}
        </Title>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default SingleValue;
