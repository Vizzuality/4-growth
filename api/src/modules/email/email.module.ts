import { Module } from '@nestjs/common';
import { NodemailerEmailService } from './nodemailer.email.service';
import { IEmailServiceToken } from '@api/modules/email/email.service.interface';

@Module({
  providers: [
    {
      provide: IEmailServiceToken,
      useClass: NodemailerEmailService,
    },
  ],
  exports: [IEmailServiceToken],
})
export class EmailModule {}
