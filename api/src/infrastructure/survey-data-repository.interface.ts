import { Section } from '@shared/dto/sections/section.entity';
import { WidgetDataFilter } from '@shared/dto/widgets/widget-data-filter';
export interface ISurveyDataRepository {
  addSurveyDataToSections(
    sections: Section[],
    filters?: WidgetDataFilter[],
  ): Promise<any>;
}
