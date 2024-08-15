import { FactoryProvider } from '@nestjs/common';
import { IEmailServiceToken } from '@api/modules/email/email.service.interface';
import { ConfigService } from '@nestjs/config';
import { MockEmailService } from '../../../test/utils/mocks/mock-email.service';
import { NodemailerEmailService } from '@api/modules/email/nodemailer.email.service';

export const EmailProviderFactory: FactoryProvider = {
  provide: IEmailServiceToken,
  useFactory: (configService: ConfigService) => {
    const env = configService.get<string>('NODE_ENV');
    return env === 'test'
      ? new MockEmailService()
      : new NodemailerEmailService();
  },
  inject: [ConfigService],
};
