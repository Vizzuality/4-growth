import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@api/modules/users/users.controller';
import { UsersModule } from '@api/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '@api/typeorm.config';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeOrmConfig), UsersModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
