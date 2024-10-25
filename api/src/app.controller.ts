import { Controller, HttpStatus } from '@nestjs/common';
import { AppService } from '@api/app.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { contactContract as c } from '@shared/contracts/contact.contract';
import { appStatusContract } from '@shared/contracts/app-status.contract';
import { Public } from '@api/decorators/is-public.decorator';
import { ControllerResponse } from '@api/types/controller.type';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @TsRestHandler(appStatusContract.getStatus)
  public async getStatus(): Promise<ControllerResponse> {
    return tsRestHandler(appStatusContract.getStatus, async () => {
      return { status: HttpStatus.OK, body: null };
    });
  }
  @Public()
  @TsRestHandler(c.contact)
  async recoverPassword(): Promise<any> {
    return tsRestHandler(c.contact, async ({ body }) => {
      await this.appService.contact(body);
      return { body: null, status: HttpStatus.CREATED };
    });
  }
}
