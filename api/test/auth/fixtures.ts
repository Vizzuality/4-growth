import { TestManager } from '../utils/test-manager';
import * as request from 'supertest';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';
import { createUser } from '../utils/entity-mocks';
import { User } from '@shared/dto/users/user.entity';
import { SignInDto } from '@shared/dto/auth/sign-in.dto';
import * as bcrypt from 'bcrypt';

export class AuthFixtures {
  testManager: TestManager<any>;

  constructor(testManager: TestManager<any>) {
    this.testManager = testManager;
  }

  async GivenThereIsUserRegistered(): Promise<User> {
    const user = await createUser(this.testManager.getDataSource(), {
      email: 'test@email.com',
      password: await bcrypt.hash('12345678', await bcrypt.genSalt()),
    });
    return user;
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
    expect(response.body).toEqual({
      message: [
        'email must be an email',
        'password must be longer than or equal to 8 characters',
      ],
      error: 'Bad Request',
      statusCode: 400,
    });
  }

  ThenIShouldReceiveAEmailAlreadyExistError(response: request.Response) {
    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: 'Email test@email.com already exists',
      error: 'Conflict',
      statusCode: 409,
    });
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
    console.log(response.body);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Please check your login credentials',
      error: 'Unauthorized',
      statusCode: 401,
    });
  }

  ThenIShouldReceiveAValidToken(response: request.Response) {
    expect(response.status).toBe(201);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user.email).toEqual('test@email.com');
  }
}
