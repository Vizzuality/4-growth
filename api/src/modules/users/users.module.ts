import { Module } from '@nestjs/common';
import { UsersController } from '@api/modules/users/users.controller';
import { UsersService } from '@api/modules/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@shared/dto/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}


