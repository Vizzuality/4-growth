import { MixedList } from 'typeorm/common/MixedList';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';
import { User } from '@shared/dto/users/user.entity';
import { ApiEventEntity } from '@shared/dto/api-events/api-events.entity';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { CustomWidget } from '@shared/dto/widgets/custom-widget.entity';
import { Section } from '@shared/dto/sections/section.entity';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';
import { SurveyAnswer } from '@shared/dto/surveys/survey-answer.entity';
import { QuestionIndicatorMap } from '@shared/dto/surveys/question-widget-map.entity';
import { Projection } from '@shared/dto/projections/projection.entity';
import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import { ProjectionFilter } from '@shared/dto/projections/projection-filter.entity';
import { ProjectionWidget } from '@shared/dto/projections/projection-widget.entity';
import { ConfigurationParams } from '@shared/dto/global/configuration-params';

export const DB_ENTITIES: MixedList<Function | string | EntitySchema> = [
  User,
  ApiEventEntity,
  Section,
  BaseWidget,
  CustomWidget,
  PageFilter,
  SurveyAnswer,
  QuestionIndicatorMap,

  Projection,
  ProjectionData,
  ProjectionWidget,
  ProjectionFilter,
  ConfigurationParams,
];
