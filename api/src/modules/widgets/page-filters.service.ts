import { Repository, SelectQueryBuilder } from 'typeorm';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SEARCH_FILTERS_OPERATORS,
  SearchFilterDTO,
  SearchFiltersDTO,
} from '@shared/dto/global/search-filters';
import { FetchSpecification } from 'nestjs-base-service';
import { SurveyAnswer } from '@shared/dto/surveys/survey-answer.entity';
import {
  ISurveyAnswerRepository,
  SurveyAnswerRepository,
} from '@api/infrastructure/survey-answer-repository.interface';

@Injectable()
export class PageFiltersService {
  public constructor(
    protected readonly logger: Logger,
    @InjectRepository(PageFilter)
    private readonly pageFilterRepository: Repository<PageFilter>,
    @Inject(SurveyAnswerRepository)
    private readonly surveyAnswerRepository: ISurveyAnswerRepository,
  ) {}

  public async listFilters(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    query: FetchSpecification & SearchFiltersDTO,
  ): Promise<PageFilter[]> {
    const availablePageFilters = await this.pageFilterRepository.find();
    return availablePageFilters;
    // if (!query.filters) return availablePageFilters;

    // const result: PageFilter[] = await Promise.all(
    //   availablePageFilters.map(async (filter) => {
    //     const mainQuery = this.surveyAnswerRepository
    //       .createQueryBuilder('sa')
    //       .select('JSON_AGG(DISTINCT sa.answer)', 'values');

    //     this.applySearchFilters(mainQuery, query.filters);

    //     mainQuery.andWhere('sa.questionIndicator = :targetIndicator', {
    //       targetIndicator: filter.name,
    //     });

    //     const { values } = await mainQuery.getRawOne();
    //     return {
    //       name: filter.name,
    //       values: values ? values : [],
    //     };
    //   }),
    // );
    // return result;
  }

  private applySearchFilters(
    queryBuilder: SelectQueryBuilder<SurveyAnswer>,
    filters: SearchFilterDTO[],
  ): void {
    const subQuery = this.surveyAnswerRepository
      .createQueryBuilder('sa')
      .subQuery()
      .select('sub.surveyId')
      .from(SurveyAnswer, 'sub');

    const filterConditions: string[] = [];
    const subQueryParams: Record<string, any> = {};

    for (let idx = 0; idx < filters.length; idx++) {
      const filter = filters[idx];

      if (filter.values?.length > 0) {
        const qiKey = `filterIndicator${idx}`;

        if (filter.operator === SEARCH_FILTERS_OPERATORS.EQUALS) {
          const ansKey = `filterAnswer${idx}`;
          filterConditions.push(
            `(sub.questionIndicator = :${qiKey} AND sub.answer = :${ansKey})`,
          );
          subQueryParams[qiKey] = filter.name;
          subQueryParams[ansKey] = filter.values[0];
        } else if (filter.operator === SEARCH_FILTERS_OPERATORS.IN) {
          const ansKey = `filterAnswers${idx}`;
          filterConditions.push(
            `(sub.questionIndicator = :${qiKey} AND sub.answer IN (:...${ansKey}))`,
          );
          subQueryParams[qiKey] = filter.name;
          subQueryParams[ansKey] = filter.values;
        }
      }
    }

    if (filterConditions.length > 0) {
      subQuery.where(filterConditions.join(' OR '));
      subQuery.groupBy('sub.surveyId');
      subQuery.having(`COUNT(DISTINCT sub.questionIndicator) = :filterCount`);
      subQueryParams['filterCount'] = filterConditions.length;
    }

    queryBuilder.andWhere(`sa.surveyId IN ${subQuery.getQuery()}`);
    queryBuilder.setParameters(subQueryParams);
  }
}
