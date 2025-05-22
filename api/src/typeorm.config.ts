import { DataSourceOptions } from 'typeorm';
import { AppConfig } from '@api/utils/app-config';
import { DB_ENTITIES } from '@shared/lib/db-entities';

/**
 * TypeORM configuration.
 */

const dbConfig = AppConfig.getDbConfig();

// TODO: Handle this more gracefully, probably using typeorm config useFactory or NestJS native config module:
//       https://docs.nestjs.com/techniques/configuration

export const getTypeORMConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    return { ...typeOrmConfig, extra: sslConfig };
  }
  return typeOrmConfig;
};

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: DB_ENTITIES,
  synchronize: false,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  extra: {
    min: 2,
    max: 10,
  },
};

export const sslConfig: Partial<DataSourceOptions> = {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
};
