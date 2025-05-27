import { DataSource, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import { IProjectionDataRepository } from '@api/infrastructure/projection-data-repository.interface';
import { SearchFilterDTO } from '@shared/dto/global/search-filters';
import { ProjectionWidget } from '@shared/dto/projections/projection-widget.entity';
import { Projection } from '@shared/dto/projections/projection.entity';
import { QueryBuilderUtils } from '@api/infrastructure/query-builder-utils';
import {
  AVAILABLE_PROJECTION_FILTERS,
  PROJECTION_FILTER_NAME_TO_FIELD_NAME,
  ProjectionFilter,
} from '@shared/dto/projections/projection-filter.entity';

export class PostgresProjectionDataRepository
  extends Repository<ProjectionData>
  implements IProjectionDataRepository
{
  public constructor(
    private readonly logger: Logger,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
    super(ProjectionData, dataSource.manager);
  }

  public async searchAvailableFilters(
    filters: SearchFilterDTO[] = [],
  ): Promise<ProjectionFilter[]> {
    const result: ProjectionFilter[] = [];
    const repo = this.dataSource.getRepository(Projection);

    for (const filterName of AVAILABLE_PROJECTION_FILTERS) {
      const fieldName = PROJECTION_FILTER_NAME_TO_FIELD_NAME[filterName];
      const queryBuilder = repo
        .createQueryBuilder('projection')
        .select(`JSON_AGG(DISTINCT projection.${fieldName})`, 'values');

      QueryBuilderUtils.applySearchFilters(queryBuilder, filters, {
        alias: 'projection',
      });
      const { values } = await queryBuilder.getRawOne();
      result.push({
        name: filterName,
        values: values ? values : [],
      });
    }
    return result;
  }

  public async addDataToProjectionsWidgets(
    projectionWidgets: ProjectionWidget[],
    dataFilters: SearchFilterDTO[],
  ): Promise<void> {
    const promises = [];
    for (const widget of projectionWidgets) {
      promises.push(this.addDataToProjectionWidget(widget, dataFilters));
    }
    await Promise.all(promises);
  }

  private async addDataToProjectionWidget(
    projectionWidget: ProjectionWidget,
    dataFilters: SearchFilterDTO[],
  ): Promise<void> {
    const queryBuilder = this.dataSource
      .getRepository(Projection)
      .createQueryBuilder('projection')
      .select('projectionData.year', 'year')
      .addSelect('SUM(projectionData.value)', 'total')
      .innerJoin('projection.projectionData', 'projectionData')
      .groupBy('projection.type')
      .addGroupBy('projectionData.year')
      .orderBy('projection.type', 'ASC')
      .addOrderBy('projectionData.year', 'ASC');

    QueryBuilderUtils.applySearchFilters(queryBuilder, dataFilters, {
      alias: 'projection',
      filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
    });
    const result = await queryBuilder.getRawMany();
    projectionWidget.data = result;
  }
}
