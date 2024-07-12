import { Controller } from '@nestjs/common';
import { AuthService } from '@api/modules/auth/auth.service';
import { Public } from '@api/decorators/is-public.decorator';
import { GetUser } from '@api/decorators/get-user.decorator';
import { User } from '@shared/dto/users/user.entity';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { authContract as c } from '@shared/contracts/auth.contract';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @TsRestHandler(c.signUp)
  async signUp(@GetUser() user: User): Promise<any> {
    return tsRestHandler(c.signIn, async () => {
      await this.authService.signUp(user);
      return {
        body: null,
        status: 201,
      };
    });
  }

  @Public()
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
}
