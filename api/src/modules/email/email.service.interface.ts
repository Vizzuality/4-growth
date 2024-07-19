import { Logger } from '@nestjs/common';

export class SendMailDTO {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const IEmailServiceToken = 'IEmailServiceInterface';

export interface IEmailServiceInterface {
  logger: Logger;

  sendMail(sendMailDTO: SendMailDTO): Promise<any>;
}
