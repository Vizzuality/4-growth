import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@shared/dto/users/user.entity';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';
import { UpdateUserDto } from '@shared/dto/users/update-user.dto';
import { GetUser } from '@api/decorators/get-user.decorator';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async save(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async find(): Promise<User[]> {
    return this.usersService.find();
  }

  @Get('/me')
  async findMe(@GetUser() user: User): Promise<User> {
    const foundUser = await this.usersService.findOneBy(user.id);
    if (!foundUser) {
      throw new UnauthorizedException();
    }
    return foundUser;
  }

  @Get(':id')
  async findOneBy(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOneBy(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.delete(id);
  }
}
