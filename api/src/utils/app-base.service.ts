import {
  BaseService,
  DEFAULT_PAGINATION,
  FetchSpecification,
} from 'nestjs-base-service';

import { Repository } from 'typeorm';
import { PaginationMeta } from '@shared/dto/global/api-response.dto';

export abstract class AppBaseService<
  Entity extends object,
  CreateModel,
  UpdateModel,
  Info,
> extends BaseService<Entity, CreateModel, UpdateModel, Info> {
  constructor(
    protected readonly repository: Repository<Entity>,
    protected alias: string = 'base_entity',
    protected pluralAlias: string = 'base_entities',
    protected idProperty: string = 'id',
  ) {
    super(repository, alias, { idProperty });
  }

  async findAllPaginated(
    fetchSpecification?: FetchSpecification,
    extraOps?: Record<string, any>,
    info?: Info,
  ): Promise<{
    data: (Partial<Entity> | undefined)[];
    metadata: PaginationMeta | undefined;
  }> {
    const entitiesAndCount: [Partial<Entity>[], number] = await this.findAll(
      { ...fetchSpecification, ...extraOps },
      info,
    );
    return this._paginate(entitiesAndCount, fetchSpecification);
  }

  private _paginate(
    entitiesAndCount: [Partial<Entity>[], number],
    fetchSpecification?: FetchSpecification,
  ): {
    data: (Partial<Entity> | undefined)[];
    metadata: PaginationMeta | undefined;
  } {
    const totalItems: number = entitiesAndCount[1];
    const entities: Partial<Entity>[] = entitiesAndCount[0];
    const pageSize: number =
      fetchSpecification?.pageSize ?? DEFAULT_PAGINATION.pageSize ?? 25;
    const page: number =
      fetchSpecification?.pageNumber ?? DEFAULT_PAGINATION.pageNumber ?? 1;
    const disablePagination: boolean | undefined =
      fetchSpecification?.disablePagination;
    const meta: PaginationMeta | undefined = disablePagination
      ? undefined
      : new PaginationMeta({
          totalPages: Math.ceil(totalItems / pageSize),
          totalItems,
          size: pageSize,
          page,
        });

    return { data: entities, metadata: meta };
  }
}
