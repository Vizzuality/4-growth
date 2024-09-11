import { genSalt, hash } from 'bcrypt';
import { DataSource, DeepPartial } from 'typeorm';
import { User } from '@shared/dto/users/user.entity';
import { CustomChart } from '@shared/dto/custom-charts/custom-chart.entity';
import { INDICATORS } from '@shared/dto/custom-charts/custom-chart.constants';
import {
  CHART_FILTER_ATTRIBUTES,
  ChartFilter,
} from '@shared/dto/custom-charts/custom-chart-filter.entity';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { Section } from '@shared/dto/sections/section.entity';
import { WIDGET_VISUALIZATIONS } from '@shared/dto/widgets/widget-visualizations.constants';
import { CustomWidget } from '@shared/dto/widgets/custom-widget.entity';

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

export const createBaseWidget = async (
  dataSource: DataSource,
  additionalData?: DeepPartial<BaseWidget>,
) => {
  const baseWidgetsRepository = dataSource.getRepository(BaseWidget);

  const defaults: Partial<BaseWidget> = {
    visualisations: [
      WIDGET_VISUALIZATIONS.AREA_GRAPH,
      WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
    ],
    defaultVisualization: WIDGET_VISUALIZATIONS.AREA_GRAPH,
    sectionOrder: 1,
  };

  return baseWidgetsRepository.save({ ...defaults, ...additionalData });
};

export const createSection = async (
  dataSource: DataSource,
  additionalData?: DeepPartial<Section>,
) => {
  const sectionsRepository = dataSource.getRepository(Section);

  const defaults = {
    name: 'Test section',
    description: 'Description of a test section',
    order: 1,
  };

  return sectionsRepository.save({ ...defaults, ...additionalData });
};

export const createCustomWidget = async (
  dataSource: DataSource,
  additionalData?: DeepPartial<CustomWidget>,
) => {
  const baseWidgetsRepository = dataSource.getRepository(CustomWidget);

  const defaults: Partial<CustomWidget> = {
    name: 'custom-widget',
    defaultVisualization: WIDGET_VISUALIZATIONS.AREA_GRAPH,
    filters: {},
  };

  return baseWidgetsRepository.save({ ...defaults, ...additionalData });
};
