import { DataSourceOptions } from 'typeorm';
import { AppConfig } from '@api/utils/app-config';

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
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
