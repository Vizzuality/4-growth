import { TestManager } from '../utils/test-manager';
import { MockEmailService } from '../utils/mocks/mock-email.service';
import { IEmailServiceToken } from '@api/modules/email/email.service.interface';
import { HttpStatus } from '@nestjs/common';

describe('Contact', () => {
  let testManager: TestManager<any>;
  let mockEmailService: MockEmailService;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    mockEmailService =
      testManager.moduleFixture.get<MockEmailService>(IEmailServiceToken);
  });
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  it('should call the mailing service when receiving a contact request', async () => {
    const response = await testManager
      .request()
      .post(`/contact`)
      .send({ name: 'John Doe', email: 'john@doe.com', message: 'Hello' });

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(mockEmailService.sendMail).toHaveBeenCalledTimes(1);
  });
  it('should throw validation errors if contact form is malformed', async () => {
    const response = await testManager.request().post(`/contact`).send({});

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toHaveLength(3);
    expect(mockEmailService.sendMail).toHaveBeenCalledTimes(0);
  });
});
