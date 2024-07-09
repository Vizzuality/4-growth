import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@shared/dto/users/user.entity';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '@shared/dto/users/update-user.dto';
import { AppBaseService } from '@api/utils/app-base.service';
import { AppInfoDTO } from '@api/utils/info.dto';

@Injectable()
export class UsersService extends AppBaseService<
  User,
  CreateUserDto,
  UpdateUserDto,
  AppInfoDTO
> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(
        `Email ${createUserDto.email} already exists`,
      );
    }
    await this.userRepository.save(createUserDto);
  }

  async findOneBy(id: string) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
