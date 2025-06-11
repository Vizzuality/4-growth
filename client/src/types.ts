import { WidgetData } from "@shared/dto/widgets/base-widget-data.interface";

export interface TransformedWidgetData {
  raw: WidgetData;
  percentages: WidgetData;
}
