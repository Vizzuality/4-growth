import { Controller } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { pageFiltersContract as c } from '@shared/contracts/page-filters.contract';
import { ControllerResponse } from '@api/types/controller.type';
import { PageFiltersService } from '@api/modules/widgets/page-filters.service';
import { Public } from '@api/decorators/is-public.decorator';

@Controller()
export class PageFiltersController {
  public constructor(private readonly pageFiltersService: PageFiltersService) {}

  @Public()
  @TsRestHandler(c.searchFilters)
  public async searchPageFilters(): Promise<ControllerResponse> {
    return tsRestHandler(c.searchFilters, async () => {
      const data = await this.pageFiltersService.listFilters();
      return { body: { data }, status: 200 };
    });
  }
}
