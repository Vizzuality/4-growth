"use client";
import { useState } from "react";

import { BaseWidgetWithData } from "@shared/dto/widgets/base-widget-data.interface";
import {
  WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from "@shared/dto/widgets/widget-visualizations.constants";

import { cn, isEmptyWidget } from "@/lib/utils";

import NoData from "@/containers/no-data";
import AreaChart from "@/containers/widget/area-chart";
import Filter from "@/containers/widget/filter";
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
  data: BaseWidgetWithData["data"];
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

  if (isEmptyWidget(data)) {
    return (
      <Card className={cn("relative min-h-80 p-0", className)}>
        <WidgetHeader indicator={indicator} question={question} />
        <NoData />
      </Card>
    );
  }

  switch (currentVisualization) {
    case WIDGET_VISUALIZATIONS.SINGLE_VALUE:
      return (
        <Card className="p-0">
          <SingleValue indicator={indicator} data={data?.counter} fill={fill} />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART:
      return (
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
          <HorizontalBarChart data={data.chart} />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.PIE_CHART:
      return (
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
          <PieChart data={data.chart} />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.AREA_GRAPH:
      return (
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
          <AreaChart indicator={indicator} data={data.chart} />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.NAVIGATION:
      return (
        <Card
          className={cn("relative min-h-80 p-0", showMenu && "z-50", className)}
        >
          <Navigation indicator={indicator} href={data?.navigation?.href} />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.FILTER:
      return (
        <Card
          className={cn(
            "relative min-h-80 bg-accent p-0",
            showMenu && "z-50",
            className,
          )}
        >
          <Filter indicator={indicator} href={data?.navigation?.href} />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.MAP:
      // TODO: return map component when widget data for map is defined
      return null;
    default:
      console.warn(
        `Widget: Unsupported visualization type "${currentVisualization}" for indicator "${indicator}".`,
      );
      return null;
  }
}
