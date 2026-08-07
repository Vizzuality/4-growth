import { FC, useEffect, useMemo } from "react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { getSettingsFilters } from "@/lib/utils";

import useSettings from "@/hooks/use-settings";

import {
  isBubbleChartSettings,
  isSimpleChartSettings,
} from "@/containers/sidebar/projections-settings/utils";
import BubbleSelect from "@/containers/sidebar/projections-sidebar/sandbox-settings/bubble-select";
import ColorSelect from "@/containers/sidebar/projections-sidebar/sandbox-settings/color-select";
import HorizontalSelect from "@/containers/sidebar/projections-sidebar/sandbox-settings/horizontal-select";
import SizeSelect from "@/containers/sidebar/projections-sidebar/sandbox-settings/size-select";
import VerticalSelect from "@/containers/sidebar/projections-sidebar/sandbox-settings/vertical-select";
import VisualizationSelect from "@/containers/sidebar/projections-sidebar/sandbox-settings/visualization-select";
import OthersSelect from "@/containers/sidebar/projections-sidebar/sandbox-settings/others-select";

const SandboxSettings: FC = () => {
  const { settings, othersAggregation, setOthersAggregation } = useSettings();
  const { data } = client.projections.getCustomProjectionSettings.useQuery(
    queryKeys.projections.settings(getSettingsFilters(settings)).queryKey,
    {
      query: {
        filters: getSettingsFilters(settings),
      },
    },
    { select: (res) => res.body.data },
  );
  const showSimpleChartSettings: boolean = useMemo(
    () => isSimpleChartSettings(settings),
    [settings],
  );
  const showBubbleChartSettings: boolean = useMemo(
    () => isBubbleChartSettings(settings),
    [settings],
  );

  useEffect(() => {
    if (!data?.othersAggregation && othersAggregation) {
      setOthersAggregation(null);
    }
  }, [data?.othersAggregation, othersAggregation, setOthersAggregation]);

  return (
    <>
      <VisualizationSelect options={data?.availableVisualizations || []} />
      {showSimpleChartSettings ? (
        <>
          <VerticalSelect options={data?.line_chart.vertical || []} />
          {!(settings && "table" in settings) && (
            <ColorSelect options={data?.line_chart.color || []} />
          )}
          {!!data?.othersAggregation && (
            <OthersSelect options={data?.othersAggregation} />
          )}
        </>
      ) : showBubbleChartSettings ? (
        <>
          <BubbleSelect options={data?.bubble_chart.bubble || []} />
          <VerticalSelect options={data?.bubble_chart.vertical || []} />
          <HorizontalSelect options={data?.bubble_chart.horizontal || []} />
          <ColorSelect options={data?.bubble_chart.color || []} />
          <SizeSelect options={data?.bubble_chart.size || []} />
          {!!data?.othersAggregation && (
            <OthersSelect options={data?.othersAggregation} />
          )}
        </>
      ) : null}
    </>
  );
};

export default SandboxSettings;
