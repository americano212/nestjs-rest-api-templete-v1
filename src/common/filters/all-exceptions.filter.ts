import { Catch, ArgumentsHost, HttpStatus, Logger, ExceptionFilter } from '@nestjs/common';

import { Request, Response } from 'express';
import { ExceptionResponse } from '../dto';

import { getDetail, getHttpStatus, getMessage } from './utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger();

  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    // TODO combine getExceptionDetail
    const statusCode = getHttpStatus(exception);
    const message = getMessage(exception);
    const detail = getDetail(exception); // Exception-Response

    const exceptionResponse: ExceptionResponse = {
      statusCode,
      timestamp: new Date(),
      path: req.url,
      method: req.method,
      message,
      detail,
    };

    const args = req.body;
    this.exceptionLogging(exceptionResponse, args);
    console.log('check-all');

    res.status(statusCode).json(exceptionResponse);
  }

  // TODO seperate logger
  private exceptionLogging(exceptionResponse: ExceptionResponse, args?: object): void {
    if (exceptionResponse.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ err: exceptionResponse, args });
    } else {
      this.logger.warn({ err: exceptionResponse, args: {} });
    }
  }
}
