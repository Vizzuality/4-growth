import { TestManager } from '../utils/test-manager';
import { User } from '@shared/dto/users/user.entity';
import { MockEmailService } from '../utils/mocks/mock-email.service';
import { IEmailServiceToken } from '@api/modules/email/email.service.interface';

describe('Users CRUD (e2e)', () => {
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
  });
  afterEach(async () => {
    await testManager.clearDatabase();
  });
  it('an email should be sent if a user with provided email has been found', async () => {
    const response = await testManager
      .request()
      .post(`/users/recover-password`)
      .send({ email: testUser.email })
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(mockEmailService.sendMail).toHaveBeenCalledTimes(1);
  });
});
