import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@shared/dto/users/user.entity';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '@shared/dto/users/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(
        `Email ${createUserDto.email} already exists`,
      );
    }
    await this.userRepository.save(createUserDto);
  }

  async find(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneBy(id: string) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.userRepository
      .update(id, dto)
      .then(() => this.userRepository.findOneByOrFail({ id }));
  }

  async delete(id: string) {
    const found = await this.userRepository.findOneBy({
      id: id,
    });
    if (!found) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    if (found) {
      await this.userRepository.remove(found);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
