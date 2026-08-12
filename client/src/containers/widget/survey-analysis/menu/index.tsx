import { FC } from "react";

import Link from "next/link";

import { WidgetVisualizationsType } from "@shared/dto/widgets/widget-visualizations.constants";
import { useSetAtom } from "jotai";

import { infoAtom } from "@/containers/dialog/store";
import MenuButton from "@/containers/menu-button";
import DownloadCsvLink from "@/containers/widget/download-csv-link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DisabledVisualization,
  VISUALIZATION_RESTRICTION_COPY,
} from "@/lib/visualization-availability";
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
  /** Comparing sources restricts rendering to bars, so other options are inert */
  disabledVisualisations?: DisabledVisualization[];
  showCustomizeWidgetButton?: boolean;
  info?: { title: string; description: string };
  setSelectedVisualization: (visualization: WidgetVisualizationsType) => void;
  className?: string;
  setShowOverlay: (open: boolean) => void;
  setFocusedWidget: (indicator: string | null) => void;
  indicator: string;
  downloadUrl?: string;
  chartTitle?: string;
  section?: string;
}

const WidgetMenu: FC<WidgetMenuProps> = ({
  visualisations,
  selectedVisualization,
  disabledVisualisations,
  showCustomizeWidgetButton,
  info,
  className,
  indicator,
  downloadUrl,
  chartTitle,
  section,
  setSelectedVisualization,
  setShowOverlay,
  setFocusedWidget,
}) => {
  const setInfo = useSetAtom(infoAtom);
  if (!visualisations && !showCustomizeWidgetButton && !downloadUrl) return null;

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
        {downloadUrl && (
          <Button variant="clean" className={btnClassName} asChild>
            <DownloadCsvLink
              downloadUrl={downloadUrl}
              chartId={indicator}
              chartTitle={chartTitle}
              section={section}
              visualisationType={selectedVisualization}
            >
              Download as CSV
            </DownloadCsvLink>
          </Button>
        )}
        {visualisations && (
          <>
            <div className="px-4 py-2">
              <Separator className="bg-[#627188]" />
            </div>
            {visualisations.map((v) => {
              const reason = disabledVisualisations?.find(
                ({ visualization }) => visualization === v,
              )?.reason;

              return (
                <Button
                  key={`visualization-list-item-${v}`}
                  variant="clean"
                  className={btnClassName}
                  disabled={!!reason}
                  title={
                    reason ? VISUALIZATION_RESTRICTION_COPY[reason] : undefined
                  }
                  onClick={() => setSelectedVisualization(v)}
                >
                  {getMenuButtonText(v)}
                </Button>
              );
            })}
          </>
        )}
      </MenuButton>
    </>
  );
};

export default WidgetMenu;
