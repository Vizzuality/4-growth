import { TestManager } from '../utils/test-manager';
import { AuthFixtures } from './fixtures';

describe('Authentication (e2e)', () => {
  let testManager: TestManager<any>;
  let fixtures: AuthFixtures;
  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    fixtures = new AuthFixtures(testManager);
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });
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
      password: '12345678',
    });
    fixtures.ThenIShouldReceiveAEmailAlreadyExistError(response);
  });
  test(`it should sign up a new user`, async () => {
    const newUser = {
      email: 'user@test.email.com',
      password: '12345678',
      username: 'test',
    };
    await fixtures.WhenISignUpANewUser(newUser);
    await fixtures.ThenANewUserAShouldBeCreated(newUser);
  });
});
