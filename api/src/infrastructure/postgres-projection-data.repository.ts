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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filters: SearchFilterDTO[] = [],
  ): Promise<ProjectionFilter[]> {
    const repo = this.dataSource.getRepository(ProjectionFilter);
    const result = await repo.find();
    return result;

    // Smart filters disabled
    // const result: ProjectionFilter[] = [];
    // const repo = this.dataSource.getRepository(Projection);
    // for (const filterName of AVAILABLE_PROJECTION_FILTERS) {
    //   const fieldName = PROJECTION_FILTER_NAME_TO_FIELD_NAME[filterName];
    //   const queryBuilder = repo
    //     .createQueryBuilder('projection')
    //     .select(`JSON_AGG(DISTINCT projection.${fieldName})`, 'values');
    //   QueryBuilderUtils.applySearchFilters(queryBuilder, filters, {
    //     alias: 'projection',
    //   });
    //   const { values } = await queryBuilder.getRawOne();
    //   result.push({
    //     name: filterName,
    //     label: '',
    //     values: values ? values : [],
    //   });
    // }
    // return result;
  }

  public async addDataToProjectionsWidgets(
    projectionWidgets: ProjectionWidget[],
    dataFilters: SearchFilterDTO[],
  ): Promise<void> {
    await Promise.all(
      projectionWidgets.map(async (widget) => {
        widget.data = await this.findProjectionWidgetData([
          ...dataFilters,
          { name: 'type', operator: '=', values: [widget.type] },
        ]);
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
      .addSelect('projection.unit', 'unit')
      .innerJoin('projection.projectionData', 'projectionData')
      .groupBy('projectionData.year')
      .addGroupBy('projection.unit')
      .orderBy('projectionData.year', 'ASC');

    QueryBuilderUtils.applySearchFilters(queryBuilder, dataFilters, {
      alias: 'projection',
      filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
    });

    return queryBuilder.getRawMany();
  }

  public async findSimpleProjectionCustomWidgetData(
    widgetVisualization: ProjectionVisualizationsType,
    dataFilters: SearchFilterDTO[],
    settings: CustomProjectionSettingsType,
  ): Promise<CustomProjection> {
    const verticalAxis = settings[widgetVisualization].vertical;
    const colorAxis =
      PROJECTION_FILTER_NAME_TO_FIELD_NAME[settings[widgetVisualization].color];

    // Y
    const yQueryBuilder = this.dataSource
      .getRepository(Projection)
      .createQueryBuilder('projection')
      .select('projectionData.year', 'year')
      .addSelect('SUM(projectionData.value)', 'vertical')
      .addSelect(`projection.${colorAxis}`, 'color')
      .innerJoin('projection.projectionData', 'projectionData')
      .where('projection.type = :type', { type: verticalAxis })
      .groupBy('projectionData.year')
      .addGroupBy('projection.type')
      .addGroupBy(`projection.${colorAxis}`)
      .orderBy('projectionData.year')
      .addOrderBy('projection.type')
      .addOrderBy(`projection.${colorAxis}`);

    QueryBuilderUtils.applySearchFilters(yQueryBuilder, dataFilters, {
      alias: 'projection',
      filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
    });

    const rawData = await yQueryBuilder.getRawMany();

    // Group by color and year, sum vertical values
    const grouped: Record<string, { [year: number]: number }> = {};
    for (const row of rawData) {
      const color = row.color;
      const year = row.year;
      const vertical = Number(row.vertical);
      if (!grouped[color]) grouped[color] = {};
      if (!grouped[color][year]) grouped[color][year] = 0;
      grouped[color][year] += vertical;
    }

    // Calculate total sum per color
    const colorTotals = Object.entries(grouped).map(([color, years]) => ({
      color,
      total: Object.values(years).reduce((a, b) => a + b, 0),
    }));
    // Sort by total descending
    colorTotals.sort((a, b) => b.total - a.total);

    // If more than X colors, aggregate the rest into 'others'
    const maxGroups = 6;
    const topColors = colorTotals.slice(0, maxGroups - 1).map((c) => c.color);
    const otherColors = colorTotals.slice(maxGroups - 1).map((c) => c.color);

    const result: any[] = [];
    const years = Array.from(new Set(rawData.map((r) => r.year))).sort();
    for (const year of years) {
      // Add top colors
      for (const color of topColors) {
        if (grouped[color][year] !== undefined) {
          result.push({ color, year, vertical: grouped[color][year] });
        }
      }
      // Aggregate 'others'
      if (otherColors.length > 0) {
        const othersSum = otherColors.reduce(
          (sum, color) => sum + (grouped[color][year] || 0),
          0,
        );
        if (othersSum > 0) {
          result.push({ color: 'others', year, vertical: othersSum });
        }
      }
    }
    return result;
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
        // Only aggregate 'others' in findSimpleProjectionCustomWidgetData
        return this.findSimpleProjectionCustomWidgetData(
          widgetVisualization,
          dataFilters,
          settings,
        );
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
          .addSelect('SUM(projectionData.value)', 'vertical')
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
          .addSelect('SUM(projectionData.value)', 'horizontal')
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

        // Get parameters from each query builder
        const sizeParams = Object.values(sizeQueryBuilder.getParameters());
        const verticalParams = Object.values(
          verticalQueryBuilder.getParameters(),
        );
        const horizontalParams = Object.values(
          horizontalQueryBuilder.getParameters(),
        );

        // Build parameter replacement mapping for vertical query
        const verticalSql = verticalQueryBuilder
          .getSql()
          .replace(/\$(\d+)/g, (match, paramIndex) => {
            return `$${Number(paramIndex) + sizeParams.length}`;
          });

        // Build parameter replacement mapping for horizontal query
        const horizontalSql = horizontalQueryBuilder
          .getSql()
          .replace(/\$(\d+)/g, (match, paramIndex) => {
            return `$${Number(paramIndex) + sizeParams.length + verticalParams.length}`;
          });

        const query = `
          SELECT size.*, vertical.vertical AS vertical, horizontal.horizontal AS horizontal
          FROM (${sizeQueryBuilder.getSql()}) AS size
          LEFT JOIN (${verticalSql}) AS vertical
            ON size.color = vertical.color AND size.bubble = vertical.bubble AND size.year = vertical.year
          LEFT JOIN (${horizontalSql}) AS horizontal
            ON size.color = horizontal.color AND size.bubble = horizontal.bubble AND size.year = horizontal.year
        `;

        const rawData = await this.dataSource.query(query, [
          ...sizeParams,
          ...verticalParams,
          ...horizontalParams,
        ]);

        // Application layer aggregation: top X colors per bubble/year, sorted by horizontal
        const maxGroups = 6;
        // Group by bubble and year
        const grouped: Record<string, Record<number, any[]>> = {};
        for (const row of rawData) {
          const bubbleVal = row.bubble;
          const yearVal = Number(row.year);
          if (!grouped[bubbleVal]) grouped[bubbleVal] = {};
          if (!grouped[bubbleVal][yearVal]) grouped[bubbleVal][yearVal] = [];
          grouped[bubbleVal][yearVal].push(row);
        }

        const result: any[] = [];
        for (const bubbleVal of Object.keys(grouped)) {
          for (const yearVal of Object.keys(grouped[bubbleVal])) {
            const rows = grouped[bubbleVal][Number(yearVal)];
            // Sort colors by horizontal descending
            const sortedRows = [...rows].sort(
              (a, b) => Number(b.horizontal) - Number(a.horizontal),
            );
            const topColors = sortedRows.slice(0, maxGroups - 1);
            const otherColors = sortedRows.slice(maxGroups - 1);
            // Add top colors
            for (const row of topColors) {
              result.push(row);
            }
            // Aggregate others
            if (otherColors.length > 0) {
              // Aggregate all metrics for 'others'
              const agg = otherColors.reduce(
                (acc, r) => {
                  acc.size += Number(r.size);
                  acc.vertical += Number(r.vertical);
                  acc.horizontal += Number(r.horizontal);
                  return acc;
                },
                { size: 0, vertical: 0, horizontal: 0 },
              );
              result.push({
                bubble: bubbleVal,
                color: 'others',
                year: Number(yearVal),
                size: agg.size,
                vertical: agg.vertical,
                horizontal: agg.horizontal,
              });
            }
          }
        }
        return result;
      default:
        throw new NotFoundException(
          `Visualization type ${widgetVisualization} is not supported.`,
        );
    }
  }
}
