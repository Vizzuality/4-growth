import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';

/**
 * Represents an array of widget data objects.
 */
export type WidgetData = Array<{
  /** The numeric value associated with the widget answer, with or without applied filters */
  value: number;

  /** The numeric value associated with the widget answer without any filters */
  total?: number;

  /**
   * A descriptive label for the widget answer.
   * Can be null if no label is provided.
   */
  label?: string;
}>;

export type WidgetFilters = unknown;

export type WidgetNavigationData = {
  href: string;
};

export class BaseWidgetWithData extends BaseWidget {
  data: WidgetData;
}
