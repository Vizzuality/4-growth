import { WidgetMapData } from "@shared/dto/widgets/base-widget-data.interface";

type MapScale = 1 | 2 | 3 | 4 | 5;

interface MapData {
  [key: string]: MapScale;
}

const FILL_MAP = {
  1: "fill-map-1",
  2: "fill-map-2",
  3: "fill-map-3",
  4: "fill-map-4",
  5: "fill-map-5",
} as const;

const BG_MAP = {
  1: "bg-map-1",
  2: "bg-map-2",
  3: "bg-map-3",
  4: "bg-map-4",
  5: "bg-map-5",
} as const;

const getScaleFromPercentage = (percentage: number): MapScale => {
  if (percentage <= 20) return 1;
  if (percentage <= 40) return 2;
  if (percentage <= 60) return 3;
  if (percentage <= 80) return 4;
  return 5;
};

const transformMapData = (data: WidgetMapData): MapData => {
  return data.reduce(
    (acc, { country, value }) => ({
      ...acc,
      [country]: getScaleFromPercentage(value),
    }),
    {} as MapData,
  );
};

export { FILL_MAP, BG_MAP, getScaleFromPercentage, transformMapData };
