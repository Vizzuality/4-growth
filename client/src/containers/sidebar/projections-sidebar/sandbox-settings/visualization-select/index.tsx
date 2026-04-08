import { FC, useMemo } from "react";

import { CustomProjectionSettingsType } from "@shared/dto/projections/custom-projection-settings";

import useSettings from "@/hooks/use-settings";

import { VISUALIZATION_TO_LABEL_MAP } from "@/containers/sidebar/projections-settings/constants";
import ProjectionsSettingsPopup from "@/containers/sidebar/projections-settings/projection-settings-popup";
import { getSelectedVisualizationOption } from "@/containers/sidebar/projections-settings/utils";

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
