import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@shared/dto/users/user.entity';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async save(@Body() createUserDto: CreateUserDto) {
    this.usersService.save(createUserDto);
  }

  @Get()
  async find(): Promise<User[]> {
    return this.usersService.find();
  }

  @Get(':id')
  async findOneBy(@Param('id') id: string) {
    return this.usersService.findOneBy(id);
  }

  @Put(':id')
  async update(@Param('id') id: string) {
    return this.usersService.update(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
