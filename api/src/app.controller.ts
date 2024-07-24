import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from '@api/app.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { contactContract as c } from '@shared/contracts/contact.contract';
import { Public } from '@api/decorators/is-public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
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
