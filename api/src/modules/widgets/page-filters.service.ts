import { Repository, DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  SearchFiltersDTO,
  SearchFilterDTO,
} from '@shared/dto/global/search-filters';
import { WidgetDataFilter } from '@shared/dto/widgets/widget-data-filter';
import { FetchSpecification } from 'nestjs-base-service';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import { DATA_SOURCE_FILTER_NAME } from '@shared/constants/page-filters';

const ANSWERS_TABLE = 'survey_answers';

@Injectable()
export class PageFiltersService {
  public constructor(
    protected readonly logger: Logger,
    @InjectRepository(PageFilter)
    private readonly pageFilterRepository: Repository<PageFilter>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly sqlAdapter: SQLAdapter,
  ) {}

  public async listFilters(
    query: FetchSpecification & SearchFiltersDTO,
  ): Promise<PageFilter[]> {
    const seeded = await this.pageFilterRepository.find();
    const filters = query.filters;
    if (!filters || filters.length === 0) return seeded;

    const pruned = await Promise.all(
      seeded.map(async (filter) => {
        const otherFilters = filters.filter((f) => f.name !== filter.name);
        const liveValues = await this.getLiveValues(filter.name, otherFilters);
        return {
          ...filter,
          values: filter.values.filter((v) => liveValues.has(v)),
        };
      }),
    );

    return pruned;
  }

  private async getLiveValues(
    filterName: string,
    otherFilters: SearchFilterDTO[],
  ): Promise<Set<string>> {
    const [scopeClause, queryParams] =
      this.sqlAdapter.generateFilterClauseFromWidgetDataFilters(
        otherFilters as unknown as WidgetDataFilter[],
      );

    let sql: string;
    let params: unknown[];

    if (filterName === DATA_SOURCE_FILTER_NAME) {
      sql = `SELECT DISTINCT data_source AS value FROM ${ANSWERS_TABLE} ${scopeClause}`;
      params = queryParams;
    } else {
      const paramIdx = queryParams.length + 1;
      const scopeCondition = scopeClause
        ? ` AND survey_id IN (SELECT survey_id FROM ${ANSWERS_TABLE} ${scopeClause})`
        : '';
      sql = `SELECT DISTINCT answer AS value FROM ${ANSWERS_TABLE} WHERE question_indicator = $${paramIdx}${scopeCondition}`;
      params = [...queryParams, filterName];
    }

    const rows: { value: string }[] = await this.dataSource.query(sql, params);
    return new Set(rows.map((r) => r.value));
  }
}
