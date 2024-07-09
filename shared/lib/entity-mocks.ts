import { genSalt, hash } from 'bcrypt';
import { DataSource, DeepPartial } from 'typeorm';
import { User } from '@shared/dto/users/user.entity';
import {
  CustomChart,
  INDICATORS,
} from '@shared/dto/custom-charts/custom-chart.entity';

export const createUser = async (
  dataSource: DataSource,
  additionalData?: Partial<User>,
): Promise<User> => {
  const salt = await genSalt();
  const usedPassword = additionalData?.password ?? '12345678';
  const defaultData: DeepPartial<User> = {
    email: 'test@user.com',
    password: await hash(usedPassword, salt),
  };

  const user = { ...defaultData, ...additionalData };

  await dataSource.getRepository(User).save(user);
  return { ...user, password: usedPassword } as User;
};

export const createCustomChart = async (
  dataSource: DataSource,
  user: User,
  additionalData?: Partial<CustomChart>,
): Promise<CustomChart> => {
  const defaultData: DeepPartial<CustomChart> = {
    user,
    name: 'Test chart',
    indicator: INDICATORS.DIGITAL_TECHNOLOGIES,
  };

  const chart = { ...defaultData, ...additionalData };
  return dataSource.getRepository(CustomChart).save(chart);
};
