import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';

export interface WidgetData {
  chart?: WidgetChartData;
  breakdown?: WidgetBreakdownData;
  counter?: WidgetCounterData;
  map?: WidgetMapData;
  navigation?: WidgetNavigationData;
  /**
   * Per-source slices, present only when more than one data source is selected.
   * The keys above stay merged across sources, so single-source responses are
   * unchanged. Nested rather than flattened so each source keeps its own total,
   * which is what lets percentages be computed per source.
   */
  bySource?: WidgetSourceSplit;
}

/**
 * No `map` member: comparison always renders as bars, so a per-source map would
 * never be displayed.
 */
export type WidgetSourceData = Pick<WidgetData, 'chart' | 'counter'>;

export type WidgetSourceSplit = Array<{
  source: string;
  data: WidgetSourceData;
}>;

/**
 * Data for maps
 */
export type WidgetMapData = Array<{
  country: string;
  value: number;
}>;

/**
 * Data for barchart, piechart and areagraph
 */
export type WidgetChartData = Array<{
  label: string;
  value: number;
  total: number;
}>;

/**
 * Data for a data breakdown chart
 */
export type WidgetBreakdownData = Array<{
  label: string;
  data: WidgetChartData;
}>;

/**
 * Data for single value
 */
export type WidgetCounterData = {
  value: number;
  total: number;
};

export type WidgetNavigationData = {
  href: string;
};

export class BaseWidgetWithData extends BaseWidget {
  data: WidgetData;
  // TODO: Move this to client type definitions, since it's computed on the frontend side
  responseRate: number;
  absoluteValue: number;
}
