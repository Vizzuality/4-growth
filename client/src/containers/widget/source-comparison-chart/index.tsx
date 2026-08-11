"use client";
import { FC, useId, useMemo } from "react";

import { WidgetSourceSplit } from "@shared/dto/widgets/base-widget-data.interface";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { compareAnswerLabels } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";

import NoData from "@/containers/no-data";
import {
  getIndexOfLargestValue,
  getPercentLabelInset,
} from "@/containers/widget/utils";

import { ChartContainer } from "@/components/ui/chart";

const ROW_HEIGHT = 46;
const ROW_GAP = 2;
/** Two bars fill the row height exactly, as they do in the design */
const BAR_SIZE = ROW_HEIGHT / 2;
const PATTERN_SIZE = 48;
/** Matches the 24px inset the design puts before the overlaid text */
const TEXT_INSET = 24;
/** The gap the design leaves between a value and the answer label */
const LABEL_GAP = 12;

interface SourceComparisonChartProps {
  /** Percentage-normalized per source */
  data?: WidgetSourceSplit;
}

type ComparisonRow = {
  label: string;
  value: number;
} & Record<string, number | string>;

const SourceComparisonChart: FC<SourceComparisonChartProps> = ({ data }) => {
  const patternId = useId();
  const sources = useMemo(() => data?.map((s) => s.source) ?? [], [data]);

  const rows = useMemo<ComparisonRow[]>(() => {
    if (!data) return [];

    const byLabel = new Map<string, ComparisonRow>();

    for (const { source, data: sourceData } of data) {
      for (const entry of sourceData.chart ?? []) {
        const row = byLabel.get(entry.label) ?? {
          label: entry.label,
          value: 0,
        };
        row[source] = entry.value;
        byLabel.set(entry.label, row);
      }
    }

    const merged = Array.from(byLabel.values()).map((row) => {
      // A label missing from one source still renders, with that series at zero
      for (const source of sources) row[source] ??= 0;
      // Drives the highlighted row, so leading in either source wins
      row.value = Math.max(...sources.map((s) => Number(row[s])));
      return row;
    });

    // Sorted after the merge rather than per source: a label only the second
    // source has arrives last, and would otherwise sit below the pinned rows
    return merged.sort((a, b) => compareAnswerLabels(a.label, b.label));
  }, [data, sources]);

  if (rows.length === 0 || sources.length === 0) {
    return <NoData />;
  }

  const highestValueIndex = getIndexOfLargestValue(
    rows.map(({ value }) => ({ value })),
  );
  const height = rows.length * (ROW_HEIGHT + ROW_GAP);
  const percentFor = (row: ComparisonRow, source: string) =>
    formatNumber(Number(row[source]));
  const labelInset = getPercentLabelInset(
    rows.flatMap((row) => sources.map((source) => percentFor(row, source))),
    { inset: TEXT_INSET, gap: LABEL_GAP },
  );
  const fillFor = (rowIndex: number) =>
    rowIndex === highestValueIndex
      ? "hsl(var(--accent))"
      : "hsl(var(--secondary))";
  const hatchIdFor = (rowIndex: number) =>
    `${patternId}-${rowIndex === highestValueIndex ? "accent" : "secondary"}`;

  return (
    <ChartContainer
      config={{}}
      className="w-full p-0"
      // Fixed, not min: the rows must stay 46px rather than stretch to the card
      style={{ height: `${height}px`, minHeight: `${height}px` }}
    >
      <BarChart
        height={height}
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        data={rows}
        layout="vertical"
        barGap={0}
        barCategoryGap={ROW_GAP}
        accessibilityLayer
      >
        <defs>
          {(["accent", "secondary"] as const).map((token) => (
            <pattern
              key={token}
              id={`${patternId}-${token}`}
              patternUnits="userSpaceOnUse"
              width={PATTERN_SIZE}
              height={PATTERN_SIZE}
            >
              <rect
                width={PATTERN_SIZE}
                height={PATTERN_SIZE}
                fill={`hsl(var(--${token}))`}
              />
              <image
                href="/images/bar-pattern.png"
                width={PATTERN_SIZE}
                height={PATTERN_SIZE}
                style={{ mixBlendMode: "multiply" }}
              />
            </pattern>
          ))}
        </defs>
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis type="category" dataKey="label" hide />
        {sources.map((source, sourceIndex) => (
          <Bar
            key={`source-bar-${source}`}
            dataKey={source}
            name={source}
            barSize={BAR_SIZE}
            radius={[0, 8, 8, 0]}
            isAnimationActive={false}
            label={
              // Drawn once per row, from the last series, so the text spans
              // both bars the way the design overlays it and paints after
              // every bar rect — SVG order is the only z-order available.
              sourceIndex < sources.length - 1
                ? undefined
                : ({ y, height: barHeight, index }) => {
                    const row = rows[index];
                    const rowTop = y - (sources.length - 1) * barHeight;
                    const centerY = rowTop + (sources.length * barHeight) / 2;

                    return (
                      <g>
                        {sources.map((s, i) => (
                          <text
                            key={`value-${s}`}
                            x={TEXT_INSET}
                            y={centerY + (i === 0 ? -6 : 6)}
                            fill="hsl(var(--foreground))"
                            fontSize={10}
                            fontWeight={900}
                            dominantBaseline="central"
                            style={{ fontVariantNumeric: "tabular-nums" }}
                          >
                            {percentFor(row, s)}%
                          </text>
                        ))}
                        <text
                          x={labelInset}
                          y={centerY}
                          fill="hsl(var(--foreground))"
                          fontSize={12}
                          fontWeight={500}
                          dominantBaseline="central"
                        >
                          {row.label}
                        </text>
                      </g>
                    );
                  }
            }
          >
            {rows.map((row, rowIndex) => (
              <Cell
                key={`cell-${row.label}`}
                // Sources after the first are hatched, so they stay
                // distinguishable without relying on colour
                fill={
                  sourceIndex > 0
                    ? `url(#${hatchIdFor(rowIndex)})`
                    : fillFor(rowIndex)
                }
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ChartContainer>
  );
};

export default SourceComparisonChart;
