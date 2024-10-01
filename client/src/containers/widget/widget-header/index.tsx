import { FC } from "react";

import { WidgetVisualizationsType } from "@shared/dto/widgets/widget-visualizations.constants";

import { cn } from "@/lib/utils";

import MenuButton from "@/containers/menu-button";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const classes =
  "block rounded-none px-6 py-2 text-left transition-colors hover:bg-muted";

const getButtonText = (v: WidgetVisualizationsType): string => {
  switch (v) {
    case "horizontal_bar_chart":
      return "Show as a bar chart";
    case "pie_chart":
      return "Show as a pie chart";
    case "area_graph":
      return "Show as an area chart";
    case "map":
      return "Show as a map";
    default:
      return "";
  }
};

interface WidgetHeaderProps {
  indicator: string;
  question: string;
  visualisations: WidgetVisualizationsType[];
  className?: string;
  onMenuOpenChange: (o: boolean) => void;
  onMenuButtonClicked: (v: WidgetVisualizationsType) => void;
}

const WidgetHeader: FC<WidgetHeaderProps> = ({
  indicator,
  question,
  visualisations,
  className,
  onMenuOpenChange,
  onMenuButtonClicked,
}) => {
  return (
    <header className={cn("p-8", className)}>
      <div className="flex justify-between">
        <h3 className="text-base font-semibold">{indicator}</h3>
        <MenuButton
          className="flex flex-col gap-6 py-4"
          onOpenChange={onMenuOpenChange}
        >
          <Button variant="clean" className={classes}>
            Customize chart
          </Button>
          <Separator />
          {visualisations.map((v) => (
            <Button
              key={`menu-button-${v}`}
              variant="clean"
              className={classes}
              onClick={() => onMenuButtonClicked(v)}
            >
              {getButtonText(v)}
            </Button>
          ))}
        </MenuButton>
      </div>
      <p className="text-xs text-muted-foreground">{question}</p>
    </header>
  );
};

export default WidgetHeader;
