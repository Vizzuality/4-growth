/**
 * Represents an array of widget data objects.
 */
export type WidgetData = Array<{
  /**
   * Unique identifier
   */
  id: number;

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
