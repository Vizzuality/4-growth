/**
 * @description Generic PaginationMetadata
 */

export class PaginationMeta {
  totalPages: number;
  totalItems: number;
  size: number;
  page: number;

  constructor(paginationMeta: {
    totalPages: number;
    totalItems: number;
    size: number | string;
    page: number | string;
  }) {
    this.totalItems = paginationMeta.totalItems;
    this.totalPages = paginationMeta.totalPages;
    this.size =
      typeof paginationMeta.size === 'string'
        ? parseInt(paginationMeta.size)
        : paginationMeta.size;
    this.page =
      typeof paginationMeta.page === 'string'
        ? parseInt(paginationMeta.page)
        : paginationMeta.page;
  }
}

/**
 * @description Generic ApiResponse
 */

export class ApiResponse<T> {
  data: T;
}

export class ApiPaginationResponse<T> {
  data: Partial<T>[];
  metadata?: PaginationMeta;
}
