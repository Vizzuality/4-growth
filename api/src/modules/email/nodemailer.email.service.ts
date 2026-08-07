import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  IEmailServiceInterface,
  SendMailDTO,
} from '@api/modules/email/email.service.interface';
import * as nodemailer from 'nodemailer';
import { AppConfig } from '@api/utils/app-config';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

@Injectable()
export class NodemailerEmailService implements IEmailServiceInterface {
  logger: Logger = new Logger(NodemailerEmailService.name);
  private transporter: nodemailer.Transporter;
  private readonly domain: string;

  constructor() {
    const { accessKeyId, secretAccessKey, region, domain } =
      this.getMailConfig();
    const sesClient = new SESv2Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    this.transporter = nodemailer.createTransport({
      SES: { sesClient, SendEmailCommand },
    });
    this.domain = domain;
  }

  async sendMail(sendMailDTO: SendMailDTO): Promise<any> {
    try {
      await this.transporter.sendMail({
        from: `${sendMailDTO.from}@${this.domain}`,
        to: sendMailDTO.to,
        subject: sendMailDTO.subject,
        html: sendMailDTO.html,
        text: sendMailDTO.text,
      });
    } catch (e) {
      this.logger.error(
        `Error sending email: ${JSON.stringify(e)}`,
        null,
        this.constructor.name,
      );
      throw new ServiceUnavailableException('Could not send email');
    }
  }

  private getMailConfig() {
    const { accessKeyId, secretAccessKey, region, domain } =
      AppConfig.getSESMailConfig();
    if (!accessKeyId || !secretAccessKey || !region || !domain) {
      this.logger.error(
        'Variables for Email Service not set. Email not available',
        null,
        this.constructor.name,
      );
    }
    return { accessKeyId, secretAccessKey, region, domain };
  }
}
