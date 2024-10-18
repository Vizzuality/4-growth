import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';

export interface WidgetData {
  chart?: WidgetChartData;
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
}>;

/**
 * Data for single value
 */
export type WidgetCounterData = {
  value: number;
  total: number;
};

export type WidgetFilters = unknown;

export type WidgetNavigationData = {
  href: string;
};

export class BaseWidgetWithData extends BaseWidget {
  data: WidgetData;
}
