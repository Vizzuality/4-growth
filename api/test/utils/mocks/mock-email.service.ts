import {
  IEmailServiceInterface,
  SendMailDTO,
} from '@api/modules/email/email.service.interface';
import { Logger } from '@nestjs/common';

/**
 * @description: Mock implementation of the Email Service Interface. The conditional logic is to allow for:
 * 1. Jest to mock the sendMail method, and to check if the method is called in API tests
 * 2. For e2e tests, we build the API with NODE_ENV=test, but in production mode, so jest is not available
 */

export class MockEmailService implements IEmailServiceInterface {
  public constructor(private readonly logger: Logger) {}

  sendMail =
    typeof jest !== 'undefined'
      ? jest.fn(async (sendMailDTO: SendMailDTO): Promise<void> => {
          this.logger.log('Mock Email sent', this.constructor.name);
          return Promise.resolve();
        })
      : async (sendMailDTO: SendMailDTO): Promise<void> => {
          this.logger.log('Mock Email sent', this.constructor.name);
          return Promise.resolve();
        };
}
