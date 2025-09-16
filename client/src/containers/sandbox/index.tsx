"use client";
import { FC, useEffect } from "react";

import useFilters from "@/hooks/use-filters";
import useSandboxWidget from "@/hooks/use-sandbox-widget";

import NoData from "@/containers/no-data";
import CreateWidgetMenu from "@/containers/widget/create-widget";
import Widget from "@/containers/widget/survey-analysis";

import CloudOff from "@/components/icons/cloud-off";
import MenuPointer from "@/components/icons/menu-pointer";
import { Card } from "@/components/ui/card";

const Sandbox: FC = () => {
  const {
    breakdown,
    indicator,
    visualization,
    setVisualization,
    getWidgetQuery: { data: widget, error, isFetched },
  } = useSandboxWidget();
  const { filters } = useFilters();
  let Comp: JSX.Element | null = (
    <header className="space-y-1 p-8">
      <p className="font-semibold">
        The Sandbox allows users to create customized visualizations by
        combining data series and filters in a single graph.
      </p>
      <p className="font-semibold">
        Please select an indicator and a chart type to start the visualization.
      </p>
    </header>
  );

  if (isFetched && !widget && !error) {
    Comp = (
      <NoData
        icon={<MenuPointer />}
        description="Select an indicator to visualize its data."
        className="m-6 gap-6"
      />
    );
  }

  if (widget) {
    Comp = (
      <Widget
        breakdown={breakdown || undefined}
        indicator={widget.indicator}
        responseRate={widget.responseRate}
        question={widget.question}
        visualization={visualization || widget.defaultVisualization}
        data={widget.data}
        menu={
          <CreateWidgetMenu
            indicator={indicator}
            visualization={visualization}
            filters={filters}
          />
        }
        className="col-span-1 last:odd:col-span-2"
        config={{ menu: { className: "flex flex-col py-4" } }}
      />
    );
  }

  if (error) {
    Comp =
      error.status === 404 ? (
        <NoData />
      ) : (
        <NoData
          icon={<CloudOff />}
          description="Something went wrong, please check back soon."
        />
      );
  }

  useEffect(() => {
    if (!widget) return;

    if (!visualization || !widget.visualisations.includes(visualization)) {
      setVisualization(widget.defaultVisualization);
    }
  }, [widget, visualization, setVisualization]);

  return <Card className="p-0">{Comp}</Card>;
};

export default Sandbox;
