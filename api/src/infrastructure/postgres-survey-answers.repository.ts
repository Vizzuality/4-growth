import { DataSource, getMetadataArgsStorage, Repository } from 'typeorm';
import { ISurveyAnswerRepository } from '@api/infrastructure/survey-answer-repository.interface';
import { Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { WidgetDataFilter } from '@shared/dto/widgets/widget-data-filter';
import { SectionWithDataWidget } from '@shared/dto/sections/section.entity';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import {
  BaseWidgetWithData,
  WidgetChartData,
} from '@shared/dto/widgets/base-widget-data.interface';
import { WidgetUtils } from '@shared/dto/widgets/widget.utils';
import { SurveyAnswer } from '@shared/dto/surveys/survey-answer.entity';

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
    let filterClause: string;
    if (filters !== undefined) {
      filterClause = this.sqlAdapter.generateSqlFromWidgetDataFilters(filters);
    }

    const widgetDataPromises = [];
    for (let sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
      const section = sections[sectionIdx];
      const baseWidgets = section.baseWidgets;
      for (let widgetIdx = 0; widgetIdx < baseWidgets.length; widgetIdx++) {
        const widget = baseWidgets[widgetIdx];
        widgetDataPromises.push(this.addDataToWidget(widget, filterClause));
      }
    }

    await Promise.all(widgetDataPromises);
    return sections;
  }

  public async addSurveyDataToBaseWidget(
    widget: BaseWidgetWithData,
    params: { filters?: WidgetDataFilter[]; breakdown?: string } = {},
  ): Promise<BaseWidgetWithData> {
    const { filters, breakdown } = params;
    let filterClause: string;
    if (filters !== undefined) {
      filterClause = this.sqlAdapter.generateSqlFromWidgetDataFilters(filters);
    }
    if (breakdown === undefined) {
      await this.addDataToWidget(widget, filterClause);
    } else {
      await this.addBreakdownDataToWidget(widget, breakdown, filterClause);
    }
    return widget;
  }

  private async addDataToWidget(
    widget: BaseWidgetWithData,
    filterClause: string,
  ): Promise<void> {
    widget.data = {};

    // Check if the indicator is an edge case
    const methodName = this.edgeCasesMethodNameMap[widget.indicator];
    if (methodName !== undefined) {
      return this[methodName](widget, filterClause);
    }

    const [
      supportsChart,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      supportsSingleValue, // No generic implementation for single value widgets for the time being
      supportsMap,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      supportsNavigation, //  No generic implementation navigation widgets for the time being
    ] = WidgetUtils.getSupportedVisualizations(widget);

    const dataPromises = [];
    if (supportsChart === true) {
      dataPromises.push(this.addChartDataToWidget(widget, filterClause));
    }

    if (supportsMap === true) {
      dataPromises.push(this.addMapDataToWidget(widget));
    }

    await Promise.all(dataPromises);
  }

  private async addChartDataToWidget(
    widget: BaseWidgetWithData,
    filterClause: string,
  ): Promise<void> {
    const totalsSql = `SELECT answer as "key", count(answer)::integer as "count", SUM(COUNT(answer)) OVER ()::integer AS total 
    FROM ${this.answersTable} ${this.sqlAdapter.appendExpressionToFilterClause(filterClause, `question_indicator = '${widget.indicator}'`)} GROUP BY answer`;
    const totalsResult: { key: string; count: number }[] =
      await this.dataSource.query(totalsSql);

    const arr: WidgetChartData = [];
    for (let rowIdx = 0; rowIdx < totalsResult.length; rowIdx++) {
      const res = totalsResult[rowIdx];
      arr.push({ label: res.key, value: res.count, total: res.count });
    }

    widget.data.chart = arr;
  }

  private async addMapDataToWidget(widget: BaseWidgetWithData): Promise<void> {
    const mapSql = `SELECT country_code as country, COUNT(survey_id)::integer AS "count" 
    FROM ${this.answersTable}
    GROUP BY country_code, question, answer
    HAVING question = $1 AND answer = 'Yes' ORDER BY country_code`;

    const result = await this.dataSource.query(mapSql, [widget.indicator]);
    widget.data.map = result;
  }

  private async addTotalSurveysDataToWidget(
    widget: BaseWidgetWithData,
    filterClause: string,
  ): Promise<void> {
    const filteredCount = `SELECT COUNT(count)::integer as count FROM (SELECT COUNT(DISTINCT survey_id) FROM ${this.answersTable} ${filterClause} GROUP BY survey_id) AS survey_count`;
    const totalCount = `SELECT COUNT(count)::integer as count FROM (SELECT COUNT(DISTINCT survey_id) FROM ${this.answersTable} GROUP BY survey_id) AS survey_count`;
    const [[{ count: value }], [{ count: total }]] = await Promise.all([
      this.dataSource.query(filteredCount),
      this.dataSource.query(totalCount),
    ]);
    widget.data.counter = { value, total };
  }

  private async addTotalCountriesDataToWidget(
    widget: BaseWidgetWithData,
    filterClause: string,
  ): Promise<void> {
    const filteredCount = `SELECT COUNT(DISTINCT country_code)::integer as "count" FROM ${this.answersTable} ${filterClause}`;
    const totalCount = `SELECT COUNT(DISTINCT country_code)::integer as "count" FROM ${this.answersTable};`;
    const [[{ count: value }], [{ count: total }]] = await Promise.all([
      this.dataSource.query(filteredCount),
      this.dataSource.query(totalCount),
    ]);
    widget.data.counter = { value, total };
  }

  private async addAdoptionOfTechnologyByCountryDataToWidget(
    widget: BaseWidgetWithData,
    filterClause: string,
  ): Promise<void> {
    // Best workaround to reference correct question without changing the frontend title ('Adoption of technology by country' once transformed)
    widget.indicator = 'digital-technologies-integrated';
    await Promise.all([
      this.addChartDataToWidget(widget, filterClause),
      this.addMapDataToWidget(widget),
    ]);
    widget.indicator = 'adoption-of-technology-by-country';
  }

  private async addBreakdownDataToWidget(
    widget: BaseWidgetWithData,
    breakdownIndicator: string,
    filterClause: string,
  ): Promise<void> {
    const sqlCode = `WITH breakdown_data AS (
    SELECT 
        main_answer,
        secondary_answer,
        COUNT(main_answer)::integer AS count,
        SUM(COUNT(main_answer)) OVER (PARTITION BY main_answer)::integer AS total_count
    FROM (
        SELECT
            main.answer AS main_answer,
            secondary.answer AS secondary_answer
        FROM 
            survey_answers AS main
        JOIN 
            survey_answers AS secondary
        ON 
            main.survey_id = secondary.survey_id 
            AND secondary.question_indicator = $1
        ${this.sqlAdapter.appendExpressionToFilterClause(filterClause, `question_indicator = '${widget.indicator}'`, 'main')}
    ) AS s
    GROUP BY 
        main_answer, secondary_answer
    ORDER BY 
        main_answer, secondary_answer
)
SELECT 
    main_answer AS label,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'label', secondary_answer,
            'value', count,
            'total', total_count
        )
    ) AS data
FROM breakdown_data
GROUP BY main_answer
ORDER BY main_answer`;

    const breakdown = await this.dataSource.query(sqlCode, [
      breakdownIndicator,
    ]);
    widget.data = { breakdown };
  }
}
