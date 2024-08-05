import { Injectable } from '@nestjs/common';
import { ContactForm, ContactMailer } from '@api/contact.mailer';

@Injectable()
export class AppService {
  constructor(private readonly contactMailer: ContactMailer) {}
  getHello(): string {
    return 'Hello World!';
  }

  async contact(contactForm: ContactForm): Promise<void> {
    await this.contactMailer.sendContactMail(contactForm);
  }
}
