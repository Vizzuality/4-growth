import { QueryBuilderUtils } from './query-builder-utils';
import { SEARCH_FILTERS_OPERATORS } from '@shared/dto/global/search-filters';
import { SelectQueryBuilder } from 'typeorm';

function createMockQueryBuilder(): SelectQueryBuilder<any> {
  const whereClauses: { condition: string; params: Record<string, any> }[] = [];
  const qb = {
    andWhere: jest.fn((condition: string, params: Record<string, any>) => {
      whereClauses.push({ condition, params });
      return qb;
    }),
    getWhereClauses: () => whereClauses,
  } as unknown as SelectQueryBuilder<any>;
  return qb;
}

describe('QueryBuilderUtils.applySearchFilters', () => {
  it('EQUALS with a single value should generate = condition', () => {
    const qb = createMockQueryBuilder();
    QueryBuilderUtils.applySearchFilters(qb, [
      {
        name: 'status',
        operator: SEARCH_FILTERS_OPERATORS.EQUALS,
        values: ['active'],
      },
    ]);
    expect(qb.andWhere).toHaveBeenCalledWith('status = :filter_0', {
      filter_0: 'active',
    });
  });

  it('EQUALS with multiple values should generate IN condition', () => {
    const qb = createMockQueryBuilder();
    QueryBuilderUtils.applySearchFilters(qb, [
      {
        name: 'status',
        operator: SEARCH_FILTERS_OPERATORS.EQUALS,
        values: ['active', 'pending', 'done'],
      },
    ]);
    expect(qb.andWhere).toHaveBeenCalledWith('status IN (:...filter_0)', {
      filter_0: ['active', 'pending', 'done'],
    });
  });

  it('NOT_EQUALS with a single value should generate != condition', () => {
    const qb = createMockQueryBuilder();
    QueryBuilderUtils.applySearchFilters(qb, [
      {
        name: 'status',
        operator: SEARCH_FILTERS_OPERATORS.NOT_EQUALS,
        values: ['archived'],
      },
    ]);
    expect(qb.andWhere).toHaveBeenCalledWith('status != :filter_0', {
      filter_0: 'archived',
    });
  });

  it('NOT_EQUALS with multiple values should generate NOT IN condition', () => {
    const qb = createMockQueryBuilder();
    QueryBuilderUtils.applySearchFilters(qb, [
      {
        name: 'status',
        operator: SEARCH_FILTERS_OPERATORS.NOT_EQUALS,
        values: ['archived', 'deleted'],
      },
    ]);
    expect(qb.andWhere).toHaveBeenCalledWith('status NOT IN (:...filter_0)', {
      filter_0: ['archived', 'deleted'],
    });
  });

  it('IN with multiple values should generate IN condition', () => {
    const qb = createMockQueryBuilder();
    QueryBuilderUtils.applySearchFilters(qb, [
      {
        name: 'role',
        operator: SEARCH_FILTERS_OPERATORS.IN,
        values: ['admin', 'editor'],
      },
    ]);
    expect(qb.andWhere).toHaveBeenCalledWith('role IN (:...filter_0)', {
      filter_0: ['admin', 'editor'],
    });
  });

  it('EQUALS with multiple country names should map to ISO3 and use IN', () => {
    const qb = createMockQueryBuilder();
    QueryBuilderUtils.applySearchFilters(qb, [
      {
        name: 'country',
        operator: SEARCH_FILTERS_OPERATORS.EQUALS,
        values: ['Austria', 'Belgium', 'Germany'],
      },
    ]);
    expect(qb.andWhere).toHaveBeenCalledWith('country IN (:...filter_0)', {
      filter_0: ['AUT', 'BEL', 'DEU'],
    });
  });
});
