import { DataSource, Repository } from 'typeorm';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
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
import {
  PROJECTION_RATIO_CONFIG,
  ProjectionRatioConfig,
  ProjectionType,
} from '@shared/dto/projections/projection-types';
import { CustomProjection } from '@shared/dto/projections/custom-projection.type';
import {
  CustomProjectionSettingsType,
  OthersAggregationType,
} from '@shared/schemas/custom-projection-settings.schema';
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
   * Builds a SQL aggregate expression for ratio-based indicators
   * (e.g. Penetration = Σ Installed Base / Σ Addressable Market × 100).
   *
   * Values come from the compile-time PROJECTION_RATIO_CONFIG — never user input.
   * The query must filter `projection.type IN (numerator, denominator)` before
   * this expression is evaluated, so both types are present in the grouped rows.
   */
  private buildRatioSelectExpression(ratioConfig: ProjectionRatioConfig): string {
    return `COALESCE(
      SUM(CASE WHEN projection.type = '${ratioConfig.numerator}' THEN projectionData.value END)
      / NULLIF(SUM(CASE WHEN projection.type = '${ratioConfig.denominator}' THEN projectionData.value END), 0)
      * ${ratioConfig.multiplier},
      0
    )`;
  }

  // Raw conditional sums for carrying numerator/denominator through CTEs.
  // Used when aggregation happens in multiple stages (e.g. Others bucket),
  // so the ratio is computed once at the last stage rather than summed.
  private buildRatioNumeratorSumExpression(cfg: ProjectionRatioConfig): string {
    return `SUM(CASE WHEN projection.type = '${cfg.numerator}' THEN projectionData.value END)`;
  }

  private buildRatioDenominatorSumExpression(cfg: ProjectionRatioConfig): string {
    return `SUM(CASE WHEN projection.type = '${cfg.denominator}' THEN projectionData.value END)`;
  }

  private buildRatioFromSumsExpression(
    numSql: string,
    denSql: string,
    multiplier: number,
  ): string {
    return `COALESCE(${numSql} / NULLIF(${denSql}, 0) * ${multiplier}, 0)`;
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
    filters: SearchFilterDTO[] = [],
  ): Promise<ProjectionFilter[]> {
    const filterRepo = this.dataSource.getRepository(ProjectionFilter);
    const staticFilters = await filterRepo.find();

    const operationAreaFilter = filters.find((f) => f.name === 'category');
    if (!operationAreaFilter) {
      return staticFilters;
    }

    const projectionRepo = this.dataSource.getRepository(Projection);
    const dynamicByName: Record<string, string[]> = {};
    for (const filterName of ['technology', 'technology-type'] as const) {
      const fieldName = PROJECTION_FILTER_NAME_TO_FIELD_NAME[filterName];
      const qb = projectionRepo
        .createQueryBuilder('projection')
        .select(`DISTINCT projection.${fieldName}`, fieldName)
        .orderBy(`projection.${fieldName}`, 'ASC');
      QueryBuilderUtils.applySearchFilters(qb, [operationAreaFilter], {
        alias: 'projection',
        filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
      });
      const rows = await qb.getRawMany();
      dynamicByName[filterName] = rows
        .map((r) => r[fieldName])
        .filter((v): v is string => typeof v === 'string');
    }

    return staticFilters.map((f) =>
      dynamicByName[f.name] ? { ...f, values: dynamicByName[f.name] } : f,
    );
  }

  public async countDistinctColorValues(
    colorFieldName: string,
    dataFilters: SearchFilterDTO[],
  ): Promise<number> {
    const fieldName =
      PROJECTION_FILTER_NAME_TO_FIELD_NAME[colorFieldName] || colorFieldName;
    const queryBuilder = this.dataSource
      .getRepository(Projection)
      .createQueryBuilder('projection')
      .select(`COUNT(DISTINCT projection.${fieldName})`, 'count');

    QueryBuilderUtils.applySearchFilters(queryBuilder, dataFilters, {
      alias: 'projection',
      filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
    });

    const result = await queryBuilder.getRawOne();
    return parseInt(result?.count || '0', 10);
  }

  public async addDataToProjectionsWidgets(
    projectionWidgets: ProjectionWidget[],
    dataFilters: SearchFilterDTO[],
  ): Promise<void> {
    await Promise.all(
      projectionWidgets.map(async (widget) => {
        const ratioConfig = PROJECTION_RATIO_CONFIG[widget.type as ProjectionType];
        const typeFilter: SearchFilterDTO = ratioConfig
          ? {
              name: 'type',
              operator: '=',
              values: [ratioConfig.numerator, ratioConfig.denominator],
            }
          : { name: 'type', operator: '=', values: [widget.type] };
        widget.data = await this.findProjectionWidgetData(
          [...dataFilters, typeFilter],
          ratioConfig,
        );
        return widget;
      }),
    );
  }

  public async findProjectionWidgetData(
    dataFilters: SearchFilterDTO[],
    ratioConfig?: ProjectionRatioConfig,
  ): Promise<ProjectionWidgetData> {
    // Build the base query with filters to get the aggregated data per year and unit.
    // Ratio types (Penetration, Prices) use a conditional-SUM ratio expression instead
    // of a plain SUM/AVG so that multi-technology/region selections yield the correct
    // weighted result rather than a sum of per-technology values.
    const baseQueryBuilder = this.dataSource
      .getRepository(Projection)
      .createQueryBuilder('projection')
      .select('projectionData.year', 'year')
      .innerJoin('projection.projectionData', 'projectionData')
      .orderBy('projectionData.year', 'ASC');

    if (ratioConfig) {
      baseQueryBuilder
        .addSelect(this.buildRatioSelectExpression(ratioConfig), 'value')
        .addSelect(`'${ratioConfig.unit}'::text`, 'unit')
        .groupBy('projectionData.year');
    } else {
      baseQueryBuilder
        .addSelect(
          `CASE
            WHEN projection.unit = '%' THEN AVG(projectionData.value)
            ELSE SUM(projectionData.value)
          END`,
          'value',
        )
        .addSelect('projection.unit', 'unit')
        .groupBy('projectionData.year')
        .addGroupBy('projection.unit');
    }

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

    const parameters = Object.values(baseQueryBuilder.getParameters()).flat();
    const result = await this.dataSource.query(finalQuery, parameters);
    return result[0]?.data;
  }

  public async findProjectionTableData(
    dataFilters: SearchFilterDTO[],
    indicator: string,
  ): Promise<CustomProjection> {
    const baseQueryBuilder = this.dataSource
      .getRepository(Projection)
      .createQueryBuilder('projection')
      .select('projectionData.year', 'year')
      .addSelect('projectionData.value', 'value')
      .addSelect('projection.scenario', 'scenario')
      .addSelect('projection.technology', 'technology')
      .addSelect('projection.technologyType', 'technology_type')
      .addSelect('projection.country', 'country')
      .addSelect('projection.category', 'category')
      .addSelect('projection.unit', 'unit')
      .innerJoin('projection.projectionData', 'projectionData')
      .where('projection.type = :type', { type: indicator })
      .orderBy('projectionData.year', 'ASC');

    QueryBuilderUtils.applySearchFilters(baseQueryBuilder, dataFilters, {
      alias: 'projection',
      filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
    });

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
              'value', value,
              'scenario', ${this.getConditionalHumanizationSql('scenario', 'scenario')},
              'technology', ${this.getConditionalHumanizationSql('technology', 'technology')},
              'technologyType', ${this.getConditionalHumanizationSql('technology_type', 'technology-type')},
              'country', ${this.getConditionalHumanizationSql('country', 'country')},
              'category', category
            )
            ORDER BY year ASC
          ) as unit_data
        FROM (${baseQueryBuilder.getSql()}) as base_data
        GROUP BY unit
      ) as grouped_data
    `;

    const parameters = Object.values(baseQueryBuilder.getParameters()).flat();
    const result = await this.dataSource.query(finalQuery, parameters);
    return result[0]?.data || {};
  }

  public async findSimpleProjectionCustomWidgetData(
    widgetVisualization: ProjectionVisualizationsType,
    dataFilters: SearchFilterDTO[],
    settings: CustomProjectionSettingsType,
    othersAggregation: OthersAggregationType = 'visible',
  ): Promise<CustomProjection> {
    const verticalAxis = settings[widgetVisualization].vertical;
    const colorAxis =
      PROJECTION_FILTER_NAME_TO_FIELD_NAME[settings[widgetVisualization].color];
    const colorFieldName = settings[widgetVisualization].color;
    const ratioConfig = PROJECTION_RATIO_CONFIG[verticalAxis as ProjectionType];

    // Base query with all necessary groupings and filters.
    // Ratio types use a conditional-SUM ratio instead of a plain SUM.
    const baseQueryBuilder = this.dataSource
      .getRepository(Projection)
      .createQueryBuilder('projection')
      .select('projectionData.year', 'year')
      .addSelect(`projection.${colorAxis}`, 'color')
      .innerJoin('projection.projectionData', 'projectionData')
      .groupBy('projectionData.year')
      .addGroupBy(`projection.${colorAxis}`)
      .orderBy('projectionData.year')
      .addOrderBy(`projection.${colorAxis}`);

    if (ratioConfig) {
      // Carry raw sums so Others bucket is computed as Σnum/Σden, not SUM(ratio).
      baseQueryBuilder
        .addSelect(this.buildRatioNumeratorSumExpression(ratioConfig), 'num_sum')
        .addSelect(this.buildRatioDenominatorSumExpression(ratioConfig), 'den_sum')
        .addSelect(`'${ratioConfig.unit}'::text`, 'unit')
        .where('projection.type IN (:...ratioTypes)', {
          ratioTypes: [ratioConfig.numerator, ratioConfig.denominator],
        });
    } else {
      baseQueryBuilder
        .addSelect('SUM(projectionData.value)', 'vertical')
        .addSelect('projection.unit', 'unit')
        .where('projection.type = :type', { type: verticalAxis })
        .addGroupBy('projection.type')
        .addGroupBy('projection.unit')
        .addOrderBy('projection.type');
    }

    QueryBuilderUtils.applySearchFilters(baseQueryBuilder, dataFilters, {
      alias: 'projection',
      filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
    });

    const showOthers = othersAggregation !== 'hidden';
    const rankLimit = showOthers ? 9 : 10;
    const finalColorCase = showOthers
      ? `CASE WHEN rc.rank <= ${rankLimit} THEN bd.color::text ELSE 'Others' END`
      : `bd.color::text`;

    // Use database-level logic to handle top colors per unit.
    // Ratio types carry raw num/den through all CTEs and compute the ratio
    // only at the JSON build stage, so the Others bucket is correct.
    const finalQuery = ratioConfig
      ? `
      WITH base_data AS (
        ${baseQueryBuilder.getSql()}
      ),
      unit_color_totals AS (
        SELECT
          unit,
          color,
          ${this.buildRatioFromSumsExpression('SUM(num_sum)', 'SUM(den_sum)', ratioConfig.multiplier)} as total_vertical
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
          ${finalColorCase} as final_color,
          SUM(bd.num_sum) as num_sum,
          SUM(bd.den_sum) as den_sum
        FROM base_data bd
        JOIN ranked_colors rc ON bd.unit = rc.unit AND bd.color = rc.color
        ${!showOthers ? `WHERE rc.rank <= ${rankLimit}` : ''}
        GROUP BY bd.unit, bd.year, ${finalColorCase}
      )
      SELECT
        JSON_OBJECT_AGG(unit, unit_data) as data
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
              'vertical', ${this.buildRatioFromSumsExpression('num_sum', 'den_sum', ratioConfig.multiplier)}
            )
            ORDER BY year ASC, final_color
          ) as unit_data
        FROM processed_data
        GROUP BY unit
      ) as grouped_data
      `
      : `
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
          ${finalColorCase} as final_color,
          SUM(bd.vertical) as vertical
        FROM base_data bd
        JOIN ranked_colors rc ON bd.unit = rc.unit AND bd.color = rc.color
        ${!showOthers ? `WHERE rc.rank <= ${rankLimit}` : ''}
        GROUP BY bd.unit, bd.year, ${finalColorCase}
      )
      SELECT
        JSON_OBJECT_AGG(unit, unit_data) as data
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

    const parameters = Object.values(baseQueryBuilder.getParameters()).flat();
    const result = await this.dataSource.query(finalQuery, parameters);

    return result[0]?.data || {};
  }

  public async previewProjectionCustomWidget(
    dataFilters: SearchFilterDTO[],
    settings: CustomProjectionSettingsType,
    breakdown?: string,
    othersAggregation: OthersAggregationType = 'visible',
  ): Promise<CustomProjection> {
    const widgetVisualization = Object.keys(
      settings,
    )[0] as ProjectionVisualizationsType;

    if (breakdown) {
      if (widgetVisualization === PROJECTION_VISUALIZATIONS.BUBBLE_CHART) {
        throw new BadRequestException(
          'Breakdown is not supported for bubble chart visualizations',
        );
      }
      return this.findBreakdownProjectionData(
        widgetVisualization,
        dataFilters,
        settings,
        breakdown,
        othersAggregation,
      );
    }

    switch (widgetVisualization) {
      case PROJECTION_VISUALIZATIONS.TABLE:
        const tableSettings = (settings as { table: { vertical: string } })
          .table;
        return this.findProjectionTableData(
          dataFilters,
          tableSettings.vertical,
        );
      case PROJECTION_VISUALIZATIONS.LINE_CHART:
      case PROJECTION_VISUALIZATIONS.BAR_CHART:
        // Only aggregate 'others' in findSimpleProjectionCustomWidgetData
        return this.findSimpleProjectionCustomWidgetData(
          widgetVisualization,
          dataFilters,
          settings,
          othersAggregation,
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

        const sizeRatio = PROJECTION_RATIO_CONFIG[size as ProjectionType];
        const verticalRatio = PROJECTION_RATIO_CONFIG[vertical as ProjectionType];
        const horizontalRatio = PROJECTION_RATIO_CONFIG[horizontal as ProjectionType];

        // Build base queries — each axis independently may be a ratio type.
        const sizeQueryBuilder = this.dataSource
          .getRepository(Projection)
          .createQueryBuilder('projection')
          .select('projectionData.year', 'year')
          .addSelect(`projection.${bubble}`, 'bubble')
          .addSelect(`projection.${color}`, 'color')
          .innerJoin('projection.projectionData', 'projectionData')
          .groupBy('projectionData.year')
          .addGroupBy(`projection.${bubble}`)
          .addGroupBy(`projection.${color}`)
          .orderBy('projectionData.year')
          .addOrderBy(`projection.${bubble}`)
          .addOrderBy(`projection.${color}`);

        if (sizeRatio) {
          sizeQueryBuilder
            .addSelect(this.buildRatioNumeratorSumExpression(sizeRatio), 'size_num')
            .addSelect(this.buildRatioDenominatorSumExpression(sizeRatio), 'size_den')
            .addSelect(`'${sizeRatio.unit}'::text`, 'unit')
            .where('projection.type IN (:...sizeTypes)', {
              sizeTypes: [sizeRatio.numerator, sizeRatio.denominator],
            });
        } else {
          sizeQueryBuilder
            .addSelect('SUM(projectionData.value)', 'size')
            .addSelect('projection.unit', 'unit')
            .where('projection.type = :type', { type: size })
            .addGroupBy('projection.type')
            .addGroupBy('projection.unit')
            .addOrderBy('projection.type');
        }

        QueryBuilderUtils.applySearchFilters(sizeQueryBuilder, dataFilters, {
          alias: 'projection',
          filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
        });

        const verticalQueryBuilder = this.dataSource
          .getRepository(Projection)
          .createQueryBuilder('projection')
          .select('projectionData.year', 'year')
          .addSelect(`projection.${bubble}`, 'bubble')
          .addSelect(`projection.${color}`, 'color')
          .innerJoin('projection.projectionData', 'projectionData')
          .groupBy('projectionData.year')
          .addGroupBy(`projection.${bubble}`)
          .addGroupBy(`projection.${color}`)
          .orderBy('projectionData.year')
          .addOrderBy(`projection.${bubble}`)
          .addOrderBy(`projection.${color}`);

        if (verticalRatio) {
          verticalQueryBuilder
            .addSelect(this.buildRatioNumeratorSumExpression(verticalRatio), 'vertical_num')
            .addSelect(this.buildRatioDenominatorSumExpression(verticalRatio), 'vertical_den')
            .addSelect(`'${verticalRatio.unit}'::text`, 'unit')
            .where('projection.type IN (:...verticalTypes)', {
              verticalTypes: [verticalRatio.numerator, verticalRatio.denominator],
            });
        } else {
          verticalQueryBuilder
            .addSelect('SUM(projectionData.value)', 'vertical')
            .addSelect('projection.unit', 'unit')
            .where('projection.type = :type', { type: vertical })
            .addGroupBy('projection.type')
            .addGroupBy('projection.unit')
            .addOrderBy('projection.type');
        }

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
          .addSelect(`projection.${bubble}`, 'bubble')
          .addSelect(`projection.${color}`, 'color')
          .innerJoin('projection.projectionData', 'projectionData')
          .groupBy('projectionData.year')
          .addGroupBy(`projection.${bubble}`)
          .addGroupBy(`projection.${color}`)
          .orderBy('projectionData.year')
          .addOrderBy(`projection.${bubble}`)
          .addOrderBy(`projection.${color}`);

        if (horizontalRatio) {
          horizontalQueryBuilder
            .addSelect(this.buildRatioNumeratorSumExpression(horizontalRatio), 'horizontal_num')
            .addSelect(this.buildRatioDenominatorSumExpression(horizontalRatio), 'horizontal_den')
            .addSelect(`'${horizontalRatio.unit}'::text`, 'unit')
            .where('projection.type IN (:...horizontalTypes)', {
              horizontalTypes: [horizontalRatio.numerator, horizontalRatio.denominator],
            });
        } else {
          horizontalQueryBuilder
            .addSelect('SUM(projectionData.value)', 'horizontal')
            .addSelect('projection.unit', 'unit')
            .where('projection.type = :type', { type: horizontal })
            .addGroupBy('projection.type')
            .addGroupBy('projection.unit')
            .addOrderBy('projection.type');
        }

        QueryBuilderUtils.applySearchFilters(
          horizontalQueryBuilder,
          dataFilters,
          {
            alias: 'projection',
            filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
          },
        );

        // Get parameters from each query builder
        const sizeParams = Object.values(
          sizeQueryBuilder.getParameters(),
        ).flat();
        const verticalParams = Object.values(
          verticalQueryBuilder.getParameters(),
        ).flat();
        const horizontalParams = Object.values(
          horizontalQueryBuilder.getParameters(),
        ).flat();

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

        const showOthers = othersAggregation !== 'hidden';
        const rankLimit = showOthers ? 9 : 10;

        const bubbleColorCase = showOthers
          ? `CASE WHEN rc.rank <= ${rankLimit} THEN cd.color::text ELSE 'Others' END`
          : `cd.color::text`;

        // Combined query — each axis carries raw num/den when it is a ratio type,
        // so the Others bucket is computed as Σnum/Σden rather than SUM(ratio).
        const combinedQuery = `
          WITH combined_data AS (
            SELECT
              size.unit,
              size.bubble,
              size.color,
              size.year,
              ${sizeRatio
                ? `COALESCE(size.size_num, 0) AS size_num, COALESCE(size.size_den, 0) AS size_den`
                : `COALESCE(size.size, 0) AS size`},
              ${verticalRatio
                ? `COALESCE(vertical.vertical_num, 0) AS vertical_num, COALESCE(vertical.vertical_den, 0) AS vertical_den`
                : `COALESCE(vertical.vertical, 0) AS vertical`},
              ${horizontalRatio
                ? `COALESCE(horizontal.horizontal_num, 0) AS horizontal_num, COALESCE(horizontal.horizontal_den, 0) AS horizontal_den`
                : `COALESCE(horizontal.horizontal, 0) AS horizontal`}
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
              ${horizontalRatio
                ? `${this.buildRatioFromSumsExpression('SUM(horizontal_num)', 'SUM(horizontal_den)', horizontalRatio.multiplier)} as total_horizontal`
                : `SUM(horizontal) as total_horizontal`}
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
              ${bubbleColorCase} as final_color,
              ${sizeRatio
                ? `SUM(cd.size_num) as size_num, SUM(cd.size_den) as size_den`
                : `SUM(cd.size) as size`},
              ${verticalRatio
                ? `SUM(cd.vertical_num) as vertical_num, SUM(cd.vertical_den) as vertical_den`
                : `SUM(cd.vertical) as vertical`},
              ${horizontalRatio
                ? `SUM(cd.horizontal_num) as horizontal_num, SUM(cd.horizontal_den) as horizontal_den`
                : `SUM(cd.horizontal) as horizontal`}
            FROM combined_data cd
            JOIN ranked_colors rc ON cd.unit = rc.unit AND cd.bubble = rc.bubble AND cd.color = rc.color
            ${!showOthers ? `WHERE rc.rank <= ${rankLimit}` : ''}
            GROUP BY cd.unit, cd.bubble, cd.year, ${bubbleColorCase}
          )
          SELECT
            JSON_OBJECT_AGG(unit, unit_data) as data
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
                  'size', ${sizeRatio ? this.buildRatioFromSumsExpression('size_num', 'size_den', sizeRatio.multiplier) : 'size'},
                  'vertical', ${verticalRatio ? this.buildRatioFromSumsExpression('vertical_num', 'vertical_den', verticalRatio.multiplier) : 'vertical'},
                  'horizontal', ${horizontalRatio ? this.buildRatioFromSumsExpression('horizontal_num', 'horizontal_den', horizontalRatio.multiplier) : 'horizontal'}
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

  private async findBreakdownProjectionData(
    widgetVisualization: ProjectionVisualizationsType,
    dataFilters: SearchFilterDTO[],
    settings: CustomProjectionSettingsType,
    breakdown: string,
    othersAggregation: OthersAggregationType = 'visible',
  ): Promise<CustomProjection> {
    const verticalAxis = settings[widgetVisualization].vertical;
    const breakdownFieldName =
      PROJECTION_FILTER_NAME_TO_FIELD_NAME[breakdown] || breakdown;
    const ratioConfig = PROJECTION_RATIO_CONFIG[verticalAxis as ProjectionType];

    const baseQueryBuilder = this.dataSource
      .getRepository(Projection)
      .createQueryBuilder('projection')
      .select('projectionData.year', 'year')
      .addSelect(`projection.${breakdownFieldName}`, 'breakdown_group')
      .innerJoin('projection.projectionData', 'projectionData')
      .groupBy('projectionData.year')
      .addGroupBy(`projection.${breakdownFieldName}`)
      .orderBy('projectionData.year', 'ASC');

    if (ratioConfig) {
      // Carry raw sums so Others bucket is computed as Σnum/Σden, not SUM(ratio).
      baseQueryBuilder
        .addSelect(this.buildRatioNumeratorSumExpression(ratioConfig), 'num_sum')
        .addSelect(this.buildRatioDenominatorSumExpression(ratioConfig), 'den_sum')
        .addSelect(`'${ratioConfig.unit}'::text`, 'unit')
        .where('projection.type IN (:...ratioTypes)', {
          ratioTypes: [ratioConfig.numerator, ratioConfig.denominator],
        });
    } else {
      baseQueryBuilder
        .addSelect(
          `CASE
            WHEN projection.unit = '%' THEN AVG(projectionData.value)
            ELSE SUM(projectionData.value)
          END`,
          'value',
        )
        .addSelect('projection.unit', 'unit')
        .where('projection.type = :type', { type: verticalAxis })
        .addGroupBy('projection.unit');
    }

    QueryBuilderUtils.applySearchFilters(baseQueryBuilder, dataFilters, {
      alias: 'projection',
      filterNameToFieldNameMap: PROJECTION_FILTER_NAME_TO_FIELD_NAME,
    });

    const showOthers = othersAggregation !== 'hidden';
    const rankLimit = showOthers ? 9 : 10;
    const finalGroupCase = showOthers
      ? `CASE WHEN rb.rank <= ${rankLimit} THEN bd.breakdown_group::text ELSE 'Others' END`
      : `bd.breakdown_group::text`;

    const finalQuery = ratioConfig
      ? `
      WITH base_data AS (
        ${baseQueryBuilder.getSql()}
      ),
      global_breakdown_totals AS (
        SELECT
          breakdown_group,
          ${this.buildRatioFromSumsExpression('SUM(num_sum)', 'SUM(den_sum)', ratioConfig.multiplier)} as total_value
        FROM base_data
        GROUP BY breakdown_group
      ),
      ranked_breakdown AS (
        SELECT
          breakdown_group,
          total_value,
          ROW_NUMBER() OVER (ORDER BY total_value DESC) as rank
        FROM global_breakdown_totals
      ),
      processed_data AS (
        SELECT
          bd.unit,
          bd.year,
          ${finalGroupCase} as final_group,
          SUM(bd.num_sum) as num_sum,
          SUM(bd.den_sum) as den_sum
        FROM base_data bd
        JOIN ranked_breakdown rb ON bd.breakdown_group = rb.breakdown_group
        ${!showOthers ? `WHERE rb.rank <= ${rankLimit}` : ''}
        GROUP BY bd.unit, bd.year, ${finalGroupCase}
      ),
      year_totals AS (
        SELECT
          unit,
          year,
          ${this.buildRatioFromSumsExpression('SUM(num_sum)', 'SUM(den_sum)', ratioConfig.multiplier)} as total
        FROM processed_data
        GROUP BY unit, year
      ),
      breakdown_groups AS (
        SELECT
          pd.unit,
          CASE
            WHEN pd.final_group = 'Others' THEN 'Others'
            ELSE ${this.getConditionalHumanizationSql('pd.final_group', breakdown)}
          END as group_label,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'label', pd.year::text,
              'value', ${this.buildRatioFromSumsExpression('pd.num_sum', 'pd.den_sum', ratioConfig.multiplier)},
              'total', yt.total
            )
            ORDER BY pd.year ASC
          ) as data
        FROM processed_data pd
        JOIN year_totals yt ON pd.unit = yt.unit AND pd.year = yt.year
        GROUP BY pd.unit, pd.final_group,
                 CASE
                   WHEN pd.final_group = 'Others' THEN 'Others'
                   ELSE ${this.getConditionalHumanizationSql('pd.final_group', breakdown)}
                 END
      )
      SELECT
        JSON_OBJECT_AGG(unit, unit_data) as data
      FROM (
        SELECT
          unit,
          JSON_AGG(
            JSON_BUILD_OBJECT('label', group_label, 'data', data)
            ORDER BY group_label
          ) as unit_data
        FROM breakdown_groups
        GROUP BY unit
      ) as grouped_data
      `
      : `
      WITH base_data AS (
        ${baseQueryBuilder.getSql()}
      ),
      global_breakdown_totals AS (
        SELECT
          breakdown_group,
          SUM(value) as total_value
        FROM base_data
        GROUP BY breakdown_group
      ),
      ranked_breakdown AS (
        SELECT
          breakdown_group,
          total_value,
          ROW_NUMBER() OVER (ORDER BY total_value DESC) as rank
        FROM global_breakdown_totals
      ),
      processed_data AS (
        SELECT
          bd.unit,
          bd.year,
          ${finalGroupCase} as final_group,
          SUM(bd.value) as value
        FROM base_data bd
        JOIN ranked_breakdown rb ON bd.breakdown_group = rb.breakdown_group
        ${!showOthers ? `WHERE rb.rank <= ${rankLimit}` : ''}
        GROUP BY bd.unit, bd.year, ${finalGroupCase}
      ),
      year_totals AS (
        SELECT
          unit,
          year,
          SUM(value) as total
        FROM processed_data
        GROUP BY unit, year
      ),
      breakdown_groups AS (
        SELECT
          pd.unit,
          CASE
            WHEN pd.final_group = 'Others' THEN 'Others'
            ELSE ${this.getConditionalHumanizationSql('pd.final_group', breakdown)}
          END as group_label,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'label', pd.year::text,
              'value', pd.value,
              'total', yt.total
            )
            ORDER BY pd.year ASC
          ) as data
        FROM processed_data pd
        JOIN year_totals yt ON pd.unit = yt.unit AND pd.year = yt.year
        GROUP BY pd.unit, pd.final_group,
                 CASE
                   WHEN pd.final_group = 'Others' THEN 'Others'
                   ELSE ${this.getConditionalHumanizationSql('pd.final_group', breakdown)}
                 END
      )
      SELECT
        JSON_OBJECT_AGG(unit, unit_data) as data
      FROM (
        SELECT
          unit,
          JSON_AGG(
            JSON_BUILD_OBJECT('label', group_label, 'data', data)
            ORDER BY group_label
          ) as unit_data
        FROM breakdown_groups
        GROUP BY unit
      ) as grouped_data
      `;

    const parameters = Object.values(baseQueryBuilder.getParameters()).flat();
    const result = await this.dataSource.query(finalQuery, parameters);

    return result[0]?.data || {};
  }
}
