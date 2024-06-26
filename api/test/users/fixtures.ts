import { TestManager } from '../utils/test-manager';
import * as request from 'supertest';
import { User } from '@shared/dto/users/user.entity';
import { API_ROUTES } from '@shared/contracts/routes';

export class UserFixtures {
  testManager: TestManager<any>;

  constructor(testManager: TestManager<any>) {
    this.testManager = testManager;
  }

  async GivenImLoggedIn() {
    return this.testManager.setUpTestUser();
  }

  async WhenIQueryTheMeEndpoint(token: string): Promise<request.Response> {
    return request(this.testManager.getApp().getHttpServer())
      .get(API_ROUTES.users.handlers.me.getRoute())
      .set('Authorization', `Bearer ${token}`);
  }

  ThenIShouldReceiveMyUserInformation(
    response: request.Response,
    existingUser: User,
  ) {
    expect(response.status).toBe(200);
    expect(response.body.email).toEqual(existingUser.email);
  }

  ThenIShouldReceiveAUnauthorizedError(response: request.Response) {
    expect(response.status).toBe(401);
    expect(response.body.errors[0].title).toEqual('Unauthorized');
  }
}