import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { PageFilter } from '@shared/dto/widgets/page-filter.dto';

@Injectable()
export class PageFiltersService {
  private filters: PageFilter[];

  public constructor() {
    this.filters = JSON.parse(
      fs.readFileSync('data/filters/filters.json', 'utf-8'),
    );
  }

  public async listFilters(): Promise<PageFilter[]> {
    return this.filters;
  }
}
