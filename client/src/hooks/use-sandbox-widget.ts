import {
  VALID_WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from "@shared/dto/widgets/widget-visualizations.constants";
import { parseAsStringEnum, useQueryState } from "nuqs";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

function useSandboxWidget() {
  const [indicator, setIndicator] = useQueryState("indicator", {
    defaultValue: "",
  });
  const [visualization, setVisualization] =
    useQueryState<WidgetVisualizationsType>(
      "visualization",
      parseAsStringEnum<WidgetVisualizationsType>(VALID_WIDGET_VISUALIZATIONS),
    );
  const { data } = client.widgets.getWidget.useQuery(
    queryKeys.widgets.one(indicator).queryKey,
    { params: { id: indicator } },
    { enabled: !!indicator, select: (res) => res.body.data },
  );

  return {
    indicator,
    visualization,
    setIndicator,
    setVisualization,
    widget: data,
  };
}

export default useSandboxWidget;
