import { MixedList } from 'typeorm/common/MixedList';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';
import { CustomChart } from '@shared/dto/custom-charts/custom-chart.entity';
import { User } from '@shared/dto/users/user.entity';
import { ChartFilter } from '@shared/dto/custom-charts/custom-chart-filter.entity';

export const DB_ENTITIES: MixedList<Function | string | EntitySchema> = [
  User,
  CustomChart,
  ChartFilter,
];
