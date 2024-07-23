import { UserFixtures } from './fixtures';
import { TestManager } from '../utils/test-manager';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

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
  describe('Get my own info', () => {
    it('should return user information', async () => {
      const { jwtToken, user } = await userTestFixtures.GivenImLoggedIn();
      const response = await userTestFixtures.WhenIQueryTheMeEndpoint(jwtToken);
      userTestFixtures.ThenIShouldReceiveMyUserInformation(response, user);
    });
    it('should return unauthorized error when a registered user cannot be found with the token', async () => {
      const signedToken = jwtService.sign({ id: uuidv4() });
      const response =
        await userTestFixtures.WhenIQueryTheMeEndpoint(signedToken);
      userTestFixtures.ThenIShouldReceiveAUnauthorizedError(response);
    });
  });
  describe('Update password', () => {
    it('should update a users password', async () => {
      const { jwtToken, user } = await userTestFixtures.GivenImLoggedIn();
      const newPassword = 'newpassword';
      await userTestFixtures.WhenIUpdateMyPassword(
        {
          currentPassword: user.password,
          newPassword,
        },
        jwtToken,
      );
      await userTestFixtures.ThenIShouldBeAbleToLoginWithMyNewPassword({
        email: user.email,
        password: newPassword,
      });
      await userTestFixtures.AndIShouldNotBeAbleToLoginWithMyOldPassword({
        email: user.email,
        password: user.password,
      });
    });
  });
  describe('Delete me', () => {
    it('should delete my user', async () => {
      const { jwtToken, user } = await userTestFixtures.GivenImLoggedIn();
      await userTestFixtures.WhenIQueryTheDeleteMeEndpoint(jwtToken);
      await userTestFixtures.ThenIShouldNotBeAbleToLoginInWithMyCredentials({
        email: user.email,
        password: user.password,
      });
      await userTestFixtures.AndMyUserShouldBeDeleted(user.id);
    });
  });
  describe('Reset Password', () => {
    it('should reset a users password', async () => {
      const user = await testManager
        .mocks()
        .createUser({ email: 'test@user.com' });
      const updatePasswordToken = jwtService.sign({ id: user.id });
      const response = await testManager
        .request()
        .post('/users/me/password/reset')
        .send({ password: 'updatedpassword' })
        .set('Authorization', `Bearer ${updatePasswordToken}`);

      expect(response.body.data.id).toEqual(user.id);

      const loginResponse = await testManager
        .request()
        .post('/auth/sign-in')
        .send({ email: user.email, password: 'updatedpassword' });

      expect(loginResponse.body.accessToken).toBeDefined();
    });
  });
});
