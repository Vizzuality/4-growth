import {
  Section,
  SectionWithDataWidget,
} from '@shared/dto/sections/section.entity';
import { BaseWidgetWithData } from '@shared/dto/widgets/base-widget-data.interface';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { WidgetDataFilter } from '@shared/dto/widgets/widget-data-filter';
export interface ISurveyDataRepository {
  addSurveyDataToSections(
    sections: Partial<Section>[],
    filters?: WidgetDataFilter[],
  ): Promise<SectionWithDataWidget[]>;
  addSurveyDataToBaseWidget(
    widget: BaseWidget,
    filters?: WidgetDataFilter[],
  ): Promise<BaseWidgetWithData>;
}
