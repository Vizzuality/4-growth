import {
  VALID_WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from "@shared/dto/widgets/widget-visualizations.constants";
import { parseAsStringEnum, useQueryState } from "nuqs";

import { normalizeWidgetData } from "@/lib/normalize-widget-data";
import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import useFilters from "@/hooks/use-filters";

function useSandboxWidget() {
  const [breakdown] = useQueryState("breakdown");
  const [indicator, setIndicator] = useQueryState("indicator", {
    defaultValue: "",
  });
  const [visualization, setVisualization] =
    useQueryState<WidgetVisualizationsType>(
      "visualization",
      parseAsStringEnum<WidgetVisualizationsType>(VALID_WIDGET_VISUALIZATIONS),
    );
  const { filters } = useFilters();
  const { data } = client.widgets.getWidget.useQuery(
    queryKeys.widgets.one(indicator, filters, breakdown || undefined).queryKey,
    {
      params: { id: indicator },
      query: {
        filters,
        breakdown: breakdown || undefined,
      },
    },
    {
      enabled: !!indicator,
      select: (res) => ({
        ...res.body.data,
        data: normalizeWidgetData(res.body.data.data),
      }),
    },
  );

  return {
    indicator,
    visualization,
    breakdown,
    setIndicator,
    setVisualization,
    widget: data,
  };
}

export default useSandboxWidget;
