import { User } from '@shared/dto/users/user.entity';
import * as request from 'supertest';
import { API_ROUTES } from '@shared/contracts/routes';
import { App } from 'supertest/types';

export type TestUser = { jwtToken: string; user: User };

export async function logUserIn(
  app: App,
  user: Partial<User>,
): Promise<TestUser> {
  const response = await request(app)
    .post(API_ROUTES.auth.handlers.signIn.getRoute())
    .send({ email: user.email, password: user.password });

  return {
    jwtToken: response.body.accessToken,
    user: user as User,
  };
}
