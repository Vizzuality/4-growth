import { DataSource, Repository } from 'typeorm';
import { Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import { IProjectionDataRepository } from '@api/infrastructure/projection-data-repository.interface';
import { SearchFilterDTO } from '@shared/dto/global/search-filters';
import {
  ProjectionWidget,
  ProjectionWidgetData,
} from '@shared/dto/projections/projection-widget.entity';
import { Projection } from '@shared/dto/projections/projection.entity';
import { QueryBuilderUtils } from '@api/infrastructure/query-builder-utils';
import {
  AVAILABLE_PROJECTION_FILTERS,
  PROJECTION_FILTER_NAME_TO_FIELD_NAME,
  ProjectionFilter,
} from '@shared/dto/projections/projection-filter.entity';
import { CustomProjection } from '@shared/dto/projections/custom-projection.type';
import { CustomProjectionSettingsType } from '@shared/schemas/custom-projection-settings.schema';
import {
  PROJECTION_VISUALIZATIONS,
  ProjectionVisualizationsType,
} from '@shared/dto/projections/projection-visualizations.constants';

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
    await Promise.all(
      projectionWidgets.map(async (widget) => {
        widget.data = await this.findProjectionWidgetData(dataFilters);
        return widget;
      }),
    );
  }

  public async findProjectionWidgetData(
    dataFilters: SearchFilterDTO[],
  ): Promise<ProjectionWidgetData[]> {
    const queryBuilder = this.dataSource
      .getRepository(Projection)
      .createQueryBuilder('projection')
      .select('projectionData.year', 'year')
      .addSelect('SUM(projectionData.value)', 'value')
      .innerJoin('projection.projectionData', 'projectionData')
      .groupBy('projectionData.year')
      .orderBy('projectionData.year', 'ASC');

    QueryBuilderUtils.applySearchFilters(queryBuilder, dataFilters, {
      alias: 'projection',
      filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
    });

    return queryBuilder.getRawMany();
  }

  public async findProjectionCustomWidgetData(
    dataFilters: SearchFilterDTO[],
    opts: { valueFieldAlias: string } = { valueFieldAlias: 'value' },
  ): Promise<ProjectionWidgetData[]> {
    const queryBuilder = this.dataSource
      .getRepository(Projection)
      .createQueryBuilder('projection')
      .select('projectionData.year', 'year')
      .addSelect('SUM(projectionData.value)', opts.valueFieldAlias)
      .innerJoin('projection.projectionData', 'projectionData')
      .groupBy('projection.type')
      .addGroupBy('projectionData.year')
      .orderBy('projection.type', 'ASC')
      .addOrderBy('projectionData.year', 'ASC');

    QueryBuilderUtils.applySearchFilters(queryBuilder, dataFilters, {
      alias: 'projection',
      filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
    });

    return queryBuilder.getRawMany();
  }

  public async previewProjectionCustomWidget(
    dataFilters: SearchFilterDTO[],
    settings: CustomProjectionSettingsType,
  ): Promise<CustomProjection> {
    const widgetVisualization = Object.keys(
      settings,
    )[0] as ProjectionVisualizationsType;
    switch (widgetVisualization) {
      case PROJECTION_VISUALIZATIONS.LINE_CHART:
      case PROJECTION_VISUALIZATIONS.BAR_CHART:
      case PROJECTION_VISUALIZATIONS.AREA_CHART:
        return this.findProjectionCustomWidgetData(dataFilters, {
          valueFieldAlias: 'vertical',
        }) as unknown as Promise<CustomProjection>;
      case PROJECTION_VISUALIZATIONS.BUBBLE_CHART:
        const bubble =
          PROJECTION_FILTER_NAME_TO_FIELD_NAME[
            settings[widgetVisualization].bubble
          ];
        const vertical = settings[widgetVisualization].vertical;
        const horizontal = settings[widgetVisualization].horizontal;
        const color =
          PROJECTION_FILTER_NAME_TO_FIELD_NAME[
            settings[widgetVisualization].color
          ];
        const size = settings[widgetVisualization].size;

        // Z
        const sizeQueryBuilder = this.dataSource
          .getRepository(Projection)
          .createQueryBuilder('projection')
          .select('projectionData.year', 'year')
          .addSelect('SUM(projectionData.value)', 'size')
          .addSelect(`projection.${bubble}`, 'bubble')
          .addSelect(`projection.${color}`, 'color')
          .innerJoin('projection.projectionData', 'projectionData')
          .where('projection.type = :type', { type: size })
          .groupBy('projectionData.year')
          .addGroupBy('projection.type')
          .addGroupBy(`projection.${bubble}`)
          .addGroupBy(`projection.${color}`)
          .orderBy('projectionData.year')
          .addOrderBy('projection.type')
          .addOrderBy(`projection.${bubble}`)
          .addOrderBy(`projection.${color}`);

        QueryBuilderUtils.applySearchFilters(sizeQueryBuilder, dataFilters, {
          alias: 'projection',
          filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
        });

        // Y
        const verticalQueryBuilder = this.dataSource
          .getRepository(Projection)
          .createQueryBuilder('projection')
          .select('projectionData.year', 'year')
          .addSelect('SUM(projectionData.value)', 'value')
          .addSelect(`projection.${bubble}`, 'bubble')
          .addSelect(`projection.${color}`, 'color')
          .innerJoin('projection.projectionData', 'projectionData')
          .where('projection.type = :type', { type: vertical })
          .groupBy('projectionData.year')
          .addGroupBy('projection.type')
          .addGroupBy(`projection.${bubble}`)
          .addGroupBy(`projection.${color}`)
          .orderBy('projectionData.year')
          .addOrderBy('projection.type')
          .addOrderBy(`projection.${bubble}`)
          .addOrderBy(`projection.${color}`);

        QueryBuilderUtils.applySearchFilters(
          verticalQueryBuilder,
          dataFilters,
          {
            alias: 'projection',
            filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
          },
        );

        // X
        const horizontalQueryBuilder = this.dataSource
          .getRepository(Projection)
          .createQueryBuilder('projection')
          .select('projectionData.year', 'year')
          .addSelect('SUM(projectionData.value)', 'value')
          .addSelect(`projection.${bubble}`, 'bubble')
          .addSelect(`projection.${color}`, 'color')
          .innerJoin('projection.projectionData', 'projectionData')
          .where('projection.type = :type', { type: horizontal })
          .groupBy('projectionData.year')
          .addGroupBy('projection.type')
          .addGroupBy(`projection.${bubble}`)
          .addGroupBy(`projection.${color}`)
          .orderBy('projectionData.year')
          .addOrderBy('projection.type')
          .addOrderBy(`projection.${bubble}`)
          .addOrderBy(`projection.${color}`);

        QueryBuilderUtils.applySearchFilters(
          horizontalQueryBuilder,
          dataFilters,
          {
            alias: 'projection',
            filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
          },
        );

        const query = `
          SELECT size.*, vertical.value AS vertical, horizontal.value AS horizontal
          FROM (${sizeQueryBuilder.getSql()}) AS size
          LEFT JOIN (${verticalQueryBuilder.getSql().replace(/\$1/, '$2')}) AS vertical
            ON size.color = vertical.color AND size.bubble = vertical.bubble AND size.year = vertical.year
          LEFT JOIN (${horizontalQueryBuilder.getSql().replace(/\$1/, '$3')}) AS horizontal
            ON size.color = horizontal.color AND size.bubble = horizontal.bubble AND size.year = horizontal.year
        `;

        const result = await this.dataSource.query(query, [
          ...Object.values(sizeQueryBuilder.getParameters()),
          ...Object.values(verticalQueryBuilder.getParameters()),
          ...Object.values(horizontalQueryBuilder.getParameters()),
        ]);
        return result;
      default:
        throw new NotFoundException(
          `Visualization type ${widgetVisualization} is not supported.`,
        );
    }
  }
}
