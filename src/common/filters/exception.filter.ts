import { Catch, ArgumentsHost, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

enum MysqlErrorCode {
  ALREADY_EXIST = 'ER_DUP_ENTRY',
}

@Catch()
export class ExceptionsFilter {
  private readonly logger: Logger = new Logger();

  public catch(exception: unknown, host: ArgumentsHost): void {
    let args: unknown;

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const statusCode = this.getHttpStatus(exception);
    const datetime = new Date();

    const message: string =
      exception instanceof HttpException || exception instanceof QueryFailedError
        ? exception.message
        : 'UNKNOWN ERROR';

    const errorResponse = {
      code: statusCode,
      timestamp: datetime,
      path: req.url,
      method: req.method,
      message: message,
    };

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ err: errorResponse, args: { req, res } });
    } else {
      this.logger.warn({ err: errorResponse, args });
    }

    res.status(statusCode).json(errorResponse);
  }

  private getHttpStatus(exception: unknown): HttpStatus {
    if (
      exception instanceof QueryFailedError &&
      exception.driverError.code === MysqlErrorCode.ALREADY_EXIST
    ) {
      return HttpStatus.BAD_REQUEST;
    } else if (exception instanceof HttpException) return exception.getStatus();
    else return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
