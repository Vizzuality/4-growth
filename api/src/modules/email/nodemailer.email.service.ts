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
import * as aws from '@aws-sdk/client-ses';

@Injectable()
export class NodemailerEmailService implements IEmailServiceInterface {
  logger: Logger = new Logger(NodemailerEmailService.name);
  private transporter: nodemailer.Transporter;
  private readonly domain: string;

  constructor() {
    const { accessKeyId, secretAccessKey, region, domain } =
      this.getMailConfig();
    const ses = new aws.SESClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    this.transporter = nodemailer.createTransport({ SES: { ses, aws } });
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
      this.logger.error(`Error sending email: ${JSON.stringify(e)}`);
      throw new ServiceUnavailableException('Could not send email');
    }
  }

  private getMailConfig() {
    const { accessKeyId, secretAccessKey, region, domain } =
      AppConfig.getSESMailConfig();
    if (!accessKeyId || !secretAccessKey || !region || !domain) {
      throw new ServiceUnavailableException(
        'AWS SES credentials not found in the environment variables. Please provide them',
      );
    }
    return { accessKeyId, secretAccessKey, region, domain };
  }
}
