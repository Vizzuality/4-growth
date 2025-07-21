import { FC, useMemo } from "react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

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

const SandboxSettings: FC = () => {
  const { settings } = useSettings();
  const { data } = client.projections.getCustomProjectionSettings.useQuery(
    queryKeys.projections.settings.queryKey,
    {},
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

  return (
    <>
      <VisualizationSelect options={data?.availableVisualizations || []} />
      {showSimpleChartSettings ? (
        <VerticalSelect options={data?.line_chart.vertical || []} />
      ) : showBubbleChartSettings ? (
        <>
          <BubbleSelect options={data?.bubble_chart.bubble || []} />
          <VerticalSelect options={data?.bubble_chart.vertical || []} />
          <HorizontalSelect options={data?.bubble_chart.horizontal || []} />
          <ColorSelect options={data?.bubble_chart.color || []} />
          <SizeSelect options={data?.bubble_chart.size || []} />
        </>
      ) : null}
    </>
  );
};

export default SandboxSettings;
