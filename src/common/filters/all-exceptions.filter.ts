import { Catch, ArgumentsHost, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ExceptionResponse } from '../dto';
// TODO Erase
enum MysqlErrorCode {
  ALREADY_EXIST = 'ER_DUP_ENTRY',
}
// TODO extends BaseExceptionFilter
@Catch()
export class AllExceptionsFilter {
  private readonly logger: Logger = new Logger();

  public catch(exception: unknown, host: ArgumentsHost): void {
    let args: unknown;
    let message: string | object = 'UNKNOWN ERROR';

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const statusCode = this.getHttpStatus(exception);
    const datetime = new Date();
    console.log('exception', exception);
    message = exception instanceof HttpException ? exception.message : message;
    message = exception instanceof QueryFailedError ? 'Already Exist' : message;

    const exceptionResponse: ExceptionResponse = {
      statusCode: statusCode,
      timestamp: datetime,
      path: req.url,
      method: req.method,
      message: message,
    };

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ err: exceptionResponse, args: { req, res } });
    } else {
      this.logger.warn({ err: exceptionResponse, args });
    }

    res.status(statusCode).json(exceptionResponse);
  }

  private getHttpStatus(exception: unknown): HttpStatus {
    if (
      exception instanceof QueryFailedError &&
      exception.driverError.code === MysqlErrorCode.ALREADY_EXIST
    ) {
      return HttpStatus.CONFLICT;
    } else if (exception instanceof HttpException) return exception.getStatus();
    else return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
