import { Module } from '@nestjs/common';
import { NodemailerEmailService } from './nodemailer.email.service';
import { IEmailServiceToken } from '@api/modules/email/email.service.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MockEmailService } from '../../../test/utils/mocks/mock-email.service';

export const emailServiceFactory = {
  provide: IEmailServiceToken,
  useFactory: (configService: ConfigService) => {
    const env = configService.get<string>('NODE_ENV');
    return env === 'test'
      ? new MockEmailService()
      : new NodemailerEmailService();
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  providers: [emailServiceFactory],
  exports: [IEmailServiceToken],
})
export class EmailModule {}
