import { cn } from "@/lib/utils";
import { FC } from "react";

interface SingleValueProps {
  indicator: string;
  total: number;
  current: number;
  fill: "bg-secondary" | "bg-accent";
}

const SingleValue: FC<SingleValueProps> = ({
  indicator,
  total,
  current,
  fill,
}) => {
  const fillPercentage = Math.round((100 / total) * current);

  return (
    <div className="relative">
      <div
        style={{ width: `${fillPercentage}%` }}
        className={cn("absolute left-0 top-0 h-full", fill)}
      ></div>
      <div className="relative z-10 space-y-6 p-6">
        <h3 className="text-2xs uppercase">{indicator}</h3>
        <p className="text-2xl">{current}</p>
      </div>
    </div>
  );
};

export default SingleValue;
