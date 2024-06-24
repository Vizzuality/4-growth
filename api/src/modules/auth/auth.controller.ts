import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@api/modules/auth/auth.service';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';
import { SignInDto } from '@shared/dto/auth/sign-in.dto';
import { IAccessToken } from '@shared/dto/auth/access-token.interface';
import { Public } from '@api/decorators/is-public.decorator';
import { API_ROUTES } from '@shared/contracts/routes';
import { LocalAuthGuard } from '@api/guards/local-auth.guard';
import { GetUser } from '@api/decorators/get-user.decorator';
import { User } from '@shared/dto/users/user.entity';

@Controller(API_ROUTES.auth.controller)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(API_ROUTES.auth.handlers.signUp.path)
  async signUp(@Body() dto: SignUpDto): Promise<void> {
    return this.authService.signUp(dto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post(API_ROUTES.auth.handlers.signIn.path)
  async signIn(
    @Body() dto: SignInDto,
    @GetUser() user: User,
  ): Promise<IAccessToken> {
    return this.authService.signIn(user);
  }
}
