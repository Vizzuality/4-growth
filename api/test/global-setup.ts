import * as path from 'path';
import { register } from 'tsconfig-paths';
import { DataSource } from 'typeorm';

const rootDir = path.join(__dirname, '..', '..');
register({
  baseUrl: rootDir,
  paths: { '@api/*': ['api/src/*'], '@shared/*': ['shared/*'] },
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DB_ENTITIES } = require('@shared/lib/db-entities');

export default async function globalSetup() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = require('config');

  const dbConfig = config.get('db');

  const dataSource = new DataSource({
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: DB_ENTITIES,
    migrationsRun: true,
    migrationsTableName: 'migrations',
    migrations: [path.join(__dirname, '..', 'src', 'migrations', '*{.ts,.js}')],
  });

  await dataSource.initialize();
  await dataSource.destroy();
}
