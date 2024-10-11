import { TestManager } from '../../utils/test-manager';
import * as request from 'supertest';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';
import { User } from '@shared/dto/users/user.entity';
import { SignInDto } from '@shared/dto/auth/sign-in.dto';
import { createUser } from '@shared/lib/entity-mocks';

export class AuthFixtures {
  testManager: TestManager<any>;

  constructor(testManager: TestManager<any>) {
    this.testManager = testManager;
  }

  async GivenThereIsUserRegistered(): Promise<User> {
    return createUser(this.testManager.getDataSource());
  }

  async WhenISignUpANewUserWithWrongPayload(
    signUpDto: SignUpDto,
  ): Promise<request.Response> {
    return request(this.testManager.getApp().getHttpServer())
      .post('/auth/sign-up')
      .send(signUpDto);
  }

  ThenIShouldReceiveValidationErrors(response: request.Response): void {
    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(2);
    expect(response.body.errors[0].title).toEqual('Invalid email');
    expect(response.body.errors[1].title).toEqual(
      'Password must be more than 8 characters',
    );
  }

  ThenIShouldReceiveAEmailAlreadyExistError(
    response: request.Response,
    email: string,
  ) {
    expect(response.status).toBe(409);
    expect(response.body.errors[0].title).toEqual(
      `Email ${email} already exists`,
    );
  }

  async WhenISignUpANewUser(signUpDto: SignUpDto): Promise<request.Response> {
    return request(this.testManager.getApp().getHttpServer())
      .post('/auth/sign-up')
      .send(signUpDto);
  }

  async ThenANewUserAShouldBeCreated(newUser: Partial<User>) {
    const user = await this.testManager
      .getDataSource()
      .getRepository(User)
      .findOne({
        where: { email: newUser.email },
      });
    expect(user.id).toBeDefined();
    expect(user.email).toEqual(newUser.email);
  }

  async WhenISingIn(dto: SignInDto): Promise<request.Response> {
    return request(this.testManager.getApp().getHttpServer())
      .post('/auth/sign-in')
      .send(dto);
  }

  ThenIShouldReceiveAUnauthorizedError(response: request.Response) {
    expect(response.status).toBe(401);
    expect(response.body.errors[0].title).toEqual('Invalid credentials');
  }

  ThenIShouldReceiveAValidToken(response: request.Response) {
    expect(response.status).toBe(201);
    expect(response.body.accessToken).toBeDefined();
  }
}
