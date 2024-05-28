import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@api/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/countries (GET)', () => {
    const mockCountries = [
      {
        id: 1,
        name: 'Italy',
        iso: 'IT',
      },
      {
        id: 2,
        name: 'France',
        iso: 'FRA',
      },
    ];

    return request(app.getHttpServer())
      .get('/countries')
      .expect(200)
      .expect(mockCountries);
  });
});
