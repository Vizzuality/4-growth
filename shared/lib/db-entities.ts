import { MixedList } from 'typeorm/common/MixedList';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';
import { User } from '@shared/dto/users/user.entity';
import { ApiEventEntity } from '@shared/dto/api-events/api-events.entity';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { CustomWidget } from '@shared/dto/widgets/custom-widget.entity';
import { Section } from '@shared/dto/sections/section.entity';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';

export const DB_ENTITIES: MixedList<Function | string | EntitySchema> = [
  User,
  ApiEventEntity,
  Section,
  BaseWidget,
  CustomWidget,
  PageFilter,
];
