import {
  ClassSerializerInterceptor,
  Controller,
  Headers,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '@api/modules/auth/auth.service';
import { Public } from '@api/decorators/is-public.decorator';
import { GetUser } from '@api/decorators/get-user.decorator';
import { User } from '@shared/dto/users/user.entity';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { authContract as c } from '@shared/contracts/auth.contract';
import { LocalAuthGuard } from '@api/guards/local-auth.guard';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @TsRestHandler(c.signUp)
  async signUp(): Promise<any> {
    return tsRestHandler(c.signIn, async ({ body }) => {
      await this.authService.signUp(body);
      return {
        body: null,
        status: 201,
      };
    });
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @TsRestHandler(c.signIn)
  async signIn(@GetUser() user: User): Promise<any> {
    return tsRestHandler(c.signIn, async () => {
      const userWithAccessToken = await this.authService.signIn(user);
      return {
        body: userWithAccessToken,
        status: 201,
      };
    });
  }

  @Public()
  @TsRestHandler(c.recoverPassword)
  async recoverPassword(@Headers('origin') origin: string): Promise<any> {
    return tsRestHandler(c.recoverPassword, async ({ body }) => {
      await this.authService.recoverPassword({
        email: body.email,
        url: origin,
      });
      return { body: null, status: HttpStatus.OK };
    });
  }
}
