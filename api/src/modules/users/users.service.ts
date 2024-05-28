import { Injectable } from '@nestjs/common';
import { User } from '@shared/dto/users/user.entity';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private userRepository: Repository<User>) {}
  private readonly user: User[] = [];

  create(user: CreateUserDto) {
    this.userRepository.save(user);
  }

  findAll(): User[] {
    return this.userRepository.findAll();
  }

  findOne(id: number) {
    return this.userRepository.findOne((user) => user.id === id);
  }

  update(id: number) {
    const index = this.userRepository.findIndex((user) => user.id === id);
    if (index === -1) {
      return 'User not found';
    }
    this.userRepository[index] = {
      ...this.userRepository[index],
      name: 'User updated',
    };
    return 'User updated';
  }

  remove(id: number) {
    const index = this.userRepository.findIndex((user) => user.id === id);
    if (index === -1) {
      return 'User not found';
    }
    this.userRepository.splice(index, 1);
    return 'User removed';
  }
}
