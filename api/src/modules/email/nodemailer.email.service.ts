import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  IEmailServiceInterface,
  SendMailDTO,
} from '@api/modules/email/email.service.interface';
import nodemailer from 'nodemailer';
import * as sesTransport from 'nodemailer-ses-transport';

@Injectable()
export class NodemailerEmailService implements IEmailServiceInterface {
  logger: Logger = new Logger(NodemailerEmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // TODO: Use AppConfig service for this, make a warning if env vars are missing
    this.transporter = nodemailer.createTransport(
      sesTransport({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      }),
    );
  }

  async sendMail(sendMailDTO: SendMailDTO): Promise<any> {
    try {
      return await this.transporter.sendMail({
        to: sendMailDTO.to,
        subject: sendMailDTO.subject,
        html: sendMailDTO.html,
        text: sendMailDTO.text,
      });
    } catch (e) {
      this.logger.error(`Error sending email: ${e}`);
      throw new ServiceUnavailableException('Could not send email');
    }
  }
}
