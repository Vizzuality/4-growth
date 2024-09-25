import { Module } from '@nestjs/common';
import { IEmailServiceToken } from '@api/modules/email/email.service.interface';
import { ConfigModule } from '@nestjs/config';
import { EmailProviderFactory } from '@api/modules/email/email.provider';

@Module({
  imports: [ConfigModule],
  providers: [EmailProviderFactory],
  exports: [IEmailServiceToken],
})
export class EmailModule {}
