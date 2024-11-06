import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';

export interface WidgetData {
  chart?: WidgetChartData;
  breakdown?: WidgetBreakdownData;
  counter?: WidgetCounterData;
  map?: WidgetMapData;
  navigation?: WidgetNavigationData;
}

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
}
