import { FC } from "react";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { cn } from "@/lib/utils";

import { MapData } from "@/types";

const COLOR_MAP = {
  1: "hsl(var(--map-1))",
  2: "hsl(var(--map-2))",
  3: "hsl(var(--map-3))",
  4: "hsl(var(--map-4))",
  5: "hsl(var(--map-5))",
} as const;

interface MapProps {
  indicator: string;
  question: string;
  data: MapData;
}

const Map: FC<MapProps> = ({ indicator, question, data }) => {
  return (
    <div className="relative h-full">
      <div className="absolute left-6 top-6 space-y-2">
        <h3 className="text-base font-semibold">{indicator}</h3>
        <p className="text-xs text-muted-foreground">{question}</p>
      </div>

      <ComposableMap
        style={{ height: "100%" }}
        projection="geoMercator"
        projectionConfig={{
          center: [10, 57],
          scale: 480,
        }}
      >
        <Geographies geography="/maps/europe.geojson">
          {({ geographies }) =>
            geographies.map((geo) => {
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                    data[geo.properties.ISO_A2_EH]
                      ? COLOR_MAP[data[geo.properties.ISO_A2_EH]]
                      : "hsl(var(--background))"
                  }
                  stroke={
                    geo.properties.CONTINENT === "Europe"
                      ? "hsl(var(--background))"
                      : "rgb(29 39 87 / var(--tw-bg-opacity))"
                  }
                  strokeWidth="1.0"
                  className="focus:outline-none"
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="absolute bottom-3 right-6 flex h-5 text-2xs">
        {Object.keys(COLOR_MAP).map((k) => (
          <div
            key={`color-scale-${k}`}
            className={cn(
              "flex w-10 justify-center p-1",
              Number(k) === 1 && "rounded-l-full",
              Number(k) === 5 && "rounded-r-full",
            )}
            style={{
              backgroundColor: COLOR_MAP[Number(k) as keyof typeof COLOR_MAP],
            }}
          >
            {Number(k) === 1 && <p className="text-background">Low</p>}
            {Number(k) === 5 && <p className="text-foreground">High</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Map;
