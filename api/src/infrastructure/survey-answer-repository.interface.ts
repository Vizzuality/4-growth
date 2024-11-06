import {
  Section,
  SectionWithDataWidget,
} from '@shared/dto/sections/section.entity';
import { SurveyAnswer } from '@shared/dto/surveys/survey-answer.entity';
import { BaseWidgetWithData } from '@shared/dto/widgets/base-widget-data.interface';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { WidgetDataFilter } from '@shared/dto/widgets/widget-data-filter';
import { Repository } from 'typeorm';

export const SurveyAnswerRepository = Symbol('ISurveyAnswerRepository');

export interface ISurveyAnswerRepository extends Repository<SurveyAnswer> {
  addSurveyDataToSections(
    sections: Partial<Section>[],
    filters?: WidgetDataFilter[],
  ): Promise<SectionWithDataWidget[]>;
  addSurveyDataToBaseWidget(
    widget: BaseWidget,
    params: { filters?: WidgetDataFilter[]; breakdownIndicator?: string },
  ): Promise<BaseWidgetWithData>;
}
