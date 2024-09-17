import {
  VALID_WIDGET_VISUALIZATIONS,
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

export const WidgetUtils = {
  isValidVisualization,
  isValidDefaultVisualization,
};
