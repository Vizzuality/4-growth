import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@api/modules/auth/auth.service';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';
import { SignInDto } from '@shared/dto/auth/sign-in.dto';
import { IAccessToken } from '@shared/dto/auth/access-token.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() dto: SignUpDto): Promise<void> {
    return this.authService.signUp(dto);
  }

  @Post('/sign-in')
  async signIn(@Body() dto: SignInDto): Promise<IAccessToken> {
    return this.authService.signIn(dto);
  }
}
