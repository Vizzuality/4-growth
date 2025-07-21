import { useMemo, useCallback } from "react";

import {
  BUBBLE_CHART_ATTRIBUTES,
  BUBBLE_CHART_INDICATORS,
} from "@shared/dto/projections/custom-projection-settings";
import { ProjectionVisualizationsType } from "@shared/dto/projections/projection-visualizations.constants";
import {
  CustomProjectionSettingsSchema,
  CustomProjectionSettingsType,
} from "@shared/schemas/custom-projection-settings.schema";
import { useQueryState } from "nuqs";
import qs from "qs";

import {
  getKeys,
  isBubbleChartSettings,
  isSimpleChartSettings,
} from "@/containers/sidebar/projections-settings/utils";

function useSettings() {
  const [settingsQuery, setSettingsQuery] = useQueryState("s");
  const settings: CustomProjectionSettingsType | null = useMemo(() => {
    if (!settingsQuery) return null;
    try {
      const parsed = qs.parse(settingsQuery);
      if (!parsed.settings) return null;
      const result = CustomProjectionSettingsSchema.safeParse({
        settings: parsed.settings,
      });
      if (!result.success) {
        console.error("Invalid settings:", result.error);
        return null;
      }
      return result.data.settings;
    } catch (error) {
      console.error("Error parsing settings:", error);
      return null;
    }
  }, [settingsQuery]);

  const setSettings = useCallback(
    (newSettings: object) => {
      const stringified = qs.stringify(
        { settings: newSettings },
        { encode: false },
      );
      setSettingsQuery(stringified);
    },
    [setSettingsQuery],
  );

  const setVisualization = useCallback(
    (visualization: ProjectionVisualizationsType) => {
      switch (visualization) {
        case "area_chart":
        case "bar_chart":
        case "line_chart":
          if (isSimpleChartSettings(settings)) {
            const currentVisualization: ProjectionVisualizationsType =
              getKeys(settings)[0];
            const currentValue = settings[currentVisualization];

            if (currentValue) {
              setSettings({
                [visualization]: currentValue,
              });
            }
          } else {
            setSettings({
              [visualization]: { vertical: BUBBLE_CHART_INDICATORS[0] },
            });
          }
          break;
        case "bubble_chart":
          if (isBubbleChartSettings(settings)) {
            const currentVisualization: ProjectionVisualizationsType =
              getKeys(settings)[0];
            const currentValue = settings[currentVisualization];

            if (currentValue) {
              setSettings({
                [visualization]: currentValue,
              });
            }
          } else {
            setSettings({
              [visualization]: {
                bubble: BUBBLE_CHART_ATTRIBUTES[0],
                vertical: BUBBLE_CHART_INDICATORS[0],
                horizontal: BUBBLE_CHART_INDICATORS[1],
                color: BUBBLE_CHART_ATTRIBUTES[1],
                size: BUBBLE_CHART_INDICATORS[0],
              },
            });
          }
          break;
      }
    },
    [settings, setSettings],
  );

  const setBubbleChartIndicator = useCallback(
    (key: string, value: string) => {
      if (isSimpleChartSettings(settings)) {
        const currentKey = getKeys(settings)[0];
        setSettings({
          ...settings,
          [currentKey]: {
            [key]: value,
          },
        });
      }

      if (isBubbleChartSettings(settings)) {
        setSettings({
          ["bubble_chart"]: { ...settings.bubble_chart, [key]: value },
        });
      }
    },
    [settings, setSettings],
  );

  const setBubbleChartAttribute = useCallback(
    (key: string, value: string) => {
      if (isBubbleChartSettings(settings)) {
        setSettings({
          ["bubble_chart"]: { ...settings.bubble_chart, [key]: value },
        });
      }
    },
    [settings, setSettings],
  );

  return {
    settings,
    setVisualization,
    setBubbleChartIndicator,
    setBubbleChartAttribute,
  };
}

export default useSettings;
