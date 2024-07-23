import {
  IEmailServiceInterface,
  IEmailServiceToken,
} from '@api/modules/email/email.service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AppConfig } from '@api/utils/app-config';

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

    const resetPasswordUrl = `${passwordRecovery.url}/auth/forgot-password/${passwordRecovery.token}`;

    const htmlContent: string = `
    <h1>Dear User,</h1>
    <br/>
    <p>We recently received a request to reset your password for your 4-Growth account. If you made this request, please click on the link below to securely change your password:</p>
    <br/>
    <p><a href="${resetPasswordUrl}" target="_blank" rel="noopener noreferrer">Secure Password Reset Link</a></p>
    <br/>
    <p>This link will direct you to our app to create a new password. For security reasons, this link will expire after ${passwordRecoveryTokenExpirationHumanReadable()}.</p>
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

const passwordRecoveryTokenExpirationHumanReadable = (): string => {
  const { passwordRecoveryExpiresIn: expiration } = AppConfig.getJWTConfig();
  const unit = expiration.slice(-1);
  const value = parseInt(expiration.slice(0, -1), 10);

  switch (unit) {
    case 'h':
      return `${value} hour${value > 1 ? 's' : ''}`;
    case 'd':
      return `${value} day${value > 1 ? 's' : ''}`;
    default:
      return expiration;
  }
};
