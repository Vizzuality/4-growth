import { BaseWidgetWithData } from '@shared/dto/widgets/base-widget-data.interface';
import {
  VALID_WIDGET_VISUALIZATIONS,
  WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from '@shared/dto/widgets/widget-visualizations.constants';

const isValidVisualization = (
  visualization: string,
): visualization is WidgetVisualizationsType => {
  return VALID_WIDGET_VISUALIZATIONS.includes(
    visualization as WidgetVisualizationsType,
  );
};

const isValidDefaultVisualization = (
  visualization: string,
  validDefaultVisualizations: WidgetVisualizationsType[],
): visualization is WidgetVisualizationsType => {
  return validDefaultVisualizations.includes(
    visualization as WidgetVisualizationsType,
  );
};

const getSupportedVisualizations = (widget: BaseWidgetWithData) => ({
  supportsChart: widget.visualisations.some((v) =>
    (
      [
        WIDGET_VISUALIZATIONS.AREA_GRAPH,
        WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
        WIDGET_VISUALIZATIONS.PIE_CHART,
      ] as WidgetVisualizationsType[]
    ).includes(v),
  ),
  supportsSingleValue: widget.visualisations.includes(
    WIDGET_VISUALIZATIONS.SINGLE_VALUE,
  ),
  supportsMap: widget.visualisations.includes(WIDGET_VISUALIZATIONS.MAP),
  supportsNavigation: widget.visualisations.includes(
    WIDGET_VISUALIZATIONS.NAVIGATION,
  ),
});

export const WidgetUtils = {
  isValidVisualization,
  isValidDefaultVisualization,
  getSupportedVisualizations,
};
