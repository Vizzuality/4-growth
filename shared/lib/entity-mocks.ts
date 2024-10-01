import { genSalt, hash } from 'bcrypt';
import { DataSource, DeepPartial } from 'typeorm';
import { User } from '@shared/dto/users/user.entity';
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
    defaultVisualization: WIDGET_VISUALIZATIONS.SINGLE_VALUE,
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
    slug: 'test-section',
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
