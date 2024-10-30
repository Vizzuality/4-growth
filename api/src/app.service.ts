import { Injectable } from '@nestjs/common';
import { ContactForm, ContactMailer } from '@api/contact.mailer';

@Injectable()
export class AppService {
  constructor(private readonly contactMailer: ContactMailer) {}

  async contact(contactForm: ContactForm): Promise<void> {
    await this.contactMailer.sendContactMail(contactForm);
  }
}
