import { TestManager } from '../utils/test-manager';
import { User } from '@shared/dto/users/user.entity';
import { MockEmailService } from '../utils/mocks/mock-email.service';
import { IEmailServiceToken } from '@api/modules/email/email.service.interface';

describe('Password Recovery', () => {
  let testManager: TestManager<any>;
  let authToken: string;
  let testUser: User;
  let mockEmailService: MockEmailService;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    mockEmailService =
      testManager.moduleFixture.get<MockEmailService>(IEmailServiceToken);
  });
  beforeEach(async () => {
    const { jwtToken, user } = await testManager.setUpTestUser();
    authToken = jwtToken;
    testUser = user;
    jest.clearAllMocks();
  });
  afterEach(async () => {
    await testManager.clearDatabase();
  });
  it('an email should be sent if a user with provided email has been found', async () => {
    const response = await testManager
      .request()
      .post(`/auth/recover-password`)
      .send({ email: testUser.email })
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(mockEmailService.sendMail).toHaveBeenCalledTimes(1);
  });
  it('should return 200 if user has not been found but no mail should be sent', async () => {
    const response = await testManager
      .request()
      .post(`/auth/recover-password`)
      .send({ email: 'no-user@test.com' })
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(mockEmailService.sendMail).toHaveBeenCalledTimes(0);
  });
  it('should fail if a email is not provided', async () => {
    const responseNoEmailInBody = await testManager
      .request()
      .post(`/auth/recover-password`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(responseNoEmailInBody.status).toBe(400);
    expect(responseNoEmailInBody.body.errors[0].title).toBe(
      'Email is required',
    );

    const responseMalformedEmail = await testManager
      .request()
      .post(`/auth/recover-password`)
      .send({ email: 'malformed-email' })
      .set('Authorization', `Bearer ${authToken}`);

    expect(responseMalformedEmail.status).toBe(400);
    expect(responseMalformedEmail.body.errors[0].title).toBe('Invalid email');
  });
});
