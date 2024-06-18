import { UserFixtures } from './fixtures';
import { TestManager } from '../utils/test-manager';
import { JwtService } from '@nestjs/jwt';

describe('Users (e2e)', () => {
  let userTestFixtures: UserFixtures;
  let testManager: TestManager<any>;
  let jwtService: JwtService;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    userTestFixtures = new UserFixtures(testManager);
    jwtService = testManager.getModule<JwtService>(JwtService);
  });
  afterEach(async () => {
    await testManager.clearDatabase();
  });

  it('should return user information', async () => {
    const { jwtToken, user } = await userTestFixtures.GivenImLoggedIn();
    const response = await userTestFixtures.WhenIQueryTheMeEndpoint(jwtToken);
    userTestFixtures.ThenIShouldReceiveMyUserInformation(response, user);
  });
  it('should return unauthorized error when a registered user cannot be found with the token', async () => {
    const signedToken = jwtService.sign({ email: 'nonexisting@user.com' });
    const response =
      await userTestFixtures.WhenIQueryTheMeEndpoint(signedToken);
    userTestFixtures.ThenIShouldReceiveAUnauthorizedError(response);
  });
});
