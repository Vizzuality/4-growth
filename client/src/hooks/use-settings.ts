import { useMemo, useCallback } from "react";

import {
  CHART_ATTRIBUTES,
  CHART_INDICATORS,
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
              [visualization]: {
                vertical: CHART_INDICATORS[0],
                color: CHART_ATTRIBUTES[0],
              },
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
                bubble: CHART_ATTRIBUTES[0],
                vertical: CHART_INDICATORS[0],
                horizontal: CHART_INDICATORS[1],
                color: CHART_ATTRIBUTES[1],
                size: CHART_INDICATORS[0],
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
        if ("line_chart" in settings) {
          setSettings({
            line_chart: {
              ...settings.line_chart,
              [key]: value,
            },
          });
        } else if ("bar_chart" in settings) {
          setSettings({
            bar_chart: {
              ...settings.bar_chart,
              [key]: value,
            },
          });
        }
      }

      if (isBubbleChartSettings(settings)) {
        setSettings({
          ["chart"]: { ...settings.bubble_chart, [key]: value },
        });
      }
    },
    [settings, setSettings],
  );

  const setBubbleChartAttribute = useCallback(
    (key: string, value: string) => {
      if (isBubbleChartSettings(settings)) {
        setSettings({
          ["chart"]: { ...settings.bubble_chart, [key]: value },
        });
      }
    },
    [settings, setSettings],
  );

  const setChartAttribute = useCallback(
    (key: string, value: string) => {
      if (isBubbleChartSettings(settings)) {
        setSettings({
          ["chart"]: { ...settings.bubble_chart, [key]: value },
        });
      }

      if (isSimpleChartSettings(settings)) {
        if ("line_chart" in settings) {
          setSettings({
            line_chart: { ...settings.line_chart, [key]: value },
          });
        } else if ("bar_chart" in settings) {
          setSettings({
            bar_chart: { ...settings.bar_chart, [key]: value },
          });
        }
      }
    },
    [settings, setSettings],
  );

  return {
    settings,
    setVisualization,
    setBubbleChartIndicator,
    setBubbleChartAttribute,
    setChartAttribute,
  };
}

export default useSettings;
