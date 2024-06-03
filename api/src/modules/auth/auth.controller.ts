import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@api/modules/auth/auth.service';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() dto: SignUpDto): Promise<void> {
    return this.authService.signUp(dto);
  }
}
