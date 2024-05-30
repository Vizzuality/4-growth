import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@api/modules/users/users.service';
import { UsersModule } from '@api/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '@api/typeorm.config';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeOrmConfig), UsersModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
