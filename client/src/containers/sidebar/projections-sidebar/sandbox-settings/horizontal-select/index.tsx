import { FC, useMemo } from "react";

import { CustomProjectionSettingsType } from "@shared/dto/projections/custom-projection-settings";
import { CustomProjectionSettingsType as CustomProjectionSettingsTypeSchema } from "@shared/schemas/custom-projection-settings.schema";

import useSettings from "@/hooks/use-settings";

import { PROJECTION_TYPE_TO_LABEL_MAP } from "@/containers/sidebar/projections-settings/constants";
import ProjectionsSettingsPopup from "@/containers/sidebar/projections-settings/projection-settings-popup";
import {
  getValues,
  isBubbleChartSettings,
} from "@/containers/sidebar/projections-settings/utils";

function getSelectedHorizontalOption(
  settings: CustomProjectionSettingsTypeSchema | null,
) {
  if (!settings) return null;

  if (isBubbleChartSettings(settings)) {
    const key = getValues(settings)[0]
      .horizontal as keyof typeof PROJECTION_TYPE_TO_LABEL_MAP;
    return { label: PROJECTION_TYPE_TO_LABEL_MAP[key], value: key };
  }

  return null;
}

const HorizontalSelect: FC<{
  options: CustomProjectionSettingsType["bubble_chart"]["horizontal"];
}> = ({ options }) => {
  const { settings, setBubbleChartIndicator } = useSettings();
  const selected = useMemo(
    () => getSelectedHorizontalOption(settings),
    [settings],
  );

  return (
    <ProjectionsSettingsPopup
      name="Horizontal"
      selected={selected}
      options={options.map((key) => ({
        label: key,
        value: key,
      }))}
      onItemClick={(v) => setBubbleChartIndicator("horizontal", v)}
    />
  );
};

export default HorizontalSelect;
