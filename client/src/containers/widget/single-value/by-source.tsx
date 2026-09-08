import { FC } from "react";

import { WidgetSourceSplit } from "@shared/dto/widgets/base-widget-data.interface";

import { DATA_SOURCE_SHORT_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { barWidthPercentage } from "@/containers/widget/single-value/utils";

import Title from "@/components/ui/title";

interface SingleValueBySourceProps {
  title: string;
  data?: WidgetSourceSplit;
  fill?: "bg-secondary" | "bg-accent";
}

/**
 * Deliberately laid out as separate figures rather than a sum or a stacked bar:
 * these are distinct counts, so the same country can appear under both sources
 * and the panels are not additive.
 */
const SingleValueBySource: FC<SingleValueBySourceProps> = ({
  title,
  data,
  fill = "bg-secondary",
}) => {
  if (!data || data.length === 0) {
    console.error(
      `SingleValueBySource - ${title}: Expected at least 1 source, but received 0.`,
    );
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <Title as="h3" className="p-6 text-base">
        {title}
      </Title>
      <dl className="mt-auto pb-6">
        {data.map(({ source, data: sourceData }, index) => {
          const value = sourceData.counter?.value ?? 0;

          return (
            <div
              key={`single-value-source-${source}`}
              className="relative isolate flex h-[78px] items-center"
            >
              <dt className="order-last pr-6 text-base">
                {DATA_SOURCE_SHORT_LABELS[source] ?? source}
              </dt>
              <dd className="min-w-max pl-6 pr-2 text-[40px] font-semibold leading-none text-foreground">
                {/* The label sits beside the figure, not at the bar's edge, so the
                    bar has to be its own layer rather than the text's container */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 left-0 -z-10 rounded-r-lg",
                    fill,
                    index > 0 &&
                      "bg-[url('/images/bar-pattern.png')] bg-[length:48px_48px] bg-repeat bg-blend-multiply",
                  )}
                  style={{
                    width: `${barWidthPercentage(value, sourceData.counter?.total ?? 0)}%`,
                  }}
                />
                {value}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

export default SingleValueBySource;
