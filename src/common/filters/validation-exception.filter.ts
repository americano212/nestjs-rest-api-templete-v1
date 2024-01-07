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
    const req = ctx.getRequest<Request>();
    const statusCode = getHttpStatus(exception);
    const message = exception.message;
    const detail = exception.errors.map((error) => ({
      [error.property]: error.constraints,
    }));
    const datetime = new Date();
    const exceptionResponse: ExceptionResponse = {
      statusCode: statusCode,
      timestamp: datetime,
      path: req.url,
      method: req.method,
      message: message,
      detail: detail,
    };
    console.log('Check2');
    res.status(statusCode).json(exceptionResponse);
  }
}
