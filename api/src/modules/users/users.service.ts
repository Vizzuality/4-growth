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
import { PasswordRecovery } from '@api/modules/auth/password/password-recovery-email.service';

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
  ) {
    super(userRepository, UsersService.name);
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

  async recoverPassword(passwordRecovery: Partial<PasswordRecovery>) {
    const user = await this.findByEmail(passwordRecovery.email);
    if (!user) {
      this.logger.warn(
        `User with email ${passwordRecovery.email} not found for password recovery`,
      );
      /**
       * if user does not exist, we should not return anything
       */
      return;
    }

    await this.authService.recoverPassword(passwordRecovery, user.id);
  }

  async resetPassword(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      return;
    }

    return this.userRepository.save(user);
  }
}
