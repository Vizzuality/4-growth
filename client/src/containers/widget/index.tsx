"use client";
import { useState } from "react";

import { cn } from "@/lib/utils";

import MenuButton from "@/containers/menu-button";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import HorizontalBarChart from "@/containers/widget/horizontal-bar-chart";
import { WidgetVisualizationsType } from "@shared/dto/widgets/widget-visualizations.constants";
import { BaseWidget } from "@shared/dto/widgets/base-widget.entity";
import SingleValue from "@/containers/widget/single-value";
import PieChart from "@/containers/widget/pie-chart";

const classes =
  "block rounded-none px-6 py-2 text-left transition-colors hover:bg-muted";
interface WidgetProps {
  data: BaseWidget;
  className?: string;
  onMenuOpenChange: (open: boolean) => void;
}
export default function Widget({
  data,
  className,
  onMenuOpenChange,
}: WidgetProps) {
  const { indicator, question, defaultVisualization, visualisations } = data;
  const [currentVisualazation, setCurrentVisualazation] =
    useState(defaultVisualization);
  const [showMenu, setShowMenu] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setShowMenu(open);
    onMenuOpenChange(open);
  };
  let ChartComponent = null;

  switch (currentVisualazation) {
    case "horizontal_bar_chart":
      ChartComponent = <HorizontalBarChart />;
      break;
    case "pie_chart":
      ChartComponent = <PieChart />;
      break;
    case "map":
      ChartComponent = null;
      break;
    case "area_graph":
      ChartComponent = null;
      break;
    case "single_value":
      // ChartComponent = <SingleValue indicator={indicator} value={1} />;
      break;
    default:
      ChartComponent = null;
      break;
  }
  return (
    <>
      <Card
        className={cn(
          "space-y-8 p-0 pb-8",
          showMenu && "relative z-50",
          className,
        )}
      >
        <header className="px-8 pt-8">
          <div className="flex justify-between">
            <h3 className="font-semibold">{indicator}</h3>
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
    case "map":
      return "Show as a map";
    default:
      return "";
  }
}
