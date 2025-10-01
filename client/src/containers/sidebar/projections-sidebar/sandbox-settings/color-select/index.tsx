import { FC, useMemo } from "react";

import { CustomProjectionSettingsType } from "@shared/dto/projections/custom-projection-settings";
import { CustomProjectionSettingsType as CustomProjectionSettingsTypeSchema } from "@shared/schemas/custom-projection-settings.schema";

import useSettings from "@/hooks/use-settings";

import { BUBBLE_CHART_ATTRIBUTE_TO_LABEL_MAP } from "@/containers/sidebar/projections-settings/constants";
import ProjectionsSettingsPopup from "@/containers/sidebar/projections-settings/projection-settings-popup";

function getSelectedColorOption(
  settings: CustomProjectionSettingsTypeSchema | null,
) {
  if (!settings) return null;

  const key = Object.values(settings)[0]
    .color as keyof typeof BUBBLE_CHART_ATTRIBUTE_TO_LABEL_MAP;

  return { label: BUBBLE_CHART_ATTRIBUTE_TO_LABEL_MAP[key], value: key };
}

const ColorSelect: FC<{
  options: CustomProjectionSettingsType["bubble_chart"]["color"];
}> = ({ options }) => {
  const { settings, setChartAttribute } = useSettings();
  const selected = useMemo(() => getSelectedColorOption(settings), [settings]);

  return (
    <ProjectionsSettingsPopup
      name="Color"
      selected={selected}
      options={options}
      onItemClick={(v) => setChartAttribute("color", v)}
    />
  );
};

export default ColorSelect;
