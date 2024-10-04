import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PageFiltersService {
  public constructor(
    protected readonly logger: Logger,
    @InjectRepository(PageFilter)
    private readonly pageFilterRepository: Repository<PageFilter>,
  ) {}

  public async listFilters(): Promise<PageFilter[]> {
    return await this.pageFilterRepository.find();
  }
}
