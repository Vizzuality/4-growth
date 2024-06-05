import { Module } from '@nestjs/common';
import { AuthService } from '@api/modules/auth/auth.service';
import { AuthController } from '@api/modules/auth/auth.controller';
import { UsersModule } from '@api/modules/users/users.module';
import { CryptService } from '@api/modules/auth/crypt/crypt.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from '@api/utils/app-config';
import { JwtStrategy } from '@api/modules/auth/strategies/jwt.strategy';

const jwtConfig = AppConfig.getJWTConfig();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expiresIn },
    }),
    UsersModule,
  ],
  providers: [AuthService, CryptService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
