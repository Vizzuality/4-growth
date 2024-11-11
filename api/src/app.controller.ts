import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from '@api/app.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { contactContract as c } from '@shared/contracts/contact.contract';
import { Public } from '@api/decorators/is-public.decorator';
import { ControllerResponse } from '@api/types/controller.type';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly appService: AppService,
  ) {}

  @Public()
  @Get('/')
  public root(): ControllerResponse {
    return null;
  }

  @Public()
  @Get('/health')
  @HealthCheck({ noCache: true })
  public checkHealth(): ControllerResponse {
    return this.health.check([
      async () => this.db.pingCheck('database', { timeout: 1500 }),
    ]);
  }

  @Public()
  @TsRestHandler(c.contact)
  async recoverPassword(): Promise<ControllerResponse> {
    return tsRestHandler(c.contact, async ({ body }) => {
      await this.appService.contact(body);
      return { body: null, status: HttpStatus.CREATED };
    });
  }
}
