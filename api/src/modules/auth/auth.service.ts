import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@api/modules/users/users.service';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';
import { CryptService } from '@api/modules/auth/crypt/crypt.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '@shared/dto/auth/sign-in.dto';
import { JwtPayload } from '@api/modules/auth/jwt-payload.interface';
import { IAccessToken } from '@shared/dto/auth/access-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly crypto: CryptService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto): Promise<void> {
    const passwordHash = await this.crypto.hashPassword(dto.password);
    await this.usersService.createUser({
      email: dto.email,
      password: passwordHash,
      username: dto.username,
    });
  }

  async signIn(dto: SignInDto): Promise<IAccessToken> {
    const user = await this.usersService.findByEmail(dto.email);
    const isPasswordValid = await this.crypto.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Please check your login credentials');
    }
    const payload: JwtPayload = { email: user.email };
    const accessToken: string = this.jwtService.sign(payload);
    return { user, accessToken };
  }
}
