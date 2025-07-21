import { FC, useMemo } from "react";

import { CustomProjectionSettingsType } from "@shared/dto/projections/custom-projection-settings";
import { CustomProjectionSettingsType as CustomProjectionSettingsTypeSchema } from "@shared/schemas/custom-projection-settings.schema";

import useSettings from "@/hooks/use-settings";

import { VISUALIZATION_TO_LABEL_MAP } from "@/containers/sidebar/projections-settings/constants";
import ProjectionsSettingsPopup from "@/containers/sidebar/projections-settings/projection-settings-popup";

function getSelectedVisualizationOption(
  settings: CustomProjectionSettingsTypeSchema | null,
) {
  if (!settings) return null;

  const key = Object.keys(
    settings,
  )[0] as keyof typeof VISUALIZATION_TO_LABEL_MAP;

  return { label: VISUALIZATION_TO_LABEL_MAP[key], value: key };
}

const VisualizationSelect: FC<{
  options: CustomProjectionSettingsType["availableVisualizations"];
}> = ({ options }) => {
  const { settings, setVisualization } = useSettings();
  const selected = useMemo(
    () => getSelectedVisualizationOption(settings),
    [settings],
  );

  return (
    <ProjectionsSettingsPopup
      name="Visualization"
      selected={selected}
      options={options.map((key) => ({
        label: VISUALIZATION_TO_LABEL_MAP[key],
        value: key,
      }))}
      onItemClick={(v) => setVisualization(v)}
    />
  );
};

export default VisualizationSelect;
