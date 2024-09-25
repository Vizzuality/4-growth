"use client";
import { useState } from "react";

import { WidgetVisualizationsType } from "@shared/dto/widgets/widget-visualizations.constants";

import { cn } from "@/lib/utils";

import MenuButton from "@/containers/menu-button";
import AreaChart from "@/containers/widget/area-chart";
import HorizontalBarChart from "@/containers/widget/horizontal-bar-chart";
import PieChart from "@/containers/widget/pie-chart";
import SingleValue from "@/containers/widget/single-value";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WidgetData } from "@/types";

const classes =
  "block rounded-none px-6 py-2 text-left transition-colors hover:bg-muted";
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
  const [currentVisualazation, setCurrentVisualazation] =
    useState(defaultVisualization);
  const [showMenu, setShowMenu] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setShowMenu(open);

    if (onMenuOpenChange) onMenuOpenChange(open);
  };
  let ChartComponent = null;

  if (currentVisualazation === "single_value") {
    return (
      <Card className="p-0">
        <SingleValue indicator={indicator} data={data} fill={fill} />
      </Card>
    );
  }

  switch (currentVisualazation) {
    case "horizontal_bar_chart":
      ChartComponent = <HorizontalBarChart data={data} />;
      break;
    case "pie_chart":
      ChartComponent = <PieChart data={data} />;
      break;
    case "map":
      ChartComponent = null;
      break;
    case "area_graph":
      ChartComponent = <AreaChart indicator={indicator} data={data} />;
      break;
    default:
      ChartComponent = null;
      break;
  }
  return (
    <>
      <Card
        className={cn(
          "relative min-h-80 p-0",
          currentVisualazation !== "area_graph" && "space-y-8 pb-8",
          showMenu && "z-50",
          className,
        )}
      >
        <header
          className={cn(
            currentVisualazation === "area_graph"
              ? "t-8 absolute left-0 z-20 w-full p-8"
              : "px-8 pt-8",
          )}
        >
          <div className="flex justify-between">
            <h3 className="text-base font-semibold">{indicator}</h3>
            <MenuButton
              className="flex flex-col gap-6 py-4"
              onOpenChange={handleOpenChange}
            >
              <Button variant="clean" className={classes}>
                More info
              </Button>
              <Button variant="clean" className={classes}>
                Customize chart
              </Button>
              <Separator />
              {visualisations.map((v) => (
                <Button
                  key={`menu-button-${v}`}
                  variant="clean"
                  className={classes}
                  onClick={() => setCurrentVisualazation(v)}
                >
                  {getButtonText(v)}
                </Button>
              ))}
            </MenuButton>
          </div>
          <p className="text-xs text-muted-foreground">{question}</p>
        </header>
        {ChartComponent}
      </Card>
    </>
  );
}

function getButtonText(v: WidgetVisualizationsType): string {
  switch (v) {
    case "horizontal_bar_chart":
      return "Show as a bar chart";
    case "pie_chart":
      return "Show as a pie chart";
    case "area_graph":
      return "Show as an area graph";
    case "map":
      return "Show as a map";
    default:
      return "";
  }
}
