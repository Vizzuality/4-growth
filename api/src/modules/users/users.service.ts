import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@shared/dto/users/user.entity';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '@shared/dto/users/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async save(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
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
    return this.userRepository.update(id, dto);
  }

  async remove(id: string) {
    const found = await this.userRepository.findOneBy({
      id: id,
    });
    if (!found) {
      throw new NotFoundException(`Country with ID "${id}" not found`);
    }
    if (found) {
      return this.userRepository.remove(found);
    }
  }
}
