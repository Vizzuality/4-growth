import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchFiltersDTO } from '@shared/dto/global/search-filters';
import { FetchSpecification } from 'nestjs-base-service';

@Injectable()
export class PageFiltersService {
  public constructor(
    protected readonly logger: Logger,
    @InjectRepository(PageFilter)
    private readonly pageFilterRepository: Repository<PageFilter>,
  ) {}

  public async listFilters(
    _query: FetchSpecification & SearchFiltersDTO,
  ): Promise<PageFilter[]> {
    return this.pageFilterRepository.find();
  }
}
