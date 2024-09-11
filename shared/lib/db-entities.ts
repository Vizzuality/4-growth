import { MixedList } from 'typeorm/common/MixedList';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';
import { CustomChart } from '@shared/dto/custom-charts/custom-chart.entity';
import { User } from '@shared/dto/users/user.entity';
import { ChartFilter } from '@shared/dto/custom-charts/custom-chart-filter.entity';
import { ApiEventEntity } from '@shared/dto/api-events/api-events.entity';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { CustomWidget } from '@shared/dto/widgets/custom-widget.entity';
import { Section } from '@shared/dto/sections/section.entity';

export const DB_ENTITIES: MixedList<Function | string | EntitySchema> = [
  User,
  CustomChart,
  ChartFilter,
  ApiEventEntity,
  Section,
  BaseWidget,
  CustomWidget,
];
