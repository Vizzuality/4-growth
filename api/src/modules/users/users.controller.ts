import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller()
export class UsersController {
  @Post('users')
  create(): string {
    return 'This action adds a new user';
  }

  @Get('users')
  findAll(): string {
    return 'This action returns all users';
  }

  @Get('users/:id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} user`;
  }

  @Put('users/:id')
  update(@Param('id') id: string) {
    return `This action updates a #${id} user`;
  }

  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} user`;
  }
}
