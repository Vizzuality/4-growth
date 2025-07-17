# ETL Process Email Notifications

This document describes the implementation of email notifications for the ETL process in the 4-Growth application.

## Overview

The ETL process now sends email notifications to configured recipients when the data update process completes (either successfully or with an error).

## Configuration

### Environment Variable

Set the `ETL_PROCESS_EMAILS` environment variable with a comma-separated list of email addresses:

```bash
ETL_PROCESS_EMAILS="admin@example.com,dev@example.com,ops@example.com"
```

### Configuration Files

The email addresses are mapped in:

- `config/custom-environment-variables.json` - maps environment variable to config path
- `config/default.json` - provides default value for development

## Implementation

### Files Modified/Created

1. **`/api/config/custom-environment-variables.json`**

   - Added mapping for `ETL_PROCESS_EMAILS` environment variable

2. **`/api/config/default.json`**

   - Added default value for `etlProcessEmails`

3. **`/api/src/utils/app-config.ts`**

   - Added `getETLProcessEmails()` method to retrieve and parse email addresses

4. **`/api/src/infrastructure/etl-notification.service.ts`** (NEW)

   - Service responsible for sending ETL process notifications
   - Handles both success and failure notifications
   - Uses existing email service infrastructure

5. **`/api/src/infrastructure/data-source-manager.ts`**

   - Updated to use `EtlNotificationService`
   - Sends notifications on ETL success or failure

6. **`/api/src/app.module.ts`**
   - Registered `EtlNotificationService` as a provider

### ETL Schedule

The ETL process runs every Sunday at 3:00 AM using the cron expression: `0 3 * * 0`

### Email Templates

#### Success Notification

- **Subject**: "4-Growth ETL Process - Success"
- **Content**: Includes timestamp, environment, and success status
- **Format**: Both HTML and plain text

#### Failure Notification

- **Subject**: "4-Growth ETL Process - Failed"
- **Content**: Includes timestamp, environment, error message, and stack trace
- **Format**: Both HTML and plain text

### Email Service Integration

The notifications use the existing email service infrastructure:

- AWS SES for sending emails
- Same configuration as contact form emails
- Automatic retry handling for individual recipient failures

### Error Handling

- If no email addresses are configured, a warning is logged but the ETL process continues
- Email sending failures are logged but don't affect the ETL process
- Individual recipient failures don't prevent emails from being sent to other recipients

## Usage

1. Set the `ETL_PROCESS_EMAILS` environment variable with desired recipient addresses
2. The ETL process will automatically send notifications when it runs
3. Check application logs for email sending status and any errors

## Testing

To manually test the notification system:

1. Set `ETL_PROCESS_EMAILS` environment variable
2. Trigger the ETL process manually (if method exists) or wait for scheduled run
3. Check recipients' inboxes for notification emails
4. Verify application logs for email sending status

## Security Considerations

- Email addresses are stored in configuration, not hard-coded
- Email content includes environment information for context
- Stack traces are included in failure notifications for debugging
- No sensitive data is included in email content
