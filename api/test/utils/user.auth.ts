import { User } from '@shared/dto/users/user.entity';

import * as request from 'supertest';
import { TestManager } from './test-manager';
import { API_ROUTES } from '@shared/contracts/routes';

export type TestUser = { jwtToken: string; user: User; password: string };

export async function logUserIn(
  testManager: TestManager<any>,
  user: Partial<User>,
): Promise<TestUser> {
  const response = await request(testManager.getApp().getHttpServer())
    .post(API_ROUTES.auth.handlers.signIn.getRoute())
    .send({ email: user.email, password: user.password });

  return {
    jwtToken: response.body.accessToken,
    user: response.body.user,
    password: user.password,
  };
}
