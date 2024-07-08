import {
  BaseService,
  DEFAULT_PAGINATION,
  FetchSpecification,
} from 'nestjs-base-service';

import * as JSONAPISerializer from 'jsonapi-serializer';
import { Repository } from 'typeorm';
import { Serializer } from 'jsonapi-serializer';
import { Logger } from '@nestjs/common';

export class PaginationMeta {
  totalPages: number;
  totalItems: number;
  size: number;
  page: number;

  constructor(paginationMeta: {
    totalPages: number;
    totalItems: number;
    size: number;
    page: number;
  }) {
    this.totalItems = paginationMeta.totalItems;
    this.totalPages = paginationMeta.totalPages;
    this.size = paginationMeta.size;
    this.page = paginationMeta.page;
  }
}

export abstract class AppBaseService<
  // eslint-disable-next-line @typescript-eslint/ban-types
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
    this.logger = new Logger(alias);
  }

  /**
   * @debt Add proper typing.
   */

  async serialize(
    entities: Partial<Entity> | (Partial<Entity> | undefined)[],
    paginationMeta?: PaginationMeta,
  ): Promise<any> {
    const serializer: Serializer = new JSONAPISerializer.Serializer(
      this.pluralAlias,
      {
        meta: paginationMeta,
      },
    );

    return serializer.serialize(entities);
  }

  /**
   * Curried wrapper for findAllPaginated(), defaulting to requesting raw
   * results rather than entities.
   */
  async findAllPaginatedRaw(
    fetchSpecification?: FetchSpecification,
    info?: Info,
  ): Promise<{
    data: (Partial<Entity> | undefined)[];
    metadata: PaginationMeta | undefined;
  }> {
    const entitiesAndCount: [Partial<Entity>[], number] = await this.findAllRaw(
      fetchSpecification,
      info,
    );
    return this._paginate(entitiesAndCount, fetchSpecification);
  }

  async findAllPaginated(
    fetchSpecification?: FetchSpecification,
    info?: Info,
  ): Promise<{
    data: (Partial<Entity> | undefined)[];
    metadata: PaginationMeta | undefined;
  }> {
    const entitiesAndCount: [Partial<Entity>[], number] = await this.findAll(
      fetchSpecification,
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
