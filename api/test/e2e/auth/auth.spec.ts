import { TestManager } from '../../utils/test-manager';
import { AuthFixtures } from './fixtures';

describe('Authentication (e2e)', () => {
  let testManager: TestManager<any>;
  let fixtures: AuthFixtures;
  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    fixtures = new AuthFixtures(testManager);
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('Sign Up', () => {
    test(`it should throw validation errors`, async () => {
      const response = await fixtures.WhenISignUpANewUserWithWrongPayload({
        email: 'notanemail',
        password: '12345',
      });
      fixtures.ThenIShouldReceiveValidationErrors(response);
    });
    test(`it should throw email already exist error`, async () => {
      const user = await fixtures.GivenThereIsUserRegistered();
      const response = await fixtures.WhenISignUpANewUserWithWrongPayload({
        email: user.email,
        password: user.password,
      });
      fixtures.ThenIShouldReceiveAEmailAlreadyExistError(response, user.email);
    });
    test(`it should sign up a new user`, async () => {
      const newUser = {
        email: 'user@test.email.com',
        password: '12345678',
      };
      await fixtures.WhenISignUpANewUser(newUser);
      await fixtures.ThenANewUserAShouldBeCreated(newUser);
    });
  });
  describe('Sign In', () => {
    test(`it should throw an error if no user exists with provided credentials`, async () => {
      const response = await fixtures.WhenISingIn({
        email: 'non-existing@user.com',
        password: '12345567',
      });
      fixtures.ThenIShouldReceiveAUnauthorizedError(response);
    });
    test(`it should throw an error if password is incorrect`, async () => {
      const user = await fixtures.GivenThereIsUserRegistered();
      const response = await fixtures.WhenISingIn({
        email: user.email,
        password: 'wrongpassword',
      });
      fixtures.ThenIShouldReceiveAUnauthorizedError(response);
    });
    test(`it should sign in a user`, async () => {
      const user = await fixtures.GivenThereIsUserRegistered();
      const response = await fixtures.WhenISingIn({
        email: user.email,
        password: user.password,
      });
      fixtures.ThenIShouldReceiveAValidToken(response);
    });
  });
});
