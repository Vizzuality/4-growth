import { cn } from "@/lib/utils";
import { FC } from "react";

interface AreaChartProps {
  indicator: string;
  question: string;
  answers: { label: string; value: number }[];
}

const AreaChart: FC<AreaChartProps> = ({ indicator, question, answers }) => {
  return (
    <div className="relative flex h-full items-end">
      <div className="absolute left-6 top-6 z-10 h-[calc(100%_-_3rem)] w-[calc(100%_-_3rem)]">
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">{indicator}</h3>
            <p className="text-xs text-muted-foreground">{question}</p>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-semibold">{answers[0].value}%</p>
            <div className="text-xs font-bold">
              <p>
                {answers[1].label} {answers[1].value}%
              </p>
              <p>
                {answers[2].label}
                {answers[2].value}%
              </p>
            </div>
          </div>
        </div>
      </div>
      {answers.map((a, i) => (
        <div
          key={`area-chart-${indicator}-${a.label}-${a.value}`}
          style={{ width: `${a.value}%` }}
          className={cn(
            "flex h-full flex-col justify-end",
            i === 0 && "bg-secondary",
            i === 2 &&
              "bg-secondary bg-[url('/images/area-graph-pattern.png')] bg-blend-multiply [transform:scaleX(-1)_rotate(-180deg)]",
          )}
        ></div>
      ))}
    </div>
  );
};

export default AreaChart;
