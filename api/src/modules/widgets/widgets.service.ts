import { AppBaseService } from '@api/utils/app-base.service';
import { AppInfoDTO } from '@api/utils/info.dto';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FetchSpecification } from 'nestjs-base-service';
import { WidgetVisualisationFilters } from '@shared/schemas/widget-visualisation-filters.schema';
import { BaseWidgetWithData } from '@shared/dto/widgets/base-widget-data.interface';
import { WidgetDataFiltersSchema } from '@shared/schemas/widget-data-filters.schema';
import {
  ISurveyAnswerRepository,
  SurveyAnswerRepository,
} from '@api/infrastructure/survey-answer-repository.interface';

@Injectable()
export class WidgetsService extends AppBaseService<
  BaseWidget,
  unknown,
  unknown,
  AppInfoDTO
> {
  public constructor(
    // It has to be protected in order to correctly extend the class
    protected readonly logger: Logger,
    @InjectRepository(BaseWidget)
    private baseWidgetRepository: Repository<BaseWidget>,
    @Inject(SurveyAnswerRepository)
    private readonly surveyAnswerRepository: ISurveyAnswerRepository,
  ) {
    super(baseWidgetRepository, 'baseWidget', 'baseWidgets');
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<BaseWidget>,
    fetchSpecification: FetchSpecification & WidgetVisualisationFilters,
  ): Promise<SelectQueryBuilder<BaseWidget>> {
    if (fetchSpecification?.visualisations?.length) {
      return this.filterByVisualisation(
        query,
        fetchSpecification.visualisations,
      );
    }
    return query;
  }

  private filterByVisualisation(
    query: SelectQueryBuilder<BaseWidget>,
    visualisations: string[],
  ) {
    query.andWhere(
      `ARRAY[:...visualisations] <@ string_to_array(baseWidget.visualisations, ',')`,
      { visualisations },
    );
    return query;
  }

  public async findWidgetWithDataById(
    id: string,
    query: FetchSpecification & WidgetDataFiltersSchema,
  ): Promise<BaseWidgetWithData> {
    const widget = await this.baseWidgetRepository.findOneBy({ indicator: id });
    if (widget === null) {
      const exception = new NotFoundException(`Widget with id ${id} not found`);
      this.logger.error(
        exception.message,
        exception.stack,
        this.constructor.name,
      );
      throw exception;
    }

    const baseWidgetWithData =
      await this.surveyAnswerRepository.addSurveyDataToBaseWidget(
        widget,
        query.filters,
      );

    return baseWidgetWithData;
  }
}
