import { AGRICULTURE_ONLY_INDICATORS } from "@/lib/constants";
import { isEmptyWidget } from "@/lib/utils";

import { FilterQueryParam, includesAutomatedSource } from "@/hooks/use-filters";

import { TransformedWidget } from "@/types";

export function getVisibleWidgets(
  widgets: TransformedWidget[],
  filters: FilterQueryParam[],
): TransformedWidget[] {
  if (!includesAutomatedSource(filters)) return widgets;

  return widgets.filter(
    (widget) =>
      !AGRICULTURE_ONLY_INDICATORS.includes(widget.indicator) &&
      !isEmptyWidget(widget.data.raw),
  );
}
