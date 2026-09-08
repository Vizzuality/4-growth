"use client";

import { FC, useCallback, useRef, useState } from "react";

import { CountryISOMap } from "@shared/constants/country-iso.map";
import { WidgetMapData } from "@shared/dto/widgets/base-widget-data.interface";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { cn, formatNumber } from "@/lib/utils";

import NoData from "@/containers/no-data";
import {
  BG_MAP,
  FILL_MAP,
  MapEntry,
  transformMapData,
} from "@/containers/widget/map/map.utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MapProps {
  data?: WidgetMapData;
}

interface HoveredCountry {
  iso: string;
  entry: MapEntry;
  x: number;
  y: number;
}

const countryLabel = (iso: string) =>
  CountryISOMap.getCountryNameByISO3(iso) ?? iso;

const Map: FC<MapProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<HoveredCountry | null>(null);

  const handleEnter = useCallback(
    (iso: string, entry: MapEntry, event: React.MouseEvent) => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;

      setHovered({
        iso,
        entry,
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
    },
    [],
  );

  const clearHovered = useCallback(() => setHovered(null), []);

  if (!data || data?.length === 0) return <NoData />;

  const map = transformMapData(data);

  return (
    // The popper wrapper is a fixed box placed just above the cursor it is
    // anchored to, and it accepts pointer events. Moving the pointer upward
    // crosses into it, which fires mouseleave on the country and closes the
    // tooltip; the mouseover that follows produces no React mouseEnter, so it
    // never reopens. Removing this rule reintroduces that.
    <div
      ref={containerRef}
      className="relative h-full [&_[data-radix-popper-content-wrapper]]:pointer-events-none"
    >
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
              const iso = geo.properties.ADM0_A3;
              const entry = map[iso];

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  stroke={"rgb(1 1 1 / var(--tw-bg-opacity))"}
                  strokeWidth="1.0"
                  onMouseEnter={
                    entry === undefined
                      ? undefined
                      : (event: React.MouseEvent) =>
                          handleEnter(iso, entry, event)
                  }
                  onMouseLeave={entry === undefined ? undefined : clearHovered}
                  className={cn(
                    "focus:outline-none",
                    entry !== undefined
                      ? FILL_MAP[entry.scale]
                      : "fill-navy-900",
                  )}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <TooltipProvider disableHoverableContent>
        <Tooltip open={hovered !== null}>
          <TooltipTrigger asChild>
            <span
              key={hovered?.iso}
              aria-hidden
              className="pointer-events-none absolute h-0 w-0"
              style={{ left: hovered?.x ?? 0, top: hovered?.y ?? 0 }}
            />
          </TooltipTrigger>
          {hovered !== null && (
            <TooltipContent
              side="top"
              sideOffset={8}
              className="rounded-md border-none bg-background px-3 py-2 text-xs text-foreground"
            >
              <p className="font-medium">{countryLabel(hovered.iso)}</p>
              {hovered.entry.total === null || hovered.entry.count === null ? (
                <p className="text-bluish-gray-500">
                  No responses for this question
                </p>
              ) : (
                <p className="text-bluish-gray-500">
                  {formatNumber(hovered.entry.value ?? 0, {
                    maximumFractionDigits: 0,
                  })}
                  % &middot; {formatNumber(hovered.entry.count)} of{" "}
                  {formatNumber(hovered.entry.total)} responses
                </p>
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

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
            {Number(n) === 1 && <p className="text-background">0%</p>}
            {Number(n) === 5 && <p className="text-foreground">100%</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Map;
