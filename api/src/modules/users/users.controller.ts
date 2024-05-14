import { Controller, Get } from '@nestjs/common';

@Controller()
export class UsersController {
  @Get('users')
  createUser() {
    return 'This action adds a new user';
  }
}
