import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@shared/dto/users/user.entity';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';
import { UpdateUserDto } from '@shared/dto/users/update-user.dto';
import { GetUser } from '@api/decorators/get-user.decorator';
import { UpdateUserPasswordDto } from '@shared/dto/users/update-user-password.dto';
import { AuthService } from '@api/modules/auth/auth.service';
import {
  FetchSpecification,
  ProcessFetchSpecification,
} from 'nestjs-base-service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { userContract as c } from '@shared/contracts/user.contract';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @TsRestHandler(c.createUser)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return tsRestHandler(c.createUser, async () => {
      const user = await this.usersService.createUser(createUserDto);
      return { body: { data: user }, status: HttpStatus.CREATED };
    });
  }

  @TsRestHandler(c.getUsers)
  async getUsers(
    @ProcessFetchSpecification() fetchSpecificacion: FetchSpecification,
  ): Promise<any> {
    return tsRestHandler(c.getUsers, async () => {
      const users =
        await this.usersService.findAllPaginated(fetchSpecificacion);
      return { body: users, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(c.findMe)
  async findMe(@GetUser() user: User): Promise<any> {
    return tsRestHandler(c.findMe, async ({ query }) => {
      const foundUser = await this.usersService.getById(user.id, query);
      if (!foundUser) {
        throw new UnauthorizedException();
      }
      return { body: { data: foundUser }, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(c.updatePassword)
  async updatePassword(
    @Body() dto: UpdateUserPasswordDto,
    @GetUser() user: User,
  ): Promise<any> {
    return tsRestHandler(c.updatePassword, async () => {
      const updatedUser = await this.authService.updatePassword(user.id, dto);
      return { body: { data: updatedUser }, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(c.getUser)
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    return tsRestHandler(c.getUser, async ({ query }) => {
      const user = await this.usersService.getById(id, query);
      return { body: user, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(c.updateUser)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<any> {
    return tsRestHandler(c.updateUser, async () => {
      const user = await this.usersService.update(id, dto);
      //return { body: { data: user }, status: HttpStatus.CREATED };
      return { body: { data: user }, status: HttpStatus.CREATED };
    });
  }

  @TsRestHandler(c.deleteMe)
  async deleteMe(@GetUser() user: User): Promise<any> {
    return tsRestHandler(c.deleteMe, async () => {
      await this.usersService.remove(user.id);
      return { body: null, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(c.getUsersCustomCharts)
  async getCustomChart(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    return tsRestHandler(c.getUsersCustomCharts, async ({ query }) => {
      const customChart = await this.usersService.getUsersCustomCharts(
        id,
        query,
      );
      return { body: customChart, status: HttpStatus.OK };
    });
  }
}
