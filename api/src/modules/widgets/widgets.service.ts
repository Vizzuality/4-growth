import { AppBaseService } from '@api/utils/app-base.service';
import { AppInfoDTO } from '@api/utils/info.dto';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FetchSpecification } from 'nestjs-base-service';
import { WidgetVisualisationFilters } from '@shared/schemas/widget-visualisation-filters.schema';

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
  ) {
    super(baseWidgetRepository, 'baseWidget', 'basedWidgets');
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<BaseWidget>,
    fetchSpecification: FetchSpecification & WidgetVisualisationFilters,
  ): Promise<SelectQueryBuilder<BaseWidget>> {
    if (fetchSpecification?.visualisations.length) {
      return this.filterByVisualisation(
        query,
        fetchSpecification.visualisations,
      );
    }
  }

  async extendGetByIdQuery(
    query: SelectQueryBuilder<BaseWidget>,
    fetchSpecification?: FetchSpecification & WidgetVisualisationFilters,
  ): Promise<SelectQueryBuilder<BaseWidget>> {
    if (fetchSpecification?.visualisations.length) {
      return this.filterByVisualisation(
        query,
        fetchSpecification.visualisations,
      );
    }
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
}
