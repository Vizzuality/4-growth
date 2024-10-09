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
      // TODO: There is a bug / weird behavior in typeorm when using take and skip with leftJoinAndSelect:
      //       https://github.com/typeorm/typeorm/issues/4742#issuecomment-780702477
      //       Since we don't need pagination for this endpoint, we can disable it for now but worth checking
      const [data] = await this.sectionsService.findAll({
        ...query,
        disablePagination: true,
      });

      return { body: { data }, status: 200 };
    });
  }
}
