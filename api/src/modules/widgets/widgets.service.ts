import { AppBaseService } from '@api/utils/app-base.service';
import { AppInfoDTO } from '@api/utils/info.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FetchSpecification } from 'nestjs-base-service';
import { WidgetVisualisationFilters } from '@shared/schemas/widget-visualisation-filters.schema';
import { BaseWidgetWithData } from '@shared/dto/widgets/base-widget-data.interface';
import { SearchWidgetDataParamsSchema } from '@shared/schemas/search-widget-data-params.schema';
import {
  ISurveyAnswerRepository,
  SurveyAnswerRepository,
} from '@api/infrastructure/survey-answer-repository.interface';
import {
  NonExportableWidgetError,
  serializeWidgetDataToCsv,
  WidgetDataField,
} from '@api/modules/widgets/csv/widget-data.csv';
import { buildCsvFilename } from '@api/modules/widgets/csv/filename';
import {
  WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from '@shared/dto/widgets/widget-visualizations.constants';

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
    query: FetchSpecification & SearchWidgetDataParamsSchema,
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
      await this.surveyAnswerRepository.addSurveyDataToBaseWidget(widget, {
        filters: query.filters,
        breakdownIndicator: query.breakdown,
      });

    return baseWidgetWithData;
  }

  public async exportWidgetCsv(
    id: string,
    query: FetchSpecification & SearchWidgetDataParamsSchema,
    now: Date = new Date(),
  ): Promise<{ csv: string; filename: string }> {
    const widget = await this.findWidgetWithDataById(id, query);
    const preferredField = pickPreferredDataField(
      query.breakdown,
      widget.defaultVisualization,
    );
    try {
      const csv = serializeWidgetDataToCsv(widget.data, preferredField);
      const titleForFilename =
        firstNonBlank(widget.title, widget.question) ?? widget.indicator;
      const filename = buildCsvFilename(titleForFilename, now);
      return { csv, filename };
    } catch (error) {
      if (error instanceof NonExportableWidgetError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}

function firstNonBlank(
  ...values: Array<string | null | undefined>
): string | undefined {
  for (const value of values) {
    if (value && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
}

function pickPreferredDataField(
  breakdown: string | undefined,
  visualization: WidgetVisualizationsType | undefined,
): WidgetDataField | undefined {
  if (breakdown) return 'breakdown';
  switch (visualization) {
    case WIDGET_VISUALIZATIONS.SINGLE_VALUE:
      return 'counter';
    case WIDGET_VISUALIZATIONS.MAP:
      return 'map';
    case WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART:
    case WIDGET_VISUALIZATIONS.PIE_CHART:
    case WIDGET_VISUALIZATIONS.AREA_GRAPH:
      return 'chart';
    default:
      return undefined;
  }
}
