"use client";
import { FC, useEffect } from "react";

import { useAtom, useAtomValue } from "jotai";
import { useSession } from "next-auth/react";

import {
  getAbsoluteValue,
  getResponseRate,
  normalizeWidgetData,
} from "@/lib/normalize-widget-data";
import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import {
  sandboxBreakdownAtom,
  sandboxFiltersAtom,
  sandboxIndicatorAtom,
  sandboxVisualizationAtom,
} from "@/containers/sidebar/store";
import Widget from "@/containers/widget/survey-analysis";
import UpdateWidgetMenu from "@/containers/widget/update-widget";

import { Card } from "@/components/ui/card";
import { getAuthHeader } from "@/utils/auth-header";

interface SandboxProps {
  customWidgetId: string;
}

const Sandbox: FC<SandboxProps> = ({ customWidgetId }) => {
  const { data: session } = useSession();
  const [indicator, setIndicator] = useAtom(sandboxIndicatorAtom);
  const [visualization, setVisualization] = useAtom(sandboxVisualizationAtom);
  const [filters, setFilters] = useAtom(sandboxFiltersAtom);
  const breakdown = useAtomValue(sandboxBreakdownAtom);
  const getCustomWidgetQuery = client.users.findCustomWidget.useQuery(
    queryKeys.users.userChart(customWidgetId).queryKey,
    {
      params: {
        id: Number(customWidgetId),
        userId: session?.user.id as string,
      },
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
    },
    {
      select: (data) => data.body.data,
      enabled: !!customWidgetId,
    },
  );
  const { data: widget } = client.widgets.getWidget.useQuery(
    queryKeys.widgets.one(indicator || "", filters, breakdown || undefined)
      .queryKey,
    {
      params: { id: indicator! },
      query: {
        filters: filters,
        breakdown: breakdown || undefined,
      },
    },
    {
      enabled: !!indicator,
      select: (res) => ({
        ...res.body.data,
        data: {
          raw: res.body.data.data,
          percentages: normalizeWidgetData(res.body.data.data),
        },
        responseRate: getResponseRate(res.body.data.data),
        absoluteValue: getAbsoluteValue(res.body.data.data),
      }),
    },
  );

  useEffect(() => {
    if (getCustomWidgetQuery.status === "success" && !visualization) {
      setIndicator(getCustomWidgetQuery.data.widget.indicator);
      setVisualization(getCustomWidgetQuery.data.defaultVisualization);

      if (getCustomWidgetQuery.data.filters.length) {
        setFilters(getCustomWidgetQuery.data.filters);
      }
    }
  }, [
    getCustomWidgetQuery.data?.defaultVisualization,
    getCustomWidgetQuery.data?.filters,
    getCustomWidgetQuery.data?.widget.indicator,
    getCustomWidgetQuery.status,
    indicator,
    setFilters,
    setIndicator,
    setVisualization,
    visualization,
  ]);

  return (
    <Card className="p-0">
      {widget && (
        <Widget
          title={widget.title}
          description={widget.description}
          indicator={widget.indicator}
          responseRate={widget.responseRate}
          absoluteValue={widget.absoluteValue}
          question={widget.question}
          visualization={visualization || widget.defaultVisualization}
          data={widget.data}
          menu={
            <UpdateWidgetMenu
              widgetId={customWidgetId}
              indicator={indicator}
              visualization={visualization}
              filters={filters}
            />
          }
          className="col-span-1 last:odd:col-span-2"
          config={{ menu: { className: "flex flex-col py-4" } }}
          breakdown={breakdown || undefined}
        />
      )}
    </Card>
  );
};

export default Sandbox;
