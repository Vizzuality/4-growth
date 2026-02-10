import { FC } from "react";

import Link from "next/link";

import { ProjectionVisualizationsType } from "@shared/dto/projections/projection-visualizations.constants";
import { useSetAtom } from "jotai";

import { infoAtom } from "@/containers/dialog/store";
import MenuButton from "@/containers/menu-button";
import { getMenuButtonText } from "@/containers/widget/projections/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getRouteHref } from "@/utils/route-config";

const btnClassName =
  "block w-full rounded-none px-4 py-3.5 text-left text-xs font-medium transition-colors hover:bg-muted";

interface WidgetMenuProps {
  visualisations?: ProjectionVisualizationsType[];
  selectedVisualization: ProjectionVisualizationsType;
  showCustomizeWidgetButton?: boolean;
  info?: { title: string; description: string };
  setSelectedVisualization: (
    visualization: ProjectionVisualizationsType,
  ) => void;
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
                getRouteHref("projections", "sandbox") +
                `?visualization=${selectedVisualization}&indicator=${indicator}`
              }
            >
              Customize chart
            </Link>
          </Button>
        )}
        {visualisations && (
          <>
            <Separator />
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
