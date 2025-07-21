import { FC, useMemo } from "react";

import { BUBBLE_CHART_INDICATORS } from "@shared/dto/projections/custom-projection-settings";
import { CustomProjectionSettingsType as CustomProjectionSettingsTypeSchema } from "@shared/schemas/custom-projection-settings.schema";

import useSettings from "@/hooks/use-settings";

import { PROJECTION_TYPE_TO_LABEL_MAP } from "@/containers/sidebar/projections-settings/constants";
import ProjectionsSettingsPopup from "@/containers/sidebar/projections-settings/projection-settings-popup";

function getSelectedVerticalOption(
  settings: CustomProjectionSettingsTypeSchema | null,
) {
  if (!settings) return null;

  const key = Object.values(settings)[0]
    .vertical as keyof typeof PROJECTION_TYPE_TO_LABEL_MAP;

  return { label: PROJECTION_TYPE_TO_LABEL_MAP[key], value: key };
}

const VerticalSelect: FC<{
  options: typeof BUBBLE_CHART_INDICATORS;
}> = ({ options }) => {
  const { settings, setBubbleChartIndicator } = useSettings();
  const selected = useMemo(
    () => getSelectedVerticalOption(settings),
    [settings],
  );

  return (
    <ProjectionsSettingsPopup
      name="Vertical"
      selected={selected}
      options={options.map((key) => ({
        label: PROJECTION_TYPE_TO_LABEL_MAP[key],
        value: key,
      }))}
      onItemClick={(v) => setBubbleChartIndicator("vertical", v)}
    />
  );
};

export default VerticalSelect;
