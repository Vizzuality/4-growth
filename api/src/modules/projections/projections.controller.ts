import { Controller } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { projectionsContract as c } from '@shared/contracts/projections.contract';
import { ControllerResponse } from '@api/types/controller.type';
import { Public } from '@api/decorators/is-public.decorator';
import { ProjectionsService } from '@api/modules/projections/projections.service';

@Controller()
export class ProjectionsController {
  public constructor(private readonly projectionsService: ProjectionsService) {}

  @Public()
  @TsRestHandler(c.getProjectionsFilters)
  public async getProjectionsFilters(): Promise<ControllerResponse> {
    return tsRestHandler(c.getProjectionsFilters, async ({ query }) => {
      const data = await this.projectionsService.getProjectionsFilters(query);

      return { body: { data }, status: 200 };
    });
  }

  // @Public()
  // @TsRestHandler(c.getProjections)
  // public async getProjections(): Promise<ControllerResponse> {
  //   return tsRestHandler(c.getProjections, async ({ query }) => {
  //     const data = await this.projectionsService.searchProjections(query);

  //     return { body: { data }, status: 200 };
  //   });
  // }

  @Public()
  @TsRestHandler(c.getProjectionsWidgets)
  public async getProjectionsWidgets(): Promise<ControllerResponse> {
    return tsRestHandler(c.getProjectionsWidgets, async ({ query }) => {
      const data = await this.projectionsService.getProjectionsWidgets(query);

      return { body: { data }, status: 200 };
    });
  }

  @Public()
  @TsRestHandler(c.getCustomProjectionSettings)
  public async getCustomProjectionSettings(): Promise<ControllerResponse> {
    return tsRestHandler(c.getCustomProjectionSettings, async () => {
      const data = this.projectionsService.getCustomProjectionSettings();

      return { body: { data }, status: 200 };
    });
  }

  @Public()
  @TsRestHandler(c.getCustomProjection)
  public async getCustomProjection(): Promise<ControllerResponse> {
    return tsRestHandler(c.getCustomProjection, async ({ query }) => {
      const data =
        await this.projectionsService.generateCustomProjection(query);

      return { body: { data }, status: 200 };
    });
  }
}
