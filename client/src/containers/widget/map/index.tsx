import { FC } from "react";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { cn } from "@/lib/utils";

import { MapData } from "@/types";

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
                    data[geo.properties.ADM0_A3]
                      ? FILL_MAP[data[geo.properties.ADM0_A3]]
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
