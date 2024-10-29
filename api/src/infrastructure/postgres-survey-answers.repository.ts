import { DataSource, getMetadataArgsStorage, Repository } from 'typeorm';
import { ISurveyAnswerRepository } from '@api/infrastructure/survey-answer-repository.interface';
import { Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { WidgetDataFilters } from '@shared/dto/widgets/widget-data-filter';
import { SectionWithDataWidget } from '@shared/dto/sections/section.entity';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import {
  BaseWidgetWithData,
  WidgetChartData,
  WidgetData,
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
    filters?: WidgetDataFilters,
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
        widgetDataPromises.push(
          this.appendBaseWidgetData(widget, filterClause),
        );
      }
    }

    await Promise.all(widgetDataPromises);
    return sections;
  }

  public async addSurveyDataToBaseWidget(
    widget: BaseWidgetWithData,
    filters?: WidgetDataFilters,
  ): Promise<BaseWidgetWithData> {
    let filterClause: string;
    if (filters !== undefined) {
      filterClause = this.sqlAdapter.generateSqlFromWidgetDataFilters(filters);
    }

    await this.appendBaseWidgetData(widget, filterClause);
    return widget;
  }

  private async appendBaseWidgetData(
    widget: BaseWidgetWithData,
    filterClause: string,
  ): Promise<void> {
    const { indicator } = widget;

    // Check if the indicator is an edge case
    const methodName = this.edgeCasesMethodNameMap[indicator];
    if (methodName !== undefined) {
      return this[methodName](widget, filterClause);
    }

    const widgetData: WidgetData = {};
    const [
      supportsChart,
      supportsSingleValue,
      supportsMap,
      supportsNavigation,
    ] = WidgetUtils.getSupportedVisualizations(widget);

    if (supportsChart === true) {
      const totalsSql = `SELECT answer as "key", count(answer)::integer as "count", SUM(COUNT(answer)) OVER ()::integer AS total 
FROM ${this.answersTable} ${this.sqlAdapter.appendExpressionToFilterClause(filterClause, `question_indicator = '${indicator}'`)} GROUP BY answer`;
      const totalsResult: { key: string; count: number }[] =
        await this.dataSource.query(totalsSql);

      const arr: WidgetChartData = [];
      for (let rowIdx = 0; rowIdx < totalsResult.length; rowIdx++) {
        const res = totalsResult[rowIdx];
        arr.push({ label: res.key, value: res.count, total: res.count });
      }

      widgetData.chart = arr;
    }

    if (supportsSingleValue === true) {
      // TODO: Add WidgetCounterData
    }

    if (supportsMap === true) {
      const mapSql = `SELECT country_code as country, COUNT(survey_id)::integer AS "count" 
      FROM ${this.answersTable}
      GROUP BY country_code, question, answer
      HAVING question = '${widget.question}' AND answer = 'Yes'`;

      const result = await this.dataSource.query(mapSql);
      widgetData.map = result;
    }

    if (supportsNavigation === true) {
      // TODO: Add WidgetNavigationData
    }

    widget.data = widgetData;
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
    widget.data = { counter: { value, total } };
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
    widget.data = { counter: { value, total } };
  }
}
