import {
  CHART_INDICATORS,
  CHART_ATTRIBUTES,
} from '@shared/dto/projections/custom-projection-settings';
import { PROJECTION_VISUALIZATIONS } from '@shared/dto/projections/projection-visualizations.constants';
import { z } from 'zod';

const IndicatorValue = z
  .string()
  .refine(
    (val) => !!CHART_INDICATORS.find((indicator) => indicator.value === val),
    {
      message: 'Invalid indicator value',
    },
  );
const AttributeValue = z
  .string()
  .refine(
    (val) => !!CHART_ATTRIBUTES.find((attribute) => attribute.value === val),
    {
      message: 'Invalid attribute value',
    },
  );

const SimpleVisualizationSchema = z.object({
  vertical: IndicatorValue,
  color: AttributeValue,
});

const BubbleChartSchema = z.object({
  bubble: AttributeValue,
  vertical: IndicatorValue,
  horizontal: IndicatorValue,
  color: AttributeValue,
  size: IndicatorValue,
});

export const CustomProjectionSettingsSchema = z.object({
  settings: z.union([
    z.object({
      [PROJECTION_VISUALIZATIONS.LINE_CHART]: SimpleVisualizationSchema,
    }),
    z.object({
      [PROJECTION_VISUALIZATIONS.BAR_CHART]: SimpleVisualizationSchema,
    }),
    z.object({
      [PROJECTION_VISUALIZATIONS.BUBBLE_CHART]: BubbleChartSchema,
    }),
  ]),
});

export type CustomProjectionSettingsSchemaType = z.infer<
  typeof CustomProjectionSettingsSchema
>;

export type CustomProjectionSettingsType =
  CustomProjectionSettingsSchemaType['settings'];
