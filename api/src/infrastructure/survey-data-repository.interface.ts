import { SectionWithDataWidget } from '@shared/dto/sections/section.entity';
import { WidgetDataFilter } from '@shared/dto/widgets/widget-data-filter';
export interface ISurveyDataRepository {
  addSurveyDataToSections(
    sections: SectionWithDataWidget[],
    filters?: WidgetDataFilter[],
  ): Promise<any>;
}
