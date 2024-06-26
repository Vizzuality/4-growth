import { TestManager } from '../utils/test-manager';
import * as request from 'supertest';
import { User } from '@shared/dto/users/user.entity';
import { API_ROUTES } from '@shared/contracts/routes';
import { UpdateUserPasswordDto } from '@shared/dto/users/update-user-password.dto';
import { SignInDto } from '@shared/dto/auth/sign-in.dto';

export class UserFixtures {
  testManager: TestManager<any>;

  constructor(testManager: TestManager<any>) {
    this.testManager = testManager;
  }

  async GivenImLoggedIn() {
    return this.testManager.setUpTestUser();
  }

  async WhenIUpdateMyPassword(
    dto: UpdateUserPasswordDto,
    token: string,
  ): Promise<request.Response> {
    return this.testManager
      .request()
      .patch(API_ROUTES.users.handlers.updatePassword.getRoute())
      .set('Authorization', `Bearer ${token}`)
      .send(dto);
  }

  async WhenIQueryTheMeEndpoint(token: string): Promise<request.Response> {
    return request(this.testManager.getApp().getHttpServer())
      .get(API_ROUTES.users.handlers.me.getRoute())
      .set('Authorization', `Bearer ${token}`);
  }

  async WhenIQueryTheDeleteMeEndpoint(
    token: string,
  ): Promise<request.Response> {
    return request(this.testManager.getApp().getHttpServer())
      .delete(API_ROUTES.users.handlers.me.getRoute())
      .set('Authorization', `Bearer ${token}`);
  }

  ThenIShouldReceiveMyUserInformation(
    response: request.Response,
    existingUser: User,
  ) {
    expect(response.status).toBe(200);
    expect(response.body.email).toEqual(existingUser.email);
  }

  ThenIShouldReceiveAUnauthorizedError(
    response: request.Response,
    customErrorMessages?: string,
  ) {
    expect(response.status).toBe(401);
    expect(response.body.errors[0].title).toEqual(
      customErrorMessages || 'Unauthorized',
    );
  }

  async AndIShouldNotBeAbleToLoginWithMyOldPassword(dto: SignInDto) {
    const { email, password } = dto;
    const response = await this.testManager
      .request()
      .post(API_ROUTES.auth.handlers.signIn.getRoute())
      .send({ email, password });
    expect(response.status).toBe(401);
    expect(response.body.errors[0].title).toEqual('Invalid credentials');
  }

  async ThenIShouldNotBeAbleToLoginInWithMyCredentials(dto: SignInDto) {
    const { email, password } = dto;
    const response = await this.testManager
      .request()
      .post(API_ROUTES.auth.handlers.signIn.getRoute())
      .send({ email, password });
    expect(response.status).toBe(401);
    expect(response.body.errors[0].title).toEqual('Invalid credentials');
  }

  async AndMyUserShouldBeDeleted(userId: string) {
    const user = await this.testManager
      .getDataSource()
      .getRepository(User)
      .findOne({ where: { id: userId } });
    expect(user).toBeNull();
  }

  async ThenIShouldBeAbleToLoginWithMyNewPassword(dto: SignInDto) {
    const { email, password } = dto;
    const response = await this.testManager
      .request()
      .post(API_ROUTES.auth.handlers.signIn.getRoute())
      .send({ email, password });
    expect(response.status).toBe(201);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user.email).toEqual(email);
  }
}
