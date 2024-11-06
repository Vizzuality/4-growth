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

const getSupportedVisualizations = (widget: BaseWidgetWithData) => {
  let supportsChart = false;
  let supportsMap = false;
  // No generic implementation for single value widgets for the time being
  // let supportsSingleValue = false;
  // No generic implementation navigation widgets for the time being
  // let supportsNavigation = false;

  const visualizationModes = widget.visualisations;
  for (let idx = 0; idx < visualizationModes.length; idx++) {
    const visualizationMode = visualizationModes[idx];

    if (
      visualizationMode === WIDGET_VISUALIZATIONS.AREA_GRAPH ||
      visualizationMode === WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART ||
      visualizationMode === WIDGET_VISUALIZATIONS.PIE_CHART
    ) {
      supportsChart = true;
    } else if (visualizationMode === WIDGET_VISUALIZATIONS.MAP) {
      supportsMap = true;
    }
  }

  return [supportsChart, supportsMap];
};

export const WidgetUtils = {
  isValidVisualization,
  isValidDefaultVisualization,
  getSupportedVisualizations,
};
