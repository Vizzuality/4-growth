import {
  VALID_WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from "@shared/dto/widgets/widget-visualizations.constants";
import { parseAsStringEnum, useQueryState } from "nuqs";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import useFilters, { FilterQueryParam } from "@/hooks/use-filters";
import { useAtomValue } from "jotai";
import { customWidgetIdAtom } from "@/containers/sidebar/store";
import { useSession } from "next-auth/react";
import { getAuthHeader } from "@/utils/auth-header";

function useWidgets() {
  const customWidgetId = useAtomValue(customWidgetIdAtom);
  const [indicator, setIndicator] = useQueryState("indicator", {
    defaultValue: "",
  });
  const [visualization, setVisualization] =
    useQueryState<WidgetVisualizationsType>(
      "visualization",
      parseAsStringEnum<WidgetVisualizationsType>(VALID_WIDGET_VISUALIZATIONS),
    );
  const { filters, setFilters, addFilter, removeFilterValue } = useFilters();
  const { data: session } = useSession();
  const getCustomWidgetQuery = client.users.findCustomWidget.useQuery(
    queryKeys.users.userChart(session?.user.id as string).queryKey,
    {
      params: {
        id: customWidgetId!,
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
  let params = {
    indicator,
    visualization,
    filters,
  };
  let enableGetWidgetQuery = !customWidgetId && !!indicator;

  if (getCustomWidgetQuery.data) {
    // TODO: this needs to be getCustomWidgetQuery.data.widget.indicator;
    params.indicator = "sector";
    params.visualization = getCustomWidgetQuery.data.defaultVisualization;

    if (getCustomWidgetQuery.data.filters.length > 0) {
      params.filters = mergeFilters(filters, getCustomWidgetQuery.data.filters);
    }

    enableGetWidgetQuery = true;
  }

  if (indicator) {
    params.indicator = indicator;
  }

  if (visualization) {
    params.visualization = visualization;
  }

  const getWidgetQuery = client.widgets.getWidget.useQuery(
    queryKeys.widgets.one(params.indicator, params.filters).queryKey,
    {
      params: { id: params.indicator },
      query: {
        filters: params.filters,
      },
    },
    { enabled: enableGetWidgetQuery, select: (res) => res.body.data },
  );

  return {
    indicator: params.indicator,
    visualization: params.visualization,
    filters: params.filters,
    widget: getWidgetQuery.data,
    setIndicator,
    setVisualization,
    setFilters,
    addFilter,
    removeFilterValue,
  };
}

function mergeFilters(
  arr1: FilterQueryParam[],
  arr2: FilterQueryParam[],
): FilterQueryParam[] {
  const map = new Map(arr1.map((filter) => [filter.name, filter]));

  arr2.forEach((filter) => {
    if (map.has(filter.name)) {
      map.set(filter.name, { ...map.get(filter.name), ...filter });
    } else {
      map.set(filter.name, filter);
    }
  });

  return Array.from(map.values());
}

export default useWidgets;
