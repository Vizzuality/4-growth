import { genSalt, hash } from 'bcrypt';
import { DataSource, DeepPartial } from 'typeorm';
import { User } from '@shared/dto/users/user.entity';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { Section } from '@shared/dto/sections/section.entity';
import { WIDGET_VISUALIZATIONS } from '@shared/dto/widgets/widget-visualizations.constants';
import { CustomWidget } from '@shared/dto/widgets/custom-widget.entity';
import { QuestionIndicatorMap } from '@shared/dto/surveys/question-widget-map.entity';

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

export const createQuestionIndicatorMap = async (
  dataSource: DataSource,
  data: QuestionIndicatorMap,
) => {
  const repo = dataSource.getRepository(QuestionIndicatorMap);
  return repo.save(data);
};

export const ensureQuestionIndicatorMapExists = async (
  dataSource: DataSource,
  questionIndicatorMap: { indicator: string; question: string },
) => {
  const questionIndicatorRepository =
    dataSource.getRepository(QuestionIndicatorMap);
  const foundQuestionIndicator = await questionIndicatorRepository.findOneBy({
    indicator: questionIndicatorMap.indicator,
  });
  if (foundQuestionIndicator === null) {
    return await questionIndicatorRepository.save(questionIndicatorMap);
  }
  return undefined;
};

export const createBaseWidget = async (
  dataSource: DataSource,
  data: DeepPartial<BaseWidget> & { indicator: string },
) => {
  const indicator = data.indicator;

  await ensureQuestionIndicatorMapExists(dataSource, {
    indicator,
    question: indicator,
  });
  const baseWidgetsRepository = dataSource.getRepository(BaseWidget);

  const defaults: Partial<BaseWidget> = {
    visualisations: [
      WIDGET_VISUALIZATIONS.AREA_GRAPH,
      WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
    ],
    defaultVisualization: WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
    sectionOrder: 1,
  };

  return baseWidgetsRepository.save({ ...defaults, ...data });
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

  // Create indicators if they don't exist in the database
  if (additionalData !== undefined) {
    const baseWidgets = additionalData.baseWidgets;
    if (Array.isArray(baseWidgets) === true) {
      for (let widgetIdx = 0; widgetIdx < baseWidgets.length; widgetIdx++) {
        const widget = baseWidgets[widgetIdx];
        await ensureQuestionIndicatorMapExists(dataSource, {
          indicator: widget.indicator as string,
          question: widget.indicator as string,
        });
      }
    }
  }

  return sectionsRepository.save({ ...defaults, ...additionalData });
};

export const createCustomWidget = async (
  dataSource: DataSource,
  data?: DeepPartial<CustomWidget>,
) => {
  const baseWidgetsRepository = dataSource.getRepository(CustomWidget);

  const defaults: Partial<CustomWidget> = {
    name: 'custom-widget',
    defaultVisualization: WIDGET_VISUALIZATIONS.AREA_GRAPH,
    filters: {},
    widget: {} as BaseWidget,
  };

  const customWidget = { ...defaults, ...data };
  customWidget.widget!.indicator ??= new Date().toISOString();

  await createBaseWidget(dataSource, customWidget.widget! as BaseWidget);
  return baseWidgetsRepository.save(customWidget);
};
