import { DataSource, getMetadataArgsStorage, Repository } from 'typeorm';
import { ISurveyAnswerRepository } from '@api/infrastructure/survey-answer-repository.interface';
import { Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { WidgetDataFilter } from '@shared/dto/widgets/widget-data-filter';
import { SectionWithDataWidget } from '@shared/dto/sections/section.entity';
import {
  FilterClauseWithParams,
  SQLAdapter,
} from '@api/infrastructure/sql-adapter';
import {
  BaseWidgetWithData,
  WidgetChartData,
} from '@shared/dto/widgets/base-widget-data.interface';
import { WidgetUtils } from '@shared/dto/widgets/widget.utils';
import { SurveyAnswer } from '@shared/dto/surveys/survey-answer.entity';
import { SEARCH_FILTERS_OPERATORS } from '@shared/dto/global/search-filters';

export class PostgresSurveyAnswerRepository
  extends Repository<SurveyAnswer>
  implements ISurveyAnswerRepository
{
  private readonly answersTable: string;
  private readonly edgeCasesMethodNameMap: Record<string, string> = {
    'total-surveys': this.addTotalSurveysDataToWidget.name,
    'total-countries': this.addTotalCountriesDataToWidget.name,
    'adoption-of-technology-by-country':
      this.addAdoptionOfTechnologyByCountryDataToWidget.name,
  };

  public constructor(
    private readonly logger: Logger,
    @Inject(SQLAdapter) private readonly sqlAdapter: SQLAdapter,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
    super(SurveyAnswer, dataSource.manager);
    this.answersTable = this.getAnswersTableName();
  }

  private getAnswersTableName(): string {
    const ormMetadata = getMetadataArgsStorage();
    const tableMetadata = ormMetadata.tables.find(
      (table) => table.target === SurveyAnswer,
    );
    if (tableMetadata === undefined) {
      throw new Error(`Table metadata for ${SurveyAnswer.name} not found`);
    }
    return tableMetadata.name;
  }

  public async addSurveyDataToSections(
    sections: SectionWithDataWidget[],
    filters?: WidgetDataFilter[],
  ): Promise<SectionWithDataWidget[]> {
    const widgetDataPromises = [];
    for (let sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
      const section = sections[sectionIdx];
      const baseWidgets = section.baseWidgets;
      for (let widgetIdx = 0; widgetIdx < baseWidgets.length; widgetIdx++) {
        const widget = baseWidgets[widgetIdx];
        widgetDataPromises.push(this.addDataToWidget(widget, filters));
      }
    }

    await Promise.all(widgetDataPromises);
    return sections;
  }

  public async addSurveyDataToBaseWidget(
    widget: BaseWidgetWithData,
    params: { filters?: WidgetDataFilter[]; breakdownIndicator?: string } = {},
  ): Promise<BaseWidgetWithData> {
    const { filters, breakdownIndicator } = params;
    if (breakdownIndicator === undefined) {
      await this.addDataToWidget(widget, filters);
    } else {
      const filterClauseWithParams =
        this.sqlAdapter.generateFilterClauseFromWidgetDataFilters(filters, {
          alias: 'main',
        });
      await this.addBreakdownDataToWidget(
        widget,
        breakdownIndicator,
        filterClauseWithParams,
      );
    }
    return widget;
  }

  private async addDataToWidget(
    widget: BaseWidgetWithData,
    filters: WidgetDataFilter[],
  ): Promise<void> {
    widget.data = {};

    // Check if the indicator is an edge case
    const methodName = this.edgeCasesMethodNameMap[widget.indicator];
    if (methodName !== undefined) {
      return this[methodName](widget, filters);
    }

    const [supportsChart, supportsMap] =
      WidgetUtils.getSupportedVisualizations(widget);

    const dataPromises = [];
    if (supportsChart === true) {
      dataPromises.push(this.addChartDataToWidget(widget, filters));
    }

    if (supportsMap === true) {
      dataPromises.push(this.addMapDataToWidget(widget, filters));
    }

    await Promise.all(dataPromises);
  }

  private async addChartDataToWidget(
    widget: BaseWidgetWithData,
    filters: WidgetDataFilter[],
  ): Promise<void> {
    const filterClauseWithParams =
      this.sqlAdapter.generateFilterClauseFromWidgetDataFilters(filters);
    const [filterClause, queryParams] = filterClauseWithParams;

    const newParams = [...queryParams, widget.indicator];
    const totalsSql = `SELECT answer as "key", count(answer)::integer as "count", SUM(COUNT(answer)) OVER ()::integer AS total 
    FROM ${this.answersTable} 
    WHERE survey_id IN (SELECT survey_id FROM ${this.answersTable} ${filterClause}) AND question_indicator = $${newParams.length}
    GROUP BY answer ORDER BY answer`;

    const totalsResult: { key: string; count: number; total: number }[] =
      await this.dataSource.query(totalsSql, newParams);

    const arr: WidgetChartData = [];
    for (let rowIdx = 0; rowIdx < totalsResult.length; rowIdx++) {
      const res = totalsResult[rowIdx];
      arr.push({ label: res.key, value: res.count, total: res.total });
    }

    widget.data.chart = arr;
  }

  private async addMapDataToWidget(
    widget: BaseWidgetWithData,
    filters: WidgetDataFilter[],
  ): Promise<void> {
    const mapFilters: WidgetDataFilter[] = [
      {
        name: 'question_indicator',
        operator: SEARCH_FILTERS_OPERATORS.EQUALS,
        values: [widget.indicator],
      },
      {
        name: 'answer',
        operator: SEARCH_FILTERS_OPERATORS.EQUALS,
        values: ['Yes', 'No'],
      },
    ];

    const countriesFilter = filters?.find(
      (f) => f.name === 'location-country-region',
    );
    if (countriesFilter) {
      mapFilters.push(countriesFilter);
    }

    const filterClauseWithParams =
      this.sqlAdapter.generateFilterClauseForMapWidget(mapFilters, {
        alias: 'sa',
      });

    const [filterClause, queryParams] = filterClauseWithParams;
    const mapSql = `
    -- 1) Get distinct countries that appear in the survey_answers table
WITH all_countries AS (
  SELECT unnest(ARRAY[
    'AUT','BEL','BGR','HRV','CYP','CZE','DNK','EST','FIN','FRA',
    'DEU','GRC','HUN','IRL','ITA','LVA','LTU','LUX','MLT','NLD',
    'POL','PRT','ROU','SVK','SVN','ESP','SWE'
  ]) AS country
),

-- 2) Count Yes/No per country for the given question
answer_counts AS (
  SELECT
    sa.country_code,
    sa.answer,
    COUNT(*) AS cnt
  FROM ${this.answersTable} sa
  ${filterClause}
  GROUP BY sa.country_code, sa.answer
),

-- 3) Pivot into yes_count and total_count
by_country AS (
  SELECT
    country_code,
    SUM(CASE WHEN answer = 'Yes' THEN cnt ELSE 0 END) AS yes_cnt,
    SUM(cnt) AS total_cnt
  FROM answer_counts
  GROUP BY country_code
)

-- 4) Join everything so every country from survey_answers is present
SELECT
  ac.country,
  CASE
    WHEN bc.total_cnt > 0
      THEN 100.0 * bc.yes_cnt / bc.total_cnt   -- proportion (0-1)
    ELSE NULL                                  -- no data for this question -> gray
  END AS value
FROM all_countries ac
LEFT JOIN by_country bc
  ON bc.country_code = ac.country
ORDER BY ac.country;`;
    const result = await this.dataSource.query(mapSql, queryParams);
    widget.data.map = result;
  }

  private async addTotalSurveysDataToWidget(
    widget: BaseWidgetWithData,
    filters: WidgetDataFilter[],
  ): Promise<void> {
    const filterClauseWithParams =
      this.sqlAdapter.generateFilterClauseFromWidgetDataFilters(filters);
    const [filterClause, queryParams] = filterClauseWithParams;

    const filteredCount = `SELECT COUNT(count)::integer as count FROM (SELECT COUNT(DISTINCT survey_id) FROM ${this.answersTable} ${filterClause} GROUP BY survey_id) AS survey_count`;
    const totalCount = `SELECT COUNT(count)::integer as count FROM (SELECT COUNT(DISTINCT survey_id) FROM ${this.answersTable} GROUP BY survey_id) AS survey_count`;
    const [[{ count: value }], [{ count: total }]] = await Promise.all([
      this.dataSource.query(filteredCount, queryParams),
      this.dataSource.query(totalCount),
    ]);
    widget.data.counter = { value, total };
  }

  private async addTotalCountriesDataToWidget(
    widget: BaseWidgetWithData,
    filters: WidgetDataFilter[],
  ): Promise<void> {
    const filterClauseWithParams =
      this.sqlAdapter.generateFilterClauseFromWidgetDataFilters(filters);
    const [filterClause, queryParams] = filterClauseWithParams;

    const filteredCount = `SELECT COUNT(DISTINCT country_code)::integer as "count" FROM ${this.answersTable} ${filterClause}`;
    const totalCount = `SELECT COUNT(DISTINCT country_code)::integer as "count" FROM ${this.answersTable};`;
    const [[{ count: value }], [{ count: total }]] = await Promise.all([
      this.dataSource.query(filteredCount, queryParams),
      this.dataSource.query(totalCount),
    ]);
    widget.data.counter = { value, total };
  }

  private async addAdoptionOfTechnologyByCountryDataToWidget(
    widget: BaseWidgetWithData,
    filters: WidgetDataFilter[],
  ): Promise<void> {
    // Best workaround to reference correct question without changing the frontend title ('Adoption of technology by country' once transformed)
    widget.indicator = 'digital-technologies-integrated';

    await Promise.all([
      this.addChartDataToWidget(widget, filters),
      this.addMapDataToWidget(widget, filters),
    ]);
    widget.indicator = 'adoption-of-technology-by-country';
  }

  private async addBreakdownDataToWidget(
    widget: BaseWidgetWithData,
    breakdownIndicator: string,
    filterClauseWithParams: FilterClauseWithParams,
  ): Promise<void> {
    const [filterClause, queryParams] =
      this.sqlAdapter.addExpressionToFilterClause(
        filterClauseWithParams,
        ['question_indicator', '=', widget.indicator],
        'main',
      );

    const sqlCode = `WITH breakdown_counts AS (
    SELECT 
        main_answer,
        secondary_answer,
        COUNT(*)::integer AS count
    FROM (
        SELECT
            secondary.answer AS main_answer,
            main.answer AS secondary_answer
        FROM 
            survey_answers AS main
        JOIN 
            survey_answers AS secondary
        ON 
            main.survey_id = secondary.survey_id AND secondary.question_indicator = $${queryParams.length + 1}
        ${filterClause}
    ) AS s
    GROUP BY 
        main_answer, secondary_answer
),
breakdown_data AS (
    SELECT 
        main_answer,
        secondary_answer,
        count,
        SUM(count) OVER (PARTITION BY main_answer)::integer AS total_count
    FROM breakdown_counts
)
SELECT 
    main_answer AS label,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'label', secondary_answer,
            'value', count,
            'total', total_count
        ) ORDER BY count DESC
    ) AS data
FROM breakdown_data
GROUP BY main_answer
ORDER BY main_answer`;

    queryParams.push(breakdownIndicator);
    const breakdown = await this.dataSource.query(sqlCode, queryParams);

    // Apply "others" grouping strategy: limit to top 5 secondary answers per main answer
    const maxGroups = 6;
    const processedBreakdown = breakdown.map((item: any) => {
      const data = item.data as Array<{
        label: string;
        value: number;
        total: number;
      }>;

      // If we have fewer items than the limit, return as is
      if (data.length <= maxGroups) {
        return item;
      }

      // Sort by value descending to get top answers
      const sortedData = [...data].sort((a, b) => b.value - a.value);

      // Keep top answers (maxGroups - 1)
      const topAnswers = sortedData.slice(0, maxGroups - 1);
      const remainingAnswers = sortedData.slice(maxGroups - 1);

      // Aggregate remaining answers into "Others"
      const othersSum = remainingAnswers.reduce(
        (sum, answer) => sum + answer.value,
        0,
      );

      // Add top answers first, then "Others" (same pattern as projections)
      const processedData = [...topAnswers];
      if (othersSum > 0) {
        processedData.push({
          label: 'Others',
          value: othersSum,
          total: data[0].total,
        });
      }

      return {
        ...item,
        data: processedData,
      };
    });

    widget.data = { breakdown: processedBreakdown };
  }
}
