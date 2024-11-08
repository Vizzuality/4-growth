"use client";
import { FC, useEffect } from "react";

import { useAtom } from "jotai";
import { useSession } from "next-auth/react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import {
  sandboxFiltersAtom,
  sandboxIndicatorAtom,
  sandboxVisualizationAtom,
} from "@/containers/sidebar/store";
import Widget from "@/containers/widget";
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
  const getCustomWidgetQuery = client.users.findCustomWidget.useQuery(
    queryKeys.users.userChart(session?.user.id as string).queryKey,
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
    queryKeys.widgets.one(indicator || "", filters).queryKey,
    {
      params: { id: indicator! },
      query: {
        filters: filters,
      },
    },
    {
      enabled: !!indicator,
      select: (res) => res.body.data,
    },
  );

  useEffect(() => {
    if (getCustomWidgetQuery.status === "success") {
      if (!indicator) {
        setIndicator(getCustomWidgetQuery.data.widget.indicator);
      }
      if (!visualization) {
        setVisualization(getCustomWidgetQuery.data.defaultVisualization);
      }
      if (getCustomWidgetQuery.data.filters.length) {
        setFilters(getCustomWidgetQuery.data.filters);
      }
    }
  }, [getCustomWidgetQuery.status]);

  return (
    <Card className="p-0">
      {widget && (
        <Widget
          indicator={widget.indicator}
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
        />
      )}
    </Card>
  );
};

export default Sandbox;
