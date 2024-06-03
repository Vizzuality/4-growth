import { Module } from '@nestjs/common';
import { AuthService } from '@api/modules/auth/auth.service';
import { AuthController } from '@api/modules/auth/auth.controller';
import { UsersModule } from '@api/modules/users/users.module';
import { CryptService } from '@api/modules/auth/crypt/crypt.service';

@Module({
  imports: [UsersModule],
  providers: [AuthService, CryptService],
  controllers: [AuthController],
})
export class AuthModule {}
