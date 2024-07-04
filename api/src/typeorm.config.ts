import { DataSourceOptions } from 'typeorm';
import { AppConfig } from '@api/utils/app-config';
import { DB_ENTITIES } from '@shared/lib/db-entities';

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
  entities: DB_ENTITIES,
  synchronize: true,
  extra: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};
