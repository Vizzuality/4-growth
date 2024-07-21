import {
  IEmailServiceInterface,
  IEmailServiceToken,
} from '@api/modules/email/email.service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

export type PasswordRecovery = {
  email: string;
  token: string;
  url: string;
};

@Injectable()
export class PasswordRecoveryEmailService {
  logger: Logger = new Logger(PasswordRecoveryEmailService.name);
  constructor(
    @Inject(IEmailServiceToken)
    private readonly emailService: IEmailServiceInterface,
  ) {}

  async sendPasswordRecoveryEmail(
    passwordRecovery: PasswordRecovery,
  ): Promise<void> {
    // TODO: Investigate if it's worth using a template engine to generate the email content, the mail service provider allows it

    const resetPasswordUrl = `${passwordRecovery.url}/reset-password?token=${passwordRecovery.token}`;

    const htmlContent: string = `
    <h1>Dear User,</h1>
    <br/>
    <p>We recently received a request to reset your password for your 4-Growth account. If you made this request, please click on the link below to securely change your password:</p>
    <br/>
    <p><a href="${resetPasswordUrl}">Secure Password Reset Link</a></p>
    <br/>
    <p>This link will direct you to our app to create a new password. For security reasons, this link will expire after ${'introduce recover expiration'}.</p>
    <p>If you did not request a password reset, please ignore this email; your password will remain the same.</p>
    <br/>
    <p>Thank you for using 4-Growth. We're committed to ensuring your account's security.</p>
    <p>Best regards.</p>`;

    await this.emailService.sendMail({
      from: 'password-recovery',
      to: passwordRecovery.email,
      subject: 'Recover Password',
      html: htmlContent,
    });
    this.logger.log(
      `Password recovery email sent to ${passwordRecovery.email}`,
    );
  }
}
