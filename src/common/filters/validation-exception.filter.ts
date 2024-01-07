import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

import { ValidationException } from '../exceptions';
import { getHttpStatus } from './utils';
import { ExceptionResponse } from '../dto';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter<ValidationException> {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const { url, method } = ctx.getRequest<Request>();
    const statusCode = getHttpStatus(exception);
    const timestamp = new Date();
    const message = exception.message;
    const detail = exception.errors.map((error) => ({
      [error.property]: error.constraints,
    }));

    const exceptionResponse: ExceptionResponse = {
      statusCode,
      timestamp,
      path: url,
      method,
      message,
      detail,
    };

    // TODO add logger

    res.status(statusCode).json(exceptionResponse);
  }
}
