import {
  AGRICULTURE_ONLY_INDICATORS,
  OVERVIEW_SECTION_ORDER,
} from "@/lib/constants";
import { isEmptyWidget } from "@/lib/utils";

import { FilterQueryParam, includesAutomatedSource } from "@/hooks/use-filters";

import { TransformedSection, TransformedWidget } from "@/types";

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

/**
 * The overview section is excluded because it renders its widgets without
 * consulting `getVisibleWidgets`, so it can never end up with nothing to show.
 */
export function getEmptySectionSlugs(
  sections: TransformedSection[],
  filters: FilterQueryParam[],
): Set<string> {
  if (!includesAutomatedSource(filters)) return new Set();

  return new Set(
    sections
      .filter(
        (section) =>
          section.order !== OVERVIEW_SECTION_ORDER &&
          getVisibleWidgets(section.baseWidgets ?? [], filters).length === 0,
      )
      .map((section) => section.slug),
  );
}
