import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@api/modules/auth/jwt-payload.interface';
import { UsersService } from '@api/modules/users/users.service';
import { AppConfig } from '@api/utils/app-config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AppConfig.getJWTConfig().secret,
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user = await this.userService.findOneBy(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
