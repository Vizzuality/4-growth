import { genSalt, hash } from 'bcrypt';
import { DataSource, DeepPartial } from 'typeorm';
import { User } from '@shared/dto/users/user.entity';
import {
  CustomChart,
  INDICATORS,
} from '@shared/dto/custom-charts/custom-chart.entity';
import {
  CHART_FILTER_ATTRIBUTES,
  ChartFilter,
} from '@shared/dto/custom-charts/custom-chart-filter.entity';

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

export const createCustomFilter = async (
  dataSource: DataSource,
  customChart: CustomChart,
  additionalData?: Partial<ChartFilter>,
): Promise<ChartFilter> => {
  const defaultData: DeepPartial<ChartFilter> = {
    customChart,
    value: 'test filter value',
    attribute: CHART_FILTER_ATTRIBUTES.COUNTRY,
  };

  const chartFilter = { ...defaultData, ...additionalData };
  return dataSource.getRepository(ChartFilter).save(chartFilter);
};
