/**
 * Represents an array of widget data objects.
 */
export type WidgetData = Array<{
  /** The numeric value associated with the widget answer, with or without applied filters */
  value: number;

  /** The numeric value associated with the widget answer without any filters */
  total: number;

  /**
   * A descriptive label for the widget answer.
   * Can be null if no label is provided.
   */
  label: string | null;
}>;

type Scale = 1 | 2 | 3 | 4 | 5;

export interface MapData {
  [key: string]: Scale;
}
