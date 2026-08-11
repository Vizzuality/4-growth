"use client";

import { useEffect, useMemo, useState } from "react";

import {
  WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from "@shared/dto/widgets/widget-visualizations.constants";
import { useAtom } from "jotai";
import useFilters from "@/hooks/use-filters";

import { buildWidgetDownloadUrl } from "@/utils/download-url";

import {
  compareAnswerLabels,
  compareDataSources,
  DATA_SOURCE_FILTER_NAME,
} from "@/lib/constants";
import { removeNaLabels } from "@/lib/normalize-widget-data";
import { cn, isEmptyWidget } from "@/lib/utils";

import { focusedWidgetAtom } from "@/containers/explore/store";
import NoData from "@/containers/no-data";
import { showOverlayAtom } from "@/containers/overlay/store";
import AreaGraph from "@/containers/widget/area-graph";
import Breakdown from "@/containers/widget/breakdown";
import Filter from "@/containers/widget/filter";
import HorizontalBarChart from "@/containers/widget/horizontal-bar-chart";
import Map from "@/containers/widget/map";
import Navigation from "@/containers/widget/navigation";
import PieChart from "@/containers/widget/pie-chart";
import SingleValue from "@/containers/widget/single-value";
import SingleValueBySource from "@/containers/widget/single-value/by-source";
import SourceComparisonChart from "@/containers/widget/source-comparison-chart";
import WidgetMenu from "@/containers/widget/survey-analysis/menu";
import WidgetHeader from "@/containers/widget/widget-header";

import { Card } from "@/components/ui/card";
import { TransformedWidgetData } from "@/types";

export interface WidgetProps {
  indicator: string;
  title: string;
  section?: string;
  data: TransformedWidgetData;
  visualization: WidgetVisualizationsType;
  responseRate: number;
  absoluteValue: number;
  description?: string;
  breakdown?: string;
  visualisations?: WidgetVisualizationsType[];
  question?: string;
  questionTitle?: string;
  menu?: React.ReactNode;
  /** Shown next to the default menu (e.g. save widget); keeps CSV and visualization actions */
  extraHeaderActions?: React.ReactNode;
  hideDownloadCsv?: boolean;
  className?: string;
  showCustomizeWidgetButton?: boolean;
  config?: {
    singleValue?: { fill?: "bg-secondary" | "bg-accent" };
    horizontalBarChart?: { barSize: number };
    pieChart?: {
      className: HTMLDivElement["className"];
      legendPosition?: "bottom" | "right";
    };
    menu?: { className: string };
  };
}

export default function Widget({
  indicator,
  responseRate,
  absoluteValue,
  visualization,
  visualisations,
  breakdown,
  data,
  title,
  section,
  description,
  question,
  questionTitle,
  menu,
  extraHeaderActions,
  hideDownloadCsv,
  className,
  showCustomizeWidgetButton,
  config,
}: WidgetProps) {
  const [selectedVisualization, setSelectedVisualization] =
    useState(visualization);
  // Present only when more than one data source is selected. Rendering is forced
  // to bars while comparing, without touching the stored visualization choice, so
  // leaving comparison restores whatever the user had picked.
  const bySource = useMemo(() => {
    const sources = data.percentages.bySource;

    return (
      sources &&
      [...sources].sort((a, b) => compareDataSources(a.source, b.source))
    );
  }, [data.percentages.bySource]);
  const isComparingSources = (bySource?.length ?? 0) > 1;
  const disabledVisualisations = isComparingSources
    ? visualisations?.filter(
        (v) => v !== WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
      )
    : undefined;
  const [showOverlay, setShowOverlay] = useAtom(showOverlayAtom);
  const [focusedWidget, setFocusedWidget] = useAtom(focusedWidgetAtom);
  const highlightWidget = showOverlay && indicator === focusedWidget;
  const { filters } = useFilters();
  // The breakdown response carries no bySource — that path replaces the whole
  // payload — so the combined-sources note reads the filter instead.
  const hasMultipleSourcesSelected =
    (filters.find((f) => f.name === DATA_SOURCE_FILTER_NAME)?.values.length ??
      0) > 1;
  const downloadUrl = buildWidgetDownloadUrl(indicator, filters, breakdown);
  const defaultMenu = (
    <WidgetMenu
      visualisations={visualisations}
      disabledVisualisations={disabledVisualisations}
      info={description ? { title: indicator, description } : undefined}
      selectedVisualization={selectedVisualization}
      showCustomizeWidgetButton={showCustomizeWidgetButton}
      setShowOverlay={setShowOverlay}
      setFocusedWidget={setFocusedWidget}
      setSelectedVisualization={setSelectedVisualization}
      indicator={indicator}
      chartTitle={title}
      section={section}
      downloadUrl={hideDownloadCsv ? undefined : downloadUrl}
      className={cn("p-0", config?.menu?.className)}
    />
  );
  const menuComponent =
    menu ??
    (extraHeaderActions ? (
      <div className="flex items-center gap-2">
        {defaultMenu}
        {extraHeaderActions}
      </div>
    ) : (
      defaultMenu
    ));

  useEffect(() => {
    setSelectedVisualization(visualization);
  }, [visualization]);

  if (isEmptyWidget(data.raw)) {
    return (
      <Card className={cn("relative min-h-80 p-0", className)}>
        <WidgetHeader
          title={title}
          question={question}
          menu={menuComponent}
          responseRate={responseRate}
        />
        <NoData />
      </Card>
    );
  }

  if (breakdown) {
    return (
      <Card
        className={cn(
          "relative min-h-80 p-0 pb-7",
          highlightWidget && "z-50",
          className,
        )}
      >
        <WidgetHeader title={title} question={question} menu={menuComponent} />
        {hasMultipleSourcesSelected && (
          <p className="px-8 pb-2 text-xs text-bluish-gray-500">
            Survey + Automated (combined)
          </p>
        )}
        <Breakdown data={data.percentages.breakdown} />
      </Card>
    );
  }

  if (isComparingSources) {
    const isCounterWidget = bySource?.some((s) => s.data.counter !== undefined);

    if (isCounterWidget) {
      return (
        <Card className="p-0">
          <SingleValueBySource title={title} data={bySource} />
        </Card>
      );
    }

    return (
      <Card
        className={cn(
          "relative min-h-80 p-0 pb-7",
          highlightWidget && "z-50",
          className,
        )}
      >
        <WidgetHeader
          title={title}
          question={question}
          questionTitle={questionTitle}
          menu={menuComponent}
          responseRate={responseRate}
          absoluteValue={absoluteValue}
        />
        <SourceComparisonChart data={bySource} />
      </Card>
    );
  }

  switch (selectedVisualization) {
    case WIDGET_VISUALIZATIONS.SINGLE_VALUE:
      return (
        <Card className="p-0">
          <SingleValue
            title={title}
            data={data?.percentages.counter}
            {...config?.singleValue}
          />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART:
      return (
        <Card
          className={cn(
            "relative min-h-80 p-0 pb-7",
            highlightWidget && "z-50",
            className,
          )}
        >
          <WidgetHeader
            title={title}
            question={question}
            questionTitle={questionTitle}
            menu={menuComponent}
            responseRate={responseRate}
            absoluteValue={absoluteValue}
          />
          <HorizontalBarChart
            data={[...removeNaLabels(data.raw.chart)].sort((a, b) =>
              compareAnswerLabels(a.label, b.label),
            )}
            {...config?.horizontalBarChart}
          />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.PIE_CHART:
      return (
        <Card
          className={cn(
            "relative min-h-80 p-0 pb-7",
            highlightWidget && "z-50",
            className,
          )}
        >
          <WidgetHeader
            title={title}
            question={question}
            menu={menuComponent}
            responseRate={responseRate}
            absoluteValue={absoluteValue}
          />
          <PieChart
            data={data.percentages.chart}
            className="min-h-0 w-full flex-1"
            legendPosition="bottom"
            {...config?.pieChart}
          />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.AREA_GRAPH:
      return (
        <Card
          className={cn(
            "relative min-h-80 p-0",
            highlightWidget && "z-50",
            className,
          )}
        >
          <WidgetHeader
            title={title}
            question={question}
            className="t-8 absolute left-0 z-20 w-full p-8"
            menu={menuComponent}
            responseRate={responseRate}
            absoluteValue={absoluteValue}
          />
          <AreaGraph indicator={indicator} data={data.percentages.chart} />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.NAVIGATION:
      return (
        <Card
          className={cn(
            "relative min-h-80 p-0",
            highlightWidget && "z-50",
            className,
          )}
        >
          <Navigation indicator={indicator} href={data?.raw.navigation?.href} />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.FILTER:
      return (
        <Card
          className={cn(
            "relative min-h-80 bg-accent p-0",
            highlightWidget && "z-50",
            className,
          )}
        >
          <Filter indicator={indicator} href={data?.raw.navigation?.href} />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.MAP:
      return (
        <Card
          className={cn("relative p-0", highlightWidget && "z-50", className)}
        >
          <WidgetHeader
            title={title}
            question={question}
            className="t-8 absolute left-0 z-20 w-full p-8"
            menu={menuComponent}
            responseRate={responseRate}
            absoluteValue={absoluteValue}
          />
          <Map data={data.raw.map} />
        </Card>
      );
    default:
      console.error(
        `Widget: Unsupported visualization type "${visualization}" for indicator "${indicator}".`,
      );
      return null;
  }
}
