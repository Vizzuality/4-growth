import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";

import { BubbleProjection } from "@shared/dto/projections/custom-projection.type";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Label,
  ZAxis,
  Cell,
} from "recharts";

import { CSS_CHART_COLORS, TW_CHART_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import useSettings from "@/hooks/use-settings";

import { BUBBLE_TOOLTIP_LABELS_MAP } from "@/containers/sidebar/projections-settings/constants";
import { isBubbleChartSettings } from "@/containers/sidebar/projections-settings/utils";
import PlaybackBar from "@/containers/widget/bubble-chart/playback-bar";
import {
  BUBBLE_CHART_TICK_INTERVAL,
  CHART_CONTAINER_CLASS_NAME,
} from "@/containers/widget/constants";
import { getBubbleChartProps } from "@/containers/widget/utils";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BubbleChartProps {
  data: BubbleProjection[];
}

const BubbleChart: FC<BubbleChartProps> = ({ data }) => {
  const { settings } = useSettings();
  const { chartData, colors, years, horizontalLabel, verticalLabel } = useMemo(
    () => getBubbleChartProps(data, settings),
    [data, settings],
  );
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentDataSet = useMemo(() => {
    const selectedYear = years[currentTimeIndex];
    return chartData[selectedYear];
  }, [years, chartData, currentTimeIndex]);
  const togglePlaying = useCallback(() => {
    if (currentTimeIndex === years.length - 1 && !isPlaying) {
      setCurrentTimeIndex(0);
    }

    setIsPlaying((prev) => !prev);
  }, [currentTimeIndex, years, isPlaying]);
  const goToTime = useCallback(
    (index: number) => {
      if (isPlaying) {
        togglePlaying();
      }

      setCurrentTimeIndex(index);
    },
    [isPlaying, togglePlaying],
  );

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTimeIndex((prevIndex) => {
        if (prevIndex >= years.length - 1) {
          setIsPlaying(false);
          return prevIndex;
        }

        return prevIndex + 1;
      });
    }, BUBBLE_CHART_TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [isPlaying, years]);

  return (
    <>
      <div className="flex items-center justify-center gap-6 pl-6">
        {colors.map((color, index) => (
          <p
            key={`bubble-chart-legend-${color}`}
            className="flex items-center gap-x-1 text-xs"
          >
            <span
              className={cn(
                "block h-3 w-3 rounded-full",
                TW_CHART_COLORS[index],
              )}
            ></span>
            <span>{color}</span>
          </p>
        ))}
      </div>
      <ChartContainer
        config={{}}
        className={cn(CHART_CONTAINER_CLASS_NAME, "aspect-auto h-full")}
      >
        <ScatterChart
          margin={{
            top: 40,
            right: 40,
            bottom: 40,
            left: 40,
          }}
        >
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                className="rounded-2xl border-none px-4 py-2 [&>*:nth-child(2)]:hidden"
                formatter={() => null}
                labelFormatter={(_, data) => (
                  <dl className="grid max-w-xs grid-cols-2 gap-2 text-xs">
                    <dt className="flex justify-end">Year</dt>
                    <dd className="font-bold">2020</dd>
                    {isBubbleChartSettings(settings)
                      ? Object.entries(settings.bubble_chart).map(
                          ([valueKey, settingsKey]) => (
                            <Fragment
                              key={`tooltip-item-${valueKey}-${settingsKey}`}
                            >
                              <dt className="flex justify-end">
                                {BUBBLE_TOOLTIP_LABELS_MAP[settingsKey]}
                              </dt>
                              <dd className="font-bold">
                                {data[0].payload[valueKey]}
                              </dd>
                            </Fragment>
                          ),
                        )
                      : null}
                  </dl>
                )}
              />
            }
          />
          <XAxis
            type="number"
            dataKey="horizontal"
            label={
              <Label
                value={horizontalLabel}
                dy={30}
                fill="hsl(var(--foreground))"
                fontWeight={700}
              />
            }
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="number"
            dataKey="vertical"
            label={
              <Label
                value={verticalLabel}
                position="top"
                dy={-10}
                fill="hsl(var(--foreground))"
                fontWeight={700}
              />
            }
            axisLine={false}
            tickLine={false}
          />
          <ZAxis type="number" dataKey="size" name="Size" range={[50, 5000]} />
          <Scatter data={currentDataSet}>
            {currentDataSet.map((_, index) => (
              <Cell key={index} fill={CSS_CHART_COLORS[index]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>
      <PlaybackBar
        timeMarkers={years}
        isPlaying={isPlaying}
        onPlayButtonClick={togglePlaying}
        currentIndex={currentTimeIndex}
        onTimeMarkerClick={goToTime}
      />
    </>
  );
};

export default BubbleChart;
