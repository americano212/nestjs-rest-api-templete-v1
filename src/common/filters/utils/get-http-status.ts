import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

import { MysqlErrorCode } from 'src/common/enums';

export function getHttpStatus(exception: unknown): HttpStatus {
  if (
    exception instanceof QueryFailedError &&
    exception.driverError.code === MysqlErrorCode.ALREADY_EXIST
  ) {
    return HttpStatus.CONFLICT;
  } else if (exception instanceof HttpException) return exception.getStatus();
  else return HttpStatus.INTERNAL_SERVER_ERROR;
}
