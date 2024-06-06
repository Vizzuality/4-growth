import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@api/modules/auth/auth.service';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';
import { SignInDto } from '@shared/dto/auth/sign-in.dto';
import { IAccessToken } from '@shared/dto/auth/access-token.interface';
import { Public } from '@api/decorators/is-public.decorator';
import { API_ROUTES } from '@shared/contracts/routes';

@Controller(API_ROUTES.auth.controller)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(API_ROUTES.auth.handlers.signUp.path)
  async signUp(@Body() dto: SignUpDto): Promise<void> {
    return this.authService.signUp(dto);
  }

  @Public()
  @Post(API_ROUTES.auth.handlers.signIn.path)
  async signIn(@Body() dto: SignInDto): Promise<IAccessToken> {
    return this.authService.signIn(dto);
  }
}
