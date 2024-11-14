import { FC } from "react";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { WidgetMapData } from "@shared/dto/widgets/base-widget-data.interface";

import { cn } from "@/lib/utils";

import NoData from "@/containers/no-data";
import {
  BG_MAP,
  FILL_MAP,
  transformMapData,
} from "@/containers/widget/map/map.utils";

interface MapProps {
  data?: WidgetMapData;
}

const Map: FC<MapProps> = ({ data }) => {
  if (!data || data?.length === 0) return <NoData />;

  const map = transformMapData(data);

  return (
    <div className="relative h-full">
      <ComposableMap
        className="h-full w-full"
        projection="geoMercator"
        projectionConfig={{
          center: [10, 57],
          scale: 450,
        }}
      >
        <Geographies geography="/maps/countries.geojson">
          {({ geographies }) =>
            geographies.map((geo) => {
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  stroke={
                    geo.properties.CONTINENT === "Europe"
                      ? "hsl(var(--background))"
                      : "rgb(29 39 87 / var(--tw-bg-opacity))"
                  }
                  strokeWidth="1.0"
                  className={cn(
                    "fill-map- focus:outline-none",
                    map[geo.properties.ADM0_A3]
                      ? FILL_MAP[map[geo.properties.ADM0_A3]]
                      : "fill-background",
                  )}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="absolute bottom-3 right-6 flex h-5 text-2xs">
        {Object.keys(BG_MAP).map((n) => (
          <div
            key={`color-scale-${n}`}
            className={cn(
              "flex w-10 items-center justify-center p-1",
              BG_MAP[Number(n) as keyof typeof BG_MAP],
              Number(n) === 1 && "rounded-l-full",
              Number(n) === 5 && "rounded-r-full",
            )}
          >
            {Number(n) === 1 && <p className="text-background">Low</p>}
            {Number(n) === 5 && <p className="text-foreground">High</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Map;
