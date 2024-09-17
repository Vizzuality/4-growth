import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from '@api/modules/users/users.controller';
import { UsersService } from '@api/modules/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@shared/dto/users/user.entity';
import { AuthModule } from '@api/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
