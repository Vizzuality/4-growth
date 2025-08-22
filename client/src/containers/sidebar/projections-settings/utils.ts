import { CustomProjectionSettingsType } from "@shared/schemas/custom-projection-settings.schema";

type SimpleChartSettings = { vertical: string; color: string };
type BubbleChartSettings = {
  vertical: string;
  bubble: string;
  horizontal: string;
  color: string;
  size: string;
};

export function isSimpleChartSettings(
  settings: CustomProjectionSettingsType | null | undefined,
): settings is
  | { line_chart: SimpleChartSettings }
  | { bar_chart: SimpleChartSettings } {
  return (
    !!settings &&
    typeof settings === "object" &&
    ("line_chart" in settings || "bar_chart" in settings)
  );
}

export function isBubbleChartSettings(
  settings: CustomProjectionSettingsType | null | undefined,
): settings is { bubble_chart: BubbleChartSettings } {
  return (
    !!settings && typeof settings === "object" && "bubble_chart" in settings
  );
}

export function getKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function getValues<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][];
}
