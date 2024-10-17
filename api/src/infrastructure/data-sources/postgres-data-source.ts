import { typeOrmConfig } from '@api/typeorm.config';
import { DataSource } from 'typeorm';

export const PostgresDataSource = new DataSource(typeOrmConfig);
