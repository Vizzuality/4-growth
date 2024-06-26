import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from '@api/modules/auth/auth.service';
import { AuthController } from '@api/modules/auth/auth.controller';
import { UsersModule } from '@api/modules/users/users.module';
import { PasswordService } from '@api/modules/auth/password/password.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from '@api/utils/app-config';
import { JwtStrategy } from '@api/modules/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@api/modules/auth/strategies/local.strategy';

const jwtConfig = AppConfig.getJWTConfig();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expiresIn },
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, PasswordService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
