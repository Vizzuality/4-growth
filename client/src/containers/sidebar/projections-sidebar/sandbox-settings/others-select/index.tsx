import ProjectionsSettingsPopup from "@/containers/sidebar/projections-settings/projection-settings-popup";
import useSettings from "@/hooks/use-settings";
import { OTHERS_AGGREGATION_OPTIONS } from "@shared/dto/projections/custom-projection-settings";
import { FC, useMemo } from "react";

const OthersSelect: FC<{ options: typeof OTHERS_AGGREGATION_OPTIONS }> = ({
  options,
}) => {
  const { othersAggregation, setOthersAggregation } = useSettings();
  const selected = useMemo(() => {
    return {
      label:
        OTHERS_AGGREGATION_OPTIONS.find(
          (option) => option.value === othersAggregation,
        )?.label || othersAggregation,
      value: othersAggregation,
    };
  }, [othersAggregation]);

  return (
    <ProjectionsSettingsPopup
      name="Others"
      selected={selected}
      options={options}
      onItemClick={setOthersAggregation}
    />
  );
};

export default OthersSelect;
