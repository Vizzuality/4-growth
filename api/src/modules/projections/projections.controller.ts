import { Controller, Res } from '@nestjs/common';
import type { Response } from 'express';
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
    return tsRestHandler(c.getCustomProjectionSettings, async ({ query }) => {
      const data =
        await this.projectionsService.getCustomProjectionSettings(query);

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

  @Public()
  @TsRestHandler(c.exportProjectionWidget)
  public async exportProjectionWidget(
    @Res({ passthrough: true }) res: Response,
  ): Promise<ControllerResponse> {
    return tsRestHandler(
      c.exportProjectionWidget,
      async ({ params: { id }, query }) => {
        const { csv, filename } =
          await this.projectionsService.exportProjectionWidgetCsv(id, query);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${filename}"`,
        );
        return { body: csv, status: 200 };
      },
    );
  }

  @Public()
  @TsRestHandler(c.exportCustomProjection)
  public async exportCustomProjection(
    @Res({ passthrough: true }) res: Response,
  ): Promise<ControllerResponse> {
    return tsRestHandler(c.exportCustomProjection, async ({ query }) => {
      const { csv, filename } =
        await this.projectionsService.exportCustomProjectionCsv(query);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      return { body: csv, status: 200 };
    });
  }
}
