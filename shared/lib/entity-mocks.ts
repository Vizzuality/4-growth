import { genSalt, hash } from 'bcrypt';
import { DataSource, DeepPartial } from 'typeorm';
import { User } from '@shared/dto/users/user.entity';

export const createUser = async (
  dataSource: DataSource,
  additionalData?: Partial<User>,
) => {
  const salt = await genSalt();
  const defaultData: DeepPartial<User> = {
    email: 'test@user.com',
    password: await hash('12345678', salt),
  };
  const user = { ...defaultData, ...additionalData };
  return dataSource.getRepository(User).save(user);
};
