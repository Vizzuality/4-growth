export class SendMailDTO {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const IEmailServiceToken = 'IEmailServiceInterface';

export interface IEmailServiceInterface {
  sendMail(sendMailDTO: SendMailDTO): Promise<any>;
}
