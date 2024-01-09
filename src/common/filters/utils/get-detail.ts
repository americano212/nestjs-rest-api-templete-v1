import { HttpException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

import { ValidationException } from 'src/common/exceptions';

export function getDetail(exception: unknown): string | Array<object> | object {
  let detail: string | Array<object> | object = '';
  if (exception instanceof HttpException) {
    detail = exception.getResponse;
  }
  if (exception instanceof QueryFailedError) {
    detail = { query: exception.query, parameters: exception.parameters };
  }
  if (exception instanceof ValidationException) {
    detail = exception.errors.map((error) => ({
      [error.property]: error.constraints,
    }));
  }

  return detail;
}
