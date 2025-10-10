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

  /**
   * Generates a SQL expression to humanize any dimension values
   * Transforms values like 'market-potential', 'reimagining_progress', 'technology-type'
   * to 'Market Potential', 'Reimagining Progress', 'Technology Type'
   * Does NOT transform country codes (keeps them as ISO3 for map functionality)
   */
  private getConditionalHumanizationSql(
    columnExpression: string,
    fieldName: string,
  ): string {
    // Don't humanize country codes - they need to stay as ISO3 for maps
    if (fieldName === 'country') {
      return `${columnExpression}::text`;
    }

    return `
      INITCAP(
        REPLACE(
          REPLACE(${columnExpression}::text, '-', ' '), 
          '_', ' '
        )
      )
    `;
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
  ): Promise<ProjectionWidgetData> {
    // First, build the base query with filters to get the aggregated data per year and unit
    const baseQueryBuilder = this.dataSource
      .getRepository(Projection)
      .createQueryBuilder('projection')
      .select('projectionData.year', 'year')
      .addSelect('SUM(projectionData.value)', 'value')
      .addSelect('projection.unit', 'unit')
      .innerJoin('projection.projectionData', 'projectionData')
      .groupBy('projectionData.year')
      .addGroupBy('projection.unit')
      .orderBy('projectionData.year', 'ASC');

    QueryBuilderUtils.applySearchFilters(baseQueryBuilder, dataFilters, {
      alias: 'projection',
      filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
    });

    // Now wrap it in a query that creates a single object with units as keys
    const finalQuery = `
      SELECT 
        JSON_OBJECT_AGG(
          unit,
          unit_data
        ) as data
      FROM (
        SELECT 
          unit,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'year', year,
              'value', value
            ) 
            ORDER BY year ASC
          ) as unit_data
        FROM (${baseQueryBuilder.getSql()}) as base_data
        GROUP BY unit
      ) as grouped_data
    `;

    const parameters = Object.values(baseQueryBuilder.getParameters());
    const result = await this.dataSource.query(finalQuery, parameters);
    return result[0]?.data;
  }

  public async findSimpleProjectionCustomWidgetData(
    widgetVisualization: ProjectionVisualizationsType,
    dataFilters: SearchFilterDTO[],
    settings: CustomProjectionSettingsType,
  ): Promise<CustomProjection> {
    const verticalAxis = settings[widgetVisualization].vertical;
    const colorAxis =
      PROJECTION_FILTER_NAME_TO_FIELD_NAME[settings[widgetVisualization].color];
    const colorFieldName = settings[widgetVisualization].color;

    // Base query with all necessary groupings and filters
    const baseQueryBuilder = this.dataSource
      .getRepository(Projection)
      .createQueryBuilder('projection')
      .select('projectionData.year', 'year')
      .addSelect('SUM(projectionData.value)', 'vertical')
      .addSelect(`projection.${colorAxis}`, 'color')
      .addSelect('projection.unit', 'unit')
      .innerJoin('projection.projectionData', 'projectionData')
      .where('projection.type = :type', { type: verticalAxis })
      .groupBy('projectionData.year')
      .addGroupBy('projection.type')
      .addGroupBy(`projection.${colorAxis}`)
      .addGroupBy('projection.unit')
      .orderBy('projectionData.year')
      .addOrderBy('projection.type')
      .addOrderBy(`projection.${colorAxis}`);

    QueryBuilderUtils.applySearchFilters(baseQueryBuilder, dataFilters, {
      alias: 'projection',
      filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
    });

    // Use database-level logic to handle top colors per unit
    const finalQuery = `
      WITH base_data AS (
        ${baseQueryBuilder.getSql()}
      ),
      unit_color_totals AS (
        SELECT 
          unit,
          color,
          SUM(vertical) as total_vertical
        FROM base_data
        GROUP BY unit, color
      ),
      ranked_colors AS (
        SELECT 
          unit,
          color,
          total_vertical,
          ROW_NUMBER() OVER (PARTITION BY unit ORDER BY total_vertical DESC) as rank
        FROM unit_color_totals
      ),
      processed_data AS (
        SELECT 
          bd.unit,
          bd.year,
          CASE 
            WHEN rc.rank <= 9 THEN bd.color::text
            ELSE 'Others'
          END as final_color,
          SUM(bd.vertical) as vertical
        FROM base_data bd
        JOIN ranked_colors rc ON bd.unit = rc.unit AND bd.color = rc.color
        GROUP BY bd.unit, bd.year, 
                 CASE 
                   WHEN rc.rank <= 9 THEN bd.color::text
                   ELSE 'Others'
                 END
      )
      SELECT 
        JSON_OBJECT_AGG(
          unit,
          unit_data
        ) as data
      FROM (
        SELECT 
          unit,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'year', year,
              'color', CASE 
                WHEN final_color = 'Others' THEN 'Others'
                ELSE ${this.getConditionalHumanizationSql('final_color', colorFieldName)}
              END,
              'vertical', vertical
            ) 
            ORDER BY year ASC, final_color
          ) as unit_data
        FROM processed_data
        GROUP BY unit
      ) as grouped_data
    `;

    const parameters = Object.values(baseQueryBuilder.getParameters());
    const result = await this.dataSource.query(finalQuery, parameters);

    return result[0]?.data || {};
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

        // Extract field names for humanization
        const bubbleFieldName = settings[widgetVisualization].bubble;
        const colorFieldName = settings[widgetVisualization].color;

        // Build base queries with unit grouping
        const sizeQueryBuilder = this.dataSource
          .getRepository(Projection)
          .createQueryBuilder('projection')
          .select('projectionData.year', 'year')
          .addSelect('SUM(projectionData.value)', 'size')
          .addSelect(`projection.${bubble}`, 'bubble')
          .addSelect(`projection.${color}`, 'color')
          .addSelect('projection.unit', 'unit')
          .innerJoin('projection.projectionData', 'projectionData')
          .where('projection.type = :type', { type: size })
          .groupBy('projectionData.year')
          .addGroupBy('projection.type')
          .addGroupBy(`projection.${bubble}`)
          .addGroupBy(`projection.${color}`)
          .addGroupBy('projection.unit')
          .orderBy('projectionData.year')
          .addOrderBy('projection.type')
          .addOrderBy(`projection.${bubble}`)
          .addOrderBy(`projection.${color}`);

        QueryBuilderUtils.applySearchFilters(sizeQueryBuilder, dataFilters, {
          alias: 'projection',
          filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
        });

        const verticalQueryBuilder = this.dataSource
          .getRepository(Projection)
          .createQueryBuilder('projection')
          .select('projectionData.year', 'year')
          .addSelect('SUM(projectionData.value)', 'vertical')
          .addSelect(`projection.${bubble}`, 'bubble')
          .addSelect(`projection.${color}`, 'color')
          .addSelect('projection.unit', 'unit')
          .innerJoin('projection.projectionData', 'projectionData')
          .where('projection.type = :type', { type: vertical })
          .groupBy('projectionData.year')
          .addGroupBy('projection.type')
          .addGroupBy(`projection.${bubble}`)
          .addGroupBy(`projection.${color}`)
          .addGroupBy('projection.unit')
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

        const horizontalQueryBuilder = this.dataSource
          .getRepository(Projection)
          .createQueryBuilder('projection')
          .select('projectionData.year', 'year')
          .addSelect('SUM(projectionData.value)', 'horizontal')
          .addSelect(`projection.${bubble}`, 'bubble')
          .addSelect(`projection.${color}`, 'color')
          .addSelect('projection.unit', 'unit')
          .innerJoin('projection.projectionData', 'projectionData')
          .where('projection.type = :type', { type: horizontal })
          .groupBy('projectionData.year')
          .addGroupBy('projection.type')
          .addGroupBy(`projection.${bubble}`)
          .addGroupBy(`projection.${color}`)
          .addGroupBy('projection.unit')
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

        // Combined query that joins all three metrics and groups by unit
        const combinedQuery = `
          WITH combined_data AS (
            SELECT 
              size.unit,
              size.bubble,
              size.color,
              size.year,
              size.size,
              COALESCE(vertical.vertical, 0) AS vertical,
              COALESCE(horizontal.horizontal, 0) AS horizontal
            FROM (${sizeQueryBuilder.getSql()}) AS size
            LEFT JOIN (${verticalSql}) AS vertical
              ON size.color = vertical.color 
              AND size.bubble = vertical.bubble 
              AND size.year = vertical.year
              AND size.unit = vertical.unit
            LEFT JOIN (${horizontalSql}) AS horizontal
              ON size.color = horizontal.color 
              AND size.bubble = horizontal.bubble 
              AND size.year = horizontal.year
              AND size.unit = horizontal.unit
          ),
          color_totals AS (
            SELECT 
              unit,
              bubble,
              color,
              SUM(horizontal) as total_horizontal
            FROM combined_data
            GROUP BY unit, bubble, color
          ),
          ranked_colors AS (
            SELECT 
              unit,
              bubble,
              color,
              total_horizontal,
              ROW_NUMBER() OVER (
                PARTITION BY unit, bubble 
                ORDER BY total_horizontal DESC
              ) as rank
            FROM color_totals
          ),
          processed_data AS (
            SELECT 
              cd.unit,
              cd.bubble,
              cd.year,
              CASE 
                WHEN rc.rank <= 9 THEN cd.color::text
                ELSE 'Others'
              END as final_color,
              SUM(cd.size) as size,
              SUM(cd.vertical) as vertical,
              SUM(cd.horizontal) as horizontal
            FROM combined_data cd
            JOIN ranked_colors rc ON cd.unit = rc.unit AND cd.bubble = rc.bubble AND cd.color = rc.color
            GROUP BY cd.unit, cd.bubble, cd.year, 
                     CASE 
                       WHEN rc.rank <= 9 THEN cd.color::text
                       ELSE 'Others'
                     END
          )
          SELECT 
            JSON_OBJECT_AGG(
              unit,
              unit_data
            ) as data
          FROM (
            SELECT 
              unit,
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'year', year,
                  'bubble', ${this.getConditionalHumanizationSql('bubble', bubbleFieldName)},
                  'color', CASE 
                    WHEN final_color = 'Others' THEN 'Others'
                    ELSE ${this.getConditionalHumanizationSql('final_color', colorFieldName)}
                  END,
                  'size', size,
                  'vertical', vertical,
                  'horizontal', horizontal
                ) 
                ORDER BY year ASC, bubble, final_color
              ) as unit_data
            FROM processed_data
            GROUP BY unit
          ) as grouped_data
        `;

        const bubbleResult = await this.dataSource.query(combinedQuery, [
          ...sizeParams,
          ...verticalParams,
          ...horizontalParams,
        ]);

        return bubbleResult[0]?.data || {};
      default:
        throw new NotFoundException(
          `Visualization type ${widgetVisualization} is not supported.`,
        );
    }
  }
}
