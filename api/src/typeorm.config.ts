import { DataSourceOptions } from 'typeorm';
import { AppConfig } from '@api/utils/app-config';
import { User } from '@shared/dto/users/user.entity';

/**
 * TypeORM configuration.
 */

const dbConfig = AppConfig.getDbConfig();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [User],
  synchronize: true,
};
