import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  IEmailServiceInterface,
  IEmailServiceToken,
} from '@api/modules/email/email.service.interface';
import { AppConfig } from '@api/utils/app-config';

@Injectable()
export class EtlNotificationService {
  private readonly logger = new Logger(EtlNotificationService.name);
  private readonly etlProcessEmails: string[];

  constructor(
    @Inject(IEmailServiceToken)
    private readonly emailService: IEmailServiceInterface,
  ) {
    this.etlProcessEmails = AppConfig.getETLProcessEmails();
  }

  async sendSuccessNotification(): Promise<void> {
    if (this.etlProcessEmails.length === 0) {
      this.logger.warn(
        'No ETL process emails configured, skipping success notification',
      );
      return;
    }

    const subject = '4-Growth ETL Process - Success';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">✅ ETL Process Completed Successfully</h2>
        <p>The scheduled ETL process has completed successfully.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Process Details:</h3>
          <ul style="margin: 10px 0;">
            <li><strong>Status:</strong> Success</li>
            <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
            <li><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</li>
          </ul>
        </div>
        <p>The data has been updated successfully and is now available in the application.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">This is an automated message from the 4-Growth ETL process.</p>
      </div>
    `;

    const textContent = `
ETL Process Completed Successfully

The scheduled ETL process has completed successfully.

Process Details:
- Status: Success
- Timestamp: ${new Date().toISOString()}
- Environment: ${process.env.NODE_ENV || 'development'}

The data has been updated successfully and is now available in the application.

This is an automated message from the 4-Growth ETL process.
    `;

    await this.sendEmailToAllRecipients(subject, htmlContent, textContent);
  }

  async sendFailureNotification(error: Error): Promise<void> {
    if (this.etlProcessEmails.length === 0) {
      this.logger.warn(
        'No ETL process emails configured, skipping failure notification',
      );
      return;
    }

    const subject = '4-Growth ETL Process - Failed';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">❌ ETL Process Failed</h2>
        <p>The scheduled ETL process has failed and requires attention.</p>
        <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <h3 style="color: #721c24; margin-top: 0;">Error Details:</h3>
          <ul style="margin: 10px 0;">
            <li><strong>Status:</strong> Failed</li>
            <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
            <li><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</li>
            <li><strong>Error Message:</strong> ${error.message}</li>
          </ul>
        </div>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Stack Trace:</h3>
          <pre style="background-color: #e9ecef; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 12px;">${error.stack || 'No stack trace available'}</pre>
        </div>
        <p><strong>Action Required:</strong> Please check the application logs and resolve the issue before the next scheduled run.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">This is an automated message from the 4-Growth ETL process.</p>
      </div>
    `;

    const textContent = `
ETL Process Failed

The scheduled ETL process has failed and requires attention.

Error Details:
- Status: Failed
- Timestamp: ${new Date().toISOString()}
- Environment: ${process.env.NODE_ENV || 'development'}
- Error Message: ${error.message}

Stack Trace:
${error.stack || 'No stack trace available'}

Action Required: Please check the application logs and resolve the issue before the next scheduled run.

This is an automated message from the 4-Growth ETL process.
    `;

    await this.sendEmailToAllRecipients(subject, htmlContent, textContent);
  }

  private async sendEmailToAllRecipients(
    subject: string,
    html: string,
    text: string,
  ): Promise<void> {
    const promises = this.etlProcessEmails.map(async (email) => {
      try {
        await this.emailService.sendMail({
          from: 'etl-process',
          to: email,
          subject,
          html,
          text,
        });
        this.logger.log(`ETL notification sent to ${email}`);
      } catch (error) {
        this.logger.error(`Failed to send ETL notification to ${email}`, error);
      }
    });

    await Promise.allSettled(promises);
  }
}
