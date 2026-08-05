import { FC } from "react";

import { WidgetSourceSplit } from "@shared/dto/widgets/base-widget-data.interface";

import { getDataSourceOptionLabel } from "@/lib/constants";

import Title from "@/components/ui/title";

interface SingleValueBySourceProps {
  title: string;
  data?: WidgetSourceSplit;
}

/**
 * Deliberately laid out as separate figures rather than a sum or a stacked bar:
 * these are distinct counts, so the same country can appear under both sources
 * and the panels are not additive.
 */
const SingleValueBySource: FC<SingleValueBySourceProps> = ({ title, data }) => {
  if (!data || data.length === 0) {
    console.error(
      `SingleValueBySource - ${title}: Expected at least 1 source, but received 0.`,
    );
    return null;
  }

  return (
    <div className="relative h-full">
      <div className="relative z-10 space-y-6 p-6">
        <Title as="h3" className="text-base">
          {title}
        </Title>
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          {data.map(({ source, data: sourceData }) => (
            <div key={`single-value-source-${source}`}>
              <dt className="text-xs text-bluish-gray-500">
                {getDataSourceOptionLabel([source]) ?? source}
              </dt>
              <dd className="text-2xl font-semibold">
                {sourceData.counter?.value ?? 0}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default SingleValueBySource;
