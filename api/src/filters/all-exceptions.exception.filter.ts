import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import * as config from 'config';
import * as JSONAPISerializer from 'jsonapi-serializer';
import { JSONAPIError, JSONAPIErrorOptions } from 'jsonapi-serializer';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { RequestValidationError } from '@ts-rest/nest';
import { ZodError } from 'zod';

/**
 * Catch-all exception filter. Output error data to logs, and send it as
 * response payload, serialized according to JSON:API spec.
 *
 * @debt The error handling logic for general cases should be moved to a utility
 * module, with option to extend it for specific per-service scenarios.
 */
@Catch(Error)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: any = ctx.getResponse();
    const request: any = ctx.getRequest();

    let status: number;
    const errors: JSONAPIErrorOptions[] = [];
    if (this.isZodRequestValidationError(exception)) {
      const errorDataForResponse: JSONAPIError = new JSONAPISerializer.Error(
        this.handleZodValidationErrorMessages(exception),
      );
      return response.status(exception.getStatus()).json(errorDataForResponse);
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      const errorMessages = this.handleExceptionMessages(exceptionResponse);
      for (const message of errorMessages) {
        const errorData: JSONAPIErrorOptions = {
          status: status.toString(10),
          title: message,
          meta: {
            timestamp: new Date().toISOString(),
            path: request.url,
            type: Object.getPrototypeOf(exception)?.name,
          },
        };
        if (['development', 'test'].includes(config.util.getEnv('NODE_ENV'))) {
          errorData.meta.rawError = exception;
          errorData.meta.stack = exception.stack;
        }
        errors.push(errorData);
      }
    } else {
      status = 500;
      errors.push({
        status: status.toString(10),
        title: exception.message,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (status >= 500) {
      Logger.error(errors);
    } else {
      Logger.warn(errors);
    }

    /**
     * When *not* running in a development environment, we strip off raw error
     * details and stack trace.
     *
     * @todo We should remove raw error details from the HTTP response payload
     * even in development environments at some point, but for the time being
     * these should help frontend devs and other API users report bugs or other
     * issues without having to look at logs.
     */
    const errorDataForResponse: JSONAPIError = new JSONAPISerializer.Error(
      errors,
    );

    response.status(status).json(errorDataForResponse);
  }

  handleExceptionMessages(exceptionResponse: any): string[] {
    const messages = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message
      : [exceptionResponse.message];
    return messages;
  }

  isZodRequestValidationError(
    exception: any,
  ): exception is RequestValidationError {
    return exception instanceof RequestValidationError;
  }

  handleZodValidationErrorMessages(
    exception: RequestValidationError,
  ): JSONAPIErrorOptions[] {
    console.log(exception);
    const errors: JSONAPIErrorOptions[] = exception.body.issues.map(
      (issue): JSONAPIErrorOptions => {
        return {
          status: exception.getStatus().toString(10),
          title: issue.message,
          detail: JSON.stringify(issue),
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
      },
    );
    return errors;
  }
}
