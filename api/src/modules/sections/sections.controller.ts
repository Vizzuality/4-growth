import { Controller } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { sectionContract as c } from '@shared/contracts/sections.contract';
import { ControllerResponse } from '@api/types/controller.type';
import { SectionsService } from '@api/modules/sections/sections.service';
import { Public } from '@api/decorators/is-public.decorator';

@Controller()
export class SectionsController {
  public constructor(private readonly sectionsService: SectionsService) {}

  @Public()
  @TsRestHandler(c.searchSections)
  public async searchSections(): Promise<ControllerResponse> {
    return tsRestHandler(c.searchSections, async ({ query }) => {
      const data = await this.sectionsService.findAllPaginated(query);
      return { body: data, status: 200 };
    });
  }
}
