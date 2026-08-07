import { Controller } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { savedProjectionsContract as c } from '@shared/contracts/saved-projections.contract';
import { ControllerResponse } from '@api/types/controller.type';
import { SavedProjectionService } from '@api/modules/projections/saved-projections.service';
import { AuthorizeByUserIdParam } from '@api/decorators/authorize';

@Controller()
export class SavedProjectionsController {
  public constructor(
    private readonly savedProjectionService: SavedProjectionService,
  ) {}

  @AuthorizeByUserIdParam()
  @TsRestHandler(c.searchSavedProjections)
  public async searchSavedProjections(): Promise<ControllerResponse> {
    return tsRestHandler(
      c.searchSavedProjections,
      async ({ params, query }) => {
        const data = await this.savedProjectionService.searchSavedProjections(
          params.userId,
          query,
        );
        return { body: data, status: 200 };
      },
    );
  }

  @AuthorizeByUserIdParam()
  @TsRestHandler(c.findSavedProjection)
  public async findSavedProjection(): Promise<ControllerResponse> {
    return tsRestHandler(c.findSavedProjection, async ({ params }) => {
      const { userId, id } = params;
      const data = await this.savedProjectionService.findSavedProjectionById(
        userId,
        id,
      );
      return { body: { data }, status: 200 };
    });
  }

  @AuthorizeByUserIdParam()
  @TsRestHandler(c.createSavedProjection)
  public async createSavedProjection(): Promise<ControllerResponse> {
    return tsRestHandler(c.createSavedProjection, async ({ params, body }) => {
      const data = await this.savedProjectionService.createSavedProjection(
        params.userId,
        body,
      );
      return { body: { data }, status: 201 };
    });
  }

  @AuthorizeByUserIdParam()
  @TsRestHandler(c.updateSavedProjection)
  public async updateSavedProjection(): Promise<ControllerResponse> {
    return tsRestHandler(c.updateSavedProjection, async ({ params, body }) => {
      const { userId, id } = params;
      const data = await this.savedProjectionService.updateSavedProjection(
        userId,
        id,
        body,
      );
      return { body: { data }, status: 200 };
    });
  }

  @AuthorizeByUserIdParam()
  @TsRestHandler(c.deleteSavedProjection)
  public async deleteSavedProjection(): Promise<ControllerResponse> {
    return tsRestHandler(c.deleteSavedProjection, async ({ params }) => {
      const { userId, id } = params;
      await this.savedProjectionService.deleteSavedProjection(userId, id);
      return { body: null, status: 204 };
    });
  }
}
