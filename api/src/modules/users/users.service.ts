import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@shared/dto/users/user.entity';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '@shared/dto/users/update-user.dto';
import { AppBaseService } from '@api/utils/app-base.service';
import { AppInfoDTO } from '@api/utils/info.dto';
import { FetchSpecification } from 'nestjs-base-service';
import { CustomChartsService } from '@api/modules/custom-charts/custom-charts.service';
import { AuthService } from '@api/modules/auth/auth.service';
import { UpdateUserPasswordDto } from '@shared/dto/users/update-user-password.dto';
import { PasswordService } from '@api/modules/auth/password/password.service';
import { ApiEventsService } from '@api/modules/api-events/api-events.service';

@Injectable()
export class UsersService extends AppBaseService<
  User,
  CreateUserDto,
  UpdateUserDto,
  AppInfoDTO
> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly customChartService: CustomChartsService,
    private readonly authService: AuthService,
    private readonly passwordService: PasswordService,
    private readonly events: ApiEventsService,
  ) {
    super(userRepository, 'user', 'users');
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(
        `Email ${createUserDto.email} already exists`,
      );
    }
    return this.userRepository.save(createUserDto);
  }

  async findOneBy(id: string) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUsersCustomCharts(userId: string, dto: FetchSpecification) {
    return this.customChartService.findAllPaginated(dto, { userId });
  }

  async updatePassword(user: User, dto: UpdateUserPasswordDto) {
    return this.authService.updatePassword(user, dto);
  }

  async resetPassword(user: User, newPassword: string) {
    user.password = await this.passwordService.hashPassword(newPassword);
    await this.userRepository.save(user);
    await this.events.createEvent(
      this.events.eventMap.USER_EVENTS.USER_RECOVERED_PASSWORD,
      { associatedId: user.id },
    );
  }
}
