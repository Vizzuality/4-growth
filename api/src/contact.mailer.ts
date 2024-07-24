import {
  IEmailServiceInterface,
  IEmailServiceToken,
} from '@api/modules/email/email.service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { ContactUsSchema } from '@shared/schemas/contact.schema';
import { AppConfig } from '@api/utils/app-config';

export type ContactForm = z.infer<typeof ContactUsSchema>;

@Injectable()
export class ContactMailer {
  logger: Logger = new Logger(ContactMailer.name);
  contactAddress: string;

  constructor(
    @Inject(IEmailServiceToken)
    private readonly mailer: IEmailServiceInterface,
  ) {
    const { contactEmail } = AppConfig.get<{ contactEmail: string }>('email');
    this.contactAddress = contactEmail;
  }

  async sendContactMail(contactForm: ContactForm): Promise<void> {
    const { name, email, message } = contactForm;
    const subject = `Contact Form Submission from ${name} <${email}>`;
    await this.mailer.sendMail({
      from: 'contact',
      to: this.contactAddress,
      subject,
      html: `<p>${message}</p>`,
      text: message,
    });
    this.logger.log(`Contact email sent from ${email}`);
  }
}
