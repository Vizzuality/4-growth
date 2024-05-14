import { Module } from '@nestjs/common';
import { UsersController } from '@api/modules/users/users.controller';
import { UsersService } from '@api/modules/users/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
