"use client";
import { useState } from "react";

import { WidgetVisualizationsType } from "@shared/dto/widgets/widget-visualizations.constants";

import { cn } from "@/lib/utils";

import AreaChart from "@/containers/widget/area-chart";
import HorizontalBarChart from "@/containers/widget/horizontal-bar-chart";
import PieChart from "@/containers/widget/pie-chart";
import SingleValue from "@/containers/widget/single-value";
import WidgetHeader from "@/containers/widget/widget-header";

import { Card } from "@/components/ui/card";
import { WidgetData } from "@/types";

interface WidgetProps {
  indicator: string;
  question: string;
  defaultVisualization: WidgetVisualizationsType;
  visualisations: WidgetVisualizationsType[];
  data: WidgetData;
  fill?: "bg-secondary" | "bg-accent";
  className?: string;
  onMenuOpenChange?: (open: boolean) => void;
}
export default function Widget({
  indicator,
  question,
  defaultVisualization,
  visualisations,
  data,
  fill,
  className,
  onMenuOpenChange,
}: WidgetProps) {
  const [currentVisualization, setCurrentVisualization] =
    useState(defaultVisualization);
  const [showMenu, setShowMenu] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setShowMenu(open);

    if (onMenuOpenChange) onMenuOpenChange(open);
  };
  let ChartComponent = null;

  if (currentVisualization === "single_value") {
    return (
      <Card className="p-0">
        <SingleValue indicator={indicator} data={data} fill={fill} />
      </Card>
    );
  }

  switch (currentVisualization) {
    case "horizontal_bar_chart":
      ChartComponent = (
        <Card
          className={cn(
            "relative min-h-80 p-0 pb-6",
            showMenu && "z-50",
            className,
          )}
        >
          <WidgetHeader
            indicator={indicator}
            question={question}
            visualisations={visualisations}
            onMenuOpenChange={handleOpenChange}
            onMenuButtonClicked={setCurrentVisualization}
          />
          <HorizontalBarChart data={data} />
        </Card>
      );
      break;
    case "pie_chart":
      ChartComponent = (
        <Card
          className={cn(
            "relative min-h-80 p-0 pb-6",
            showMenu && "z-50",
            className,
          )}
        >
          <WidgetHeader
            indicator={indicator}
            question={question}
            visualisations={visualisations}
            onMenuOpenChange={handleOpenChange}
            onMenuButtonClicked={setCurrentVisualization}
          />
          <PieChart data={data} />
        </Card>
      );
      break;
    case "map":
      ChartComponent = null;
      break;
    case "area_graph":
      ChartComponent = (
        <Card
          className={cn("relative min-h-80 p-0", showMenu && "z-50", className)}
        >
          <WidgetHeader
            indicator={indicator}
            question={question}
            visualisations={visualisations}
            className="t-8 absolute left-0 z-20 w-full p-8"
            onMenuOpenChange={handleOpenChange}
            onMenuButtonClicked={setCurrentVisualization}
          />
          <AreaChart indicator={indicator} data={data} />
        </Card>
      );
      break;
    default:
      ChartComponent = null;
      break;
  }

  return ChartComponent;
}
