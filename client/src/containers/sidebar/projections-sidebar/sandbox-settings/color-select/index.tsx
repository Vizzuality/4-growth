import { FC, useMemo } from "react";

import { CustomProjectionSettingsType } from "@shared/dto/projections/custom-projection-settings";
import { CustomProjectionSettingsType as CustomProjectionSettingsTypeSchema } from "@shared/schemas/custom-projection-settings.schema";

import useSettings from "@/hooks/use-settings";

import { BUBBLE_CHART_ATTRIBUTE_TO_LABEL_MAP } from "@/containers/sidebar/projections-settings/constants";
import ProjectionsSettingsPopup from "@/containers/sidebar/projections-settings/projection-settings-popup";
import {
  getValues,
  isBubbleChartSettings,
} from "@/containers/sidebar/projections-settings/utils";

function getSelectedColorOption(
  settings: CustomProjectionSettingsTypeSchema | null,
) {
  if (!settings) return null;

  if (isBubbleChartSettings(settings)) {
    const key = getValues(settings)[0]
      .color as keyof typeof BUBBLE_CHART_ATTRIBUTE_TO_LABEL_MAP;
    return { label: BUBBLE_CHART_ATTRIBUTE_TO_LABEL_MAP[key], value: key };
  }

  return null;
}

const ColorSelect: FC<{
  options: CustomProjectionSettingsType["bubble_chart"]["color"];
}> = ({ options }) => {
  const { settings, setBubbleChartAttribute } = useSettings();
  const selected = useMemo(() => getSelectedColorOption(settings), [settings]);

  return (
    <ProjectionsSettingsPopup
      name="Color"
      selected={selected}
      options={options.map((key) => ({
        label: key,
        value: key,
      }))}
      onItemClick={(v) => setBubbleChartAttribute("color", v)}
    />
  );
};

export default ColorSelect;
