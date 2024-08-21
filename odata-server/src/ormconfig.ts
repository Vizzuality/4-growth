import { DataSource } from 'typeorm';
import { SurveyResponse } from './entities/survey-response.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: '4growth',
  password: '4growth',
  database: '4growth-odata',
  entities: [SurveyResponse],
  synchronize: true,
});