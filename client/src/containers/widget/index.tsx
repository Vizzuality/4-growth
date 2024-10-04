"use client";
import { useState } from "react";

import {
  WidgetData,
  WidgetNavigationData,
} from "@shared/dto/widgets/base-widget-data.interface";
import {
  WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from "@shared/dto/widgets/widget-visualizations.constants";

import { cn, isWidgetData, isWidgetNavigationData } from "@/lib/utils";

import AreaChart from "@/containers/widget/area-chart";
import HorizontalBarChart from "@/containers/widget/horizontal-bar-chart";
import Navigation from "@/containers/widget/navigation";
import PieChart from "@/containers/widget/pie-chart";
import SingleValue from "@/containers/widget/single-value";
import WidgetHeader from "@/containers/widget/widget-header";

import { Card } from "@/components/ui/card";

export interface WidgetProps {
  indicator: string;
  question: string;
  defaultVisualization: WidgetVisualizationsType;
  visualisations: WidgetVisualizationsType[];
  data: WidgetData | WidgetNavigationData;
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

  if (currentVisualization === "single_value" && isWidgetData(data)) {
    return (
      <Card className="p-0">
        <SingleValue indicator={indicator} data={data} fill={fill} />
      </Card>
    );
  }

  switch (currentVisualization) {
    case WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART:
      if (isWidgetData(data)) {
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
      }
      break;
    case WIDGET_VISUALIZATIONS.PIE_CHART:
      if (isWidgetData(data)) {
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
      }
      break;
    case WIDGET_VISUALIZATIONS.MAP:
      ChartComponent = null;
      break;
    case WIDGET_VISUALIZATIONS.AREA_GRAPH:
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
    case WIDGET_VISUALIZATIONS.NAVIGATION:
    case WIDGET_VISUALIZATIONS.FILTER:
      if (isWidgetNavigationData(data)) {
        ChartComponent = (
          <Card
            className={cn(
              "relative min-h-80 p-0",
              showMenu && "z-50",
              currentVisualization === WIDGET_VISUALIZATIONS.FILTER &&
                "bg-accent",
              className,
            )}
          >
            <Navigation
              indicator={indicator}
              visualization={currentVisualization}
              href={data.href}
            />
          </Card>
        );
      }
      break;
    default:
      console.warn(
        `Widget: Unsupported visualization type "${currentVisualization}" for indicator "${indicator}".`,
      );
      ChartComponent = null;
      break;
  }

  return ChartComponent;
}
