import { FC } from "react";

import Link from "next/link";

import { WidgetVisualizationsType } from "@shared/dto/widgets/widget-visualizations.constants";
import { useSetAtom } from "jotai";

import { infoAtom } from "@/containers/dialog/store";
import MenuButton from "@/containers/menu-button";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getRouteHref } from "@/utils/route-config";

const btnClassName =
  "block w-full rounded-none px-4 py-3.5 text-left text-xs font-medium transition-colors hover:bg-muted";

const getMenuButtonText = (v: WidgetVisualizationsType): string => {
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

interface WidgetMenuProps {
  visualisations?: WidgetVisualizationsType[];
  selectedVisualization: WidgetVisualizationsType;
  showCustomizeWidgetButton?: boolean;
  info?: { title: string; description: string };
  setSelectedVisualization: (visualization: WidgetVisualizationsType) => void;
  className?: string;
  setShowOverlay: (open: boolean) => void;
  setFocusedWidget: (indicator: string | null) => void;
  indicator: string;
}

const WidgetMenu: FC<WidgetMenuProps> = ({
  visualisations,
  selectedVisualization,
  showCustomizeWidgetButton,
  info,
  className,
  indicator,
  setSelectedVisualization,
  setShowOverlay,
  setFocusedWidget,
}) => {
  const setInfo = useSetAtom(infoAtom);
  if (!visualisations && !showCustomizeWidgetButton) return null;

  return (
    <>
      <MenuButton
        className={className}
        onOpenChange={(open) => {
          setShowOverlay(open);
          if (open) {
            setFocusedWidget(indicator);
          } else {
            setFocusedWidget(null);
          }
        }}
      >
        {!!info && (
          <Button
            variant="clean"
            className={btnClassName}
            onClick={() => setInfo(info ?? null)}
          >
            More info
          </Button>
        )}
        {showCustomizeWidgetButton && (
          <Button variant="clean" className={btnClassName} asChild>
            <Link
              href={
                getRouteHref("surveyAnalysis", "sandbox") +
                `?visualization=${selectedVisualization}&indicator=${indicator}`
              }
            >
              Customize chart
            </Link>
          </Button>
        )}
        {visualisations && (
          <>
            <div className="px-4 py-2">
              <Separator className="bg-[#627188]" />
            </div>
            {visualisations.map((v) => (
              <Button
                key={`visualization-list-item-${v}`}
                variant="clean"
                className={btnClassName}
                onClick={() => setSelectedVisualization(v)}
              >
                {getMenuButtonText(v)}
              </Button>
            ))}
          </>
        )}
      </MenuButton>
    </>
  );
};

export default WidgetMenu;
