import { ReactNode } from "react";

import { CustomChart } from "@shared/dto/custom-charts/custom-chart.entity";

import { cn } from "@/lib/utils";

const customChart = new CustomChart();

customChart.chartFilters = [];
//
const Wrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn({
        "container mx-auto flex w-full flex-grow flex-col": true,
        [`${className}`]: className !== undefined,
      })}
    >
      {children}
    </div>
  );
};

export default Wrapper;
